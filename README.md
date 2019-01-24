# Mozilla Pulse

[![Travis Build Status](https://travis-ci.org/mozilla/network-pulse.svg?branch=master)](https://travis-ci.org/mozilla/network-pulse) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/mozilla/network-pulse?svg=true)](https://ci.appveyor.com/project/mozillafoundation/network-pulse)

Pulse is a platform that helps the Mozilla Network capture and broadcast its projects and activities. [mozillapulse.org](https://www.mozillapulse.org/featured)

Around the globe, teachers, engineers, activists, and others collaborate to protect and extend the internet as a public resource. They create amazing apps, art, tools, games, and campaigns. Their impact is tremendous, but decentralized and difficult to track, even within the network.

Pulse reveals the network's footprint, it fosters collaboration and amplifies the big wins.

## Contribute

### Testing

Interested in contributing to this project? A good place to start is by helping with [Quality Tests](https://github.com/mozilla/network-pulse/wiki/Quality-Tests). File a [new issue](https://github.com/mozilla/network-pulse/issues) to say hello and let us know that you're interested.

### Fix bugs or help with new features

Browse the [issues](https://github.com/mozilla/network-pulse/issues). Look for the labels [enhancement](https://github.com/mozilla/network-pulse/labels/enhancement), [help wanted](https://github.com/mozilla/network-pulse/labels/help%20wanted), [good first issue](https://github.com/mozilla/network-pulse/labels/good%20first%20issue).

## Development

### Requirements

- `node`
- `npm`

### Setup

```bash
$> git clone https://github.com/mozilla/network-pulse.git
$> cd network-pulse
$> npm install
```

If you would like to override default environment variables... create a `.env` file on the root directory and set your env vars there. See [environment variables section](https://github.com/mozilla/network-pulse#environment-variables) for details.

### Key scripts to run

#### `npm start`
This starts server in development mode. See [environment variables section](https://github.com/mozilla/network-pulse#environment-variables) for `PORT` number.

#### `npm test`
This starts a few test scripts. Don't forget to run this command and fix errors (if any) before you git push your changes.

#### `npm optimize`
This starts a few image optimization scripts.

### Environment variables

   Name | Description
------------------|---------------------------------------------
`PORT` | Default: `process.env.PORT`(falls back to `3000` if `process.env.PORT` cannot be found)<br><br>The port number you are running the server on.
`PULSE_API` | Default: `https://pulse-api.mofostaging.net/api/pulse`<br><br>URL to Pulse API. e.g., `http://test.example.com:8000/api/pulse`. <br>To set up a local instance of Pulse API, follow instructions on [Pulse API README doc](https://github.com/mozilla/network-pulse-api/blob/master/README.md).
`PULSE_LOGIN_URL` | Default: `https://pulse-api.mofostaging.net/accounts/login/`<br><br>URL to use to login to Pulse. This needs to be a Pulse API login url.
`PULSE_LOGOUT_URL` | Default: `https://pulse-api.mofostaging.net/accounts/logout/`<br><br>URL to use to logout of Pulse. This needs to be a Pulse API logout url.
`PROJECT_BATCH_SIZE`| Default: `24`<br><br>Number of projects you want to display as a batch. Make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes.
`LEARN_MORE_LINK` | Default: `https://www.mozillapulse.org/entry/120`<br><br>Link to learn more about what Pulse project is about.
`NODE_ENV` | Default: `development`<br><br>When this is set to `production`, it enables production specific express settings and middleware
`APP_HOST` | Default: `localhost`<br><br>The domain which this app should serve. It's only used when `NODE_ENV` is set to `production`
## Deployment

### Staging

URL: https://network-pulse-staging.herokuapp.com/

Updates to `master` branch automatically triggers staging deployment.

### Production

URL: https://mozillapulse.org

Deployment is done using the Heroku pipeline. Simply click "Promote To Production".
