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
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

ReactDOM.render((
  <Router routes={routes} history={browserHistory} onUpdate={logPageView} />
), document.getElementById(`app`));
