# <img src="https://github.com/mozilla/network-pulse/blob/gh-pages/favicon.png?raw=true" /> Network Pulse

This is a prototype to test a few ideas on how to gather a stream of things created by a network of people and organizations. The goals: keep friction low to maximize input; optimize signal and noise to surface interesting projects. The theory: do this well and more instances of collaboration and innovation will emerge from the network.

## 🔷 v2, React-based (upcoming)

- https://pulse-react.herokuapp.com to check out what have been implemented
- Work is happening in the `react` branch.
- Relevant tickets are marked with the `v2 (upcoming)` label.

### Requirements for Development

- `node`
- `npm`

### Setup for Development

- `git clone -b react https://github.com/mozilla/network-pulse.git`
- `cd network-pulse`
- `cp sample.env .env` (and modify values in sample.env so they match what you use for your local development env)
    ```bash
    HOST='the host you are using'
    PORT='the port number you are using'
    PULSE_API='URL to your local Pulse API instance. Remove this var if you don't have one set up.'
    ```
- `npm install`
- `npm start`

To set up a local instance of Pulse API, follow instructions on https://github.com/mozilla/network-pulse-api/blob/master/README.md.

## 🔷 More info

 - [Research doc](https://docs.google.com/document/d/1SAAuPgOaVqpQorrbD0vZSnf8wHHYjddPyYrkrFj72kQ/)
 - [Priority setting doc](https://docs.google.com/presentation/d/1jwD5I3y1hT3LRwqY5fPlIn54DiJ5whWnuAK5G8OuEIY/)

## 🔷 Contribute

You can contribute by testing https://pulse-react.herokuapp.com. File [issues](https://github.com/mozilla/network-pulse/issues) with bugs or suggestions. 


