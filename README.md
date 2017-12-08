[![Travis Build Status](https://travis-ci.org/mozilla/network-pulse.svg?branch=master)](https://travis-ci.org/mozilla/network-pulse) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/mozilla/network-pulse?svg=true)](https://ci.appveyor.com/project/mozillafoundation/network-pulse) [![Dependency Status](https://david-dm.org/mozilla/network-pulse.svg)](https://david-dm.org/mozilla/network-pulse) [![Dev Dependency Status](https://david-dm.org/mozilla/network-pulse/dev-status.svg)](https://david-dm.org/mozilla/network-pulse/?type=dev)

# Mozilla Pulse

Pulse is a platform that helps the Mozilla Network capture and broadcast its projects and activities. [mozillapulse.org](https://www.mozillapulse.org/featured)

Around the globe, teachers, engineers, activists, and others collaborate to protect and extend the internet as a public resource. They create amazing apps, art, tools, games, and campaigns. Their impact is tremendous, but decentralized and difficult to track, even within the network.

Pulse reveals the network's footprint, it fosters collaboration and amplifies the big wins.


## Contribute

### Testing

Interested in contributing to this project? A good place to start is by helping with [Quality Tests](https://github.com/mozilla/network-pulse/wiki/Quality-Tests). File a [new issue](https://github.com/mozilla/network-pulse/issues) to say hello and let us know that you're interested.  

### Fix bugs or help with new features

Browse the [issues](https://github.com/mozilla/network-pulse/issues). Look for the labels [enhancement](https://github.com/mozilla/network-pulse/labels/enhancement), [help wanted](https://github.com/mozilla/network-pulse/labels/help%20wanted), [good first issue](https://github.com/mozilla/network-pulse/labels/good%20first%20issue).


## Development

- Staging: https://network-pulse-staging.herokuapp.com
- Work is happening in the `master` branch.

### Requirements for Development

- `node`
- `npm`

### Setup for Development

- `git clone -b master https://github.com/mozilla/network-pulse.git`
- `cd network-pulse`
- `cp sample.env .env` (and modify values in sample.env so they match what you use for your local development env, see [environment variables section](https://github.com/mozilla/network-pulse#environment-variables))
- `npm install`
- `npm start`

### Environment Variables

#### `HOST`

The host you are using. e.g., `HOST=http://localhost`

#### `PORT`

The port number you are using. e.g., `PORT=3000`

#### `LEARN_MORE_LINK`

Link to learn more about what Pulse project is about. e.g., `LEARN_MORE_LINK=https://www.mozillapulse.org/entry/120`

#### `PULSE_API` (optional)

Default: `https://network-pulse-api-staging.herokuapp.com/`

URL to your local Pulse API instance (if you have one set up). e.g., `PULSE_API=http://test.example.com:8000/api/pulse`

To set up a local instance of Pulse API, follow instructions on https://github.com/mozilla/network-pulse-api/blob/master/README.md.

#### `ORIGIN` (auto-generated)

Derived variable based on `HOST` and `PORT` - overriding this yourself will do nothing.

#### `PROJECT_BATCH_SIZE` (optional)

Default: `24`

Number of projects you want to display as a batch. Make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes.

### Deployment

#### Staging

URL: https://network-pulse-staging.herokuapp.com/

Updates to `master` branch automatically triggers staging deployment.

#### Production

URL: https://mzl.la/pulse

Deployment is done manually.

Concretely, we need to do a deployment rather than a "promotion" because there is a client-side bundle that gets built during deploy, and relies on environment variables at build time. As the staging environment and production environment differ in environment variables, we can't build on staging and then promote to production, as that would simply make our staging client "live".

To manually deploy production site:

1. Go to Heroku dashboard.
2. Find `network-pulse-production` app.
3. In the "Deploy" tab, scroll down to the "Manual deploy" section.
4. Deploy `master` branch. (see screencap below)
<img width="1062" alt="screen shot 2017-03-02 at 10 20 51 am" src="https://cloud.githubusercontent.com/assets/2896608/23521344/68f4d750-ff33-11e6-9ff4-e669ffa938f7.png">
