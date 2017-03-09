import express from 'express';
import path from 'path';
import helmet from 'helmet';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes.jsx';
import securityHeaders from './js/security-headers';

const app = express();

// Find the port we're using. If we're deployed on heroku,
// that information will not be in our config because the
// bundle compilation will have taken place on a different
// dyno from where the code actually runs, but is available
// at runtime as a PORT environment variable

import env from "./config/env.generated.json";

const defaultPort = 3000;
const PORT = env.PORT || process.env.PORT || defaultPort;

// disable x-powered-by
app.disable('x-powered-by');

// Some app security settings

app.use(helmet.contentSecurityPolicy(securityHeaders));

app.use(helmet.xssFilter({
  setOnOldIE: true
}));

// maxAge for HSTS header must be at least 18 weeks (see https://hstspreload.org/)
app.use(helmet.hsts({
  maxAge: 60 * 60 * 24 * 7 * 18, // 18 weeks in seconds
  setIf: (req, res) => {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "https") {
      return true;
    }

    return false;
  },
  includeSubDomains: true,
  preload: true
}));

app.use(helmet.ieNoOpen());

app.use(helmet.noSniff());

app.use(helmet.frameguard({
  action: 'deny'
}));

// make sure that heroku content is always on https
// (or really, anything that relies on x-forwarded-proto)
app.use((req, res, next) => {
  if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.use(express.static(path.resolve(__dirname, `dist`)));

app.get(`*`, (req, res) => {
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else if (props) {
      // we've got props!
      // let's match a route and render the corresponding page component
      const appHtml = renderToString(<RouterContext {...props}/>);

      if (props.components[props.components.length-1].displayName === `not-found`) {
        // if route matches the "Not Found" route, let's render the "Not Found" 404 page
        res.status(404).send(renderPage(appHtml));
      } else {
        res.status(200).send(renderPage(appHtml));
      }
    } else {
      // nothing was matched
      res.status(404).send(`Not Found`);
    }
  });
});

function renderPage(appHtml) {
  // this is basically the same as what we have in ./index.html,
  // except that we are inserting appHtml as inner DOM of <div id="app"></div>
  return `<!doctype html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta charset="utf-8">
                <link rel="icon" type="image/png" sizes="36x36" href="/favicon.png">
                <link rel="icon" type="image/png" sizes="128x128" href="/assets/favicons/favicon-128x128@2x.png">
                <link rel="apple-touch-icon" type="image/png" sizes="152x152" href="/assets/favicons/touch-icon-ipad.png">
                <link rel="apple-touch-icon" type="image/png" sizes="167x167" href="/assets/favicons/touch-icon-ipad-retina.png">
                <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="/assets/favicons/touch-icon-iphone-retina.png">
                <link rel="manifest" href="/manifest.json">
                <link rel="stylesheet" type="text/css" href="https://code.cdn.mozilla.net/fonts/fira.css">
                <link rel="stylesheet" type="text/css" href="/css/mofo-bootstrap.css">
                <link rel="stylesheet" type="text/css" href="/css/font-awesome.min.css">
                <link rel="stylesheet" type="text/css" href="/css/main.css">
                <title>Mozilla Network Pulse</title>
              </head>
              <body>
                <div id="app">${appHtml}</div>
                <script src="/bundle.js"></script>
              </body>
            </html>`;
}

app.listen(PORT, () => {
  console.log(`\n*******************************************`);
  console.log(`*                                         *`);
  console.log(`*  Network Pulse listening on port ${PORT}   *`);
  console.log(`*                                         *`);
  console.log(`*******************************************\n`);
});
