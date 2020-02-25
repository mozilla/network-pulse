// Post a message on Slack when the Heroku ReviewApp is ready to be used.
// To run: `node -r dotenv/config js/review-app-slack-webhook.js`

const https = require("https");

const reviewapp_name = process.env.HEROKU_APP_NAME;
const pr_number = process.env.HEROKU_PR_NUMBER;
const branch_name = process.env.HEROKU_BRANCH;

const github_token = process.env.GITHUB_TOKEN;
const org = "mozilla";
const repo = "network-pulse";
const slack_webhook = process.env.SLACK_WEBHOOK;

// As of 01/2020 we can only get the PR number if the review app was automatically created
// (https://devcenter.heroku.com/articles/github-integration-review-apps#injected-environment-variables).
// For review app manually created, we have to use the branch name instead.

const request = (url, options) => {
  console.log(`\n\n\n[new request] ${url}`);
  return new Promise((resolve, reject) => {
    https
      .get(url, options, res => {
        let body = "";
        res.on("data", chunk => (body += chunk));
        res.on("end", () => {
          // console.log(res);
          let statusCode = res.statusCode;
          console.log(res);
          console.log(`\n`);
          if (statusCode !== 200) {
            // reject(`Status ${statusCode} ${statusMessage}`);
            throw new Error(`Status ${statusCode} ${statusMessage}`);
          } else {
            console.log(`else`);
            resolve(body);
          }
        });
      })
      .on("error", e => {
        console.log(`on error`);
        reject(e);
      });
  });
};

const postToSlack = () => {
  request(slack_webhook, {
    method: "POST",
    header: { "Content-Type": "application/json" },
    json: slack_payload
  })
    .then(() => {})
    .catch(sError => {
      console.log(`postToSlackError`);
      console.log(sError);
    });
};

let slack_payload = {
  attachments: [
    {
      fallback: `New review app deployed: It will be ready in a minute!\n
                        Branch: ${branch_name}\n
                        Login: use your staging credentials\n
                        URL: https://${reviewapp_name}.herokuapp.com`,
      pretext: "New review app deployed: It will be ready in a minute!",
      title: `Branch: ${branch_name}`,
      text: "Login: use your staging credentials",
      color: "#7CD197",
      actions: [
        {
          type: "button",
          text: "View review app",
          url: `https://${reviewapp_name}.herokuapp.com`
        },
        {
          type: "button",
          text: "View branch on Github",
          url: `https://github.com/mozilla/network-pulse/tree/${branch_name}`
        }
      ]
    }
  ]
};

if (pr_number) {
  request(`https://api.github.com/repos/${org}/${repo}/pulls/${pr_number}`, {
    method: "GET",
    headers: { "User-Agent": "request" },
    Authorization: `token ${github_token}`
  })
    .then(gBody => {
      console.log(`then`);
      const pr_title = JSON.parse(gBody)["title"];

      let color = "#7CD197";
      for (let label of JSON.parse(gBody)["labels"]) {
        if (label["name"] === "dependencies") {
          color = "#BA55D3";
        }
      }

      slack_payload = {
        attachments: [
          {
            fallback: `New review app deployed: It will be ready in a minute!\n
                        PR ${pr_number}: ${pr_title}\n
                        Login: use your staging credentials\n
                        URL: https://${reviewapp_name}.herokuapp.com`,
            pretext: "New review app deployed: It will be ready in a minute!",
            title: `PR ${pr_number}: ${pr_title}`,
            text: "Login: use your staging credentials",
            color: `${color}`,
            actions: [
              {
                type: "button",
                text: "View review app",
                url: `https://${reviewapp_name}.herokuapp.com`
              },
              {
                type: "button",
                text: "View PR on Github",
                url: `https://github.com/mozilla/network-pulse/pull/${pr_number}`
              }
            ]
          }
        ]
      };

      postToSlack(slack_payload);
    })
    .catch(error => {
      console.log(`catch`);
      console.log(error);
    });
} else {
  postToSlack(slack_payload);
}
