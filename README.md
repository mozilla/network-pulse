# <img src="https://github.com/mozilla/network-pulse/blob/gh-pages/favicon.png?raw=true" /> Network Pulse

This is a prototype to test a few ideas on how to gather a stream of things created by a network of people and organizations. The goals: keep friction low to maximize input; optimize signal and noise to surface interesting projects. The theory: do this well and more instances of collaboration and innovation will emerge from the network.

## 🔷 v1, jQuery-based (to be retired soon)

- https://mozilla.github.io/network-pulse/ (to be retired soon)
- See `v1` branch.

## 🔷 v2, React-based (upcoming)

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

#### `PULSE_API` (optional)

URL to your local Pulse API instance (if you have one set up). e.g., `PULSE_API=http://test.example.com:8000`

To set up a local instance of Pulse API, follow instructions on https://github.com/mozilla/network-pulse-api/blob/master/README.md.

#### `ORIGIN` (auto-generated)

Derived variable based on `HOST` and `PORT` - overriding this yourself will do nothing.

## 🔷 More info

 - [Research doc](https://docs.google.com/document/d/1SAAuPgOaVqpQorrbD0vZSnf8wHHYjddPyYrkrFj72kQ/)
 - [Priority setting doc](https://docs.google.com/presentation/d/1jwD5I3y1hT3LRwqY5fPlIn54DiJ5whWnuAK5G8OuEIY/)

## 🔷 Contribute

You can contribute by testing https://network-pulse-staging.herokuapp.com. File [issues](https://github.com/mozilla/network-pulse/issues) with bugs or suggestions. 
