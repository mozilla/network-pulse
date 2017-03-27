import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Analytics from './js/analytics.js';
import routes from './routes.jsx';
import pageSettings from './js/app-page-settings';

Analytics.initialize();

let routerUpdateHandler = function() {
  Analytics.logPageView();
  pageSettings.setCurrentPathname(this.state.location.pathname);
};

ReactDOM.render((
  <Router routes={routes} history={browserHistory} onUpdate={routerUpdateHandler} />
), document.getElementById(`app`));
