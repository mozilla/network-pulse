// Before we load anything: are we in the browser, and do we need to be on https instead?
if (typeof window !== "undefined" && typeof document !== "undefined") {
  let loc = window.location;
  // are we in a context that claims we're on a URL, and is tht URL not on https?
  if (loc && loc.protocol !== "https") {
    // are we not doing local development work?
    switch (loc.hostname) {
      case "localhost": break;
      case "test.example.org": break;
      case "test.example.com": break;
      // we are not: switch to https instead of whatever we're using now.
      default: window.location.protocol = "https:";
    }
  }
}

// If we get to this point, we didn't need to switch protocols: load the client App
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import { Router, browserHistory } from 'react-router';
import routes from './routes.jsx';

// TODO:FIXME: this is a tempory UA code for testing.
// Once https://github.com/MozillaFoundation/mofo-devops/issues/452 is completed
// we should replace it with the real UA code.
ReactGA.initialize(`UA-91389561-1`);

function logPageView() {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#set
  ReactGA.set({ page: window.location.pathname });
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#location
  ReactGA.set({ location: window.location.href });

  ReactGA.pageview(`${window.location.pathname}/${window.location.search}`);
}

ReactDOM.render((
  <Router routes={routes} history={browserHistory} onUpdate={logPageView} />
), document.getElementById(`app`));
