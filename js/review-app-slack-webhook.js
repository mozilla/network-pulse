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

const request = (url, options, postData = ``) => {
  return new Promise((resolve, reject) => {
    let req = https
      .request(url, options, res => {
        let body = "";
        let statusCode = res.statusCode;

        res.on("data", chunk => (body += chunk));
        res.on("end", () => {
          if (statusCode !== 200) {
            throw new Error(`Status ${statusCode}\n Error message: ${body}`);
          }
          resolve(body);
        });
      })
      .on("error", e => {
        reject(e);
      });

    if (options.method === `POST`) {
      req.write(postData);
    }

    req.end();
  });
};

const postToSlack = () => {
  let data = JSON.stringify(slack_payload);

  request(
    slack_webhook,
    {
      method: "POST",
      header: { "Content-Type": "application/json" },
      "Content-Length": data.length
    },
    data
  )
    .then(() => {})
    .catch(sError => {
      console.log(sError);
    });
};

// Review apps created from Heroku to deploy a branch
let slack_payload = {
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:computer: *[Devs] Branch: ${branch_name}*\nThis new review app will be ready in a minute!\n*Login:* use your staging credentials\n`
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View review app"
          },
          url: `https://${reviewapp_name}.herokuapp.com`
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View branch on Github"
          },
          url: `https://github.com/mozilla/network-pulse/tree/${branch_name}`
        }
      ]
    }
  ]
};

// Review apps created when opening a PR
if (pr_number) {
  request(`https://api.github.com/repos/${org}/${repo}/pulls/${pr_number}`, {
    method: "GET",
    headers: { "User-Agent": "request" },
    Authorization: `token ${github_token}`
  })
    .then(gBody => {
      const pr_title = JSON.parse(gBody)["title"];

      let pre_title = ":computer: *[Devs]*";
      for (let label of JSON.parse(gBody)["labels"]) {
        if (label["name"] === "dependencies") {
          pre_title = ":robot_face: *[Dependabot]*";
        }
      }

      slack_payload = {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${pre_title} *PR ${pr_number} - ${pr_title}*\nThis new review app will be ready in a minute!\n*Login:* use your staging credentials`
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "View review app"
                },
                url: `https://${reviewapp_name}.herokuapp.com`
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "View PR on Github"
                },
                url: `https://github.com/mozilla/network-pulse/tree/${pr_number}`
              }
            ]
          }
        ]
      };

      postToSlack(slack_payload);
    })
    .catch(error => {
      console.log(error);
    });
} else {
  postToSlack(slack_payload);
}
