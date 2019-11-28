// Post a message on Slack when the Heroku ReviewApp is ready to be used.
// To run: `node -r dotenv/config js/review-app-slack-webhook.js`

const request = require("request");

// Get the PR's number: we need it to get the PR's title.
const reviewapp_name = process.env.HEROKU_APP_NAME;
const re = /\d+/;
const pr_number = re.exec(reviewapp_name)[0];

const github_token = process.env.GITHUB_TOKEN;
const org = "mozilla";
const repo = "network-pulse";
const slack_webhook = process.env.SLACK_WEBHOOK;

request(
  `https://api.github.com/repos/${org}/${repo}/pulls/${pr_number}&access_token=${github_token}`,
  { headers: { "User-Agent": "request" } },
  function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const pr_title = JSON.parse(body)["title"];

      let color = "#7CD197";
      for (let label of JSON.parse(body)["labels"]) {
        if (label["name"] === "dependencies") {
          color = "#BA55D3";
        }
      }

      const slack_payload = {
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

      request.post(
        `${slack_webhook}`,
        { header: { "Content-Type": "application/json" }, json: slack_payload },
        function(error, response, body) {}
      );
    } else {
      console.log(error.message);
    }
  }
);
