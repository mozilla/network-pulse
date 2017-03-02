import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Analytics from './js/analytics.js';
import routes from './routes.jsx';

Analytics.initialize();

ReactDOM.render((
  <Router routes={routes} history={browserHistory} onUpdate={Analytics.logPageView} />
), document.getElementById(`app`));
