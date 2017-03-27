import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Analytics from './js/analytics.js';
import routes from './routes.jsx';

Analytics.initialize();

let routerUpdateHandler = function() {
  Analytics.logPageView();
};

ReactDOM.render((
  <Router routes={routes} history={browserHistory} onUpdate={routerUpdateHandler} />
), document.getElementById(`app`));
