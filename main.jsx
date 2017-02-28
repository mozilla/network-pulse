import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import routes from './routes.jsx';

import Analytics from './js/analytics.js';

Analytics.initialize();

ReactDOM.render((
  <Router routes={routes} history={browserHistory} onUpdate={Analytics.logPageView} />
), document.getElementById(`app`));
