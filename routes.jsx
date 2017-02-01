import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import localstorage from './js/localstorage.js';

import Featured from './pages/featured.jsx';
import Latest from './pages/latest.jsx';
import Bookmarks from './pages/bookmarks.jsx';
import Issues from './pages/issues.jsx';
import Issue from './pages/issue.jsx';
import Entry from './pages/entry.jsx';
import Add from './pages/add/add.jsx';
import Search from './pages/search/search.jsx';
import NotFound from './pages/not-found.jsx';

import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/footer.jsx';

const App = React.createClass({
  getInitialState() {
    return {
      suppressSplashScreen: (localstorage.getItem(`suppressSplashScreen`) === `true`)
    };
  },
  getDefaultProps() {
    return {
      dismissTimeout: 3000
    };
  },
  componentDidMount() {
    if (!this.state.suppressSplashScreen) {
      setTimeout(this.dismissSplash, this.props.dismissTimeout);
    }
  },
  dismissSplash() {
    this.splash.classList.add(`dismissed`);
    document.querySelector(`#app`).classList.add(`splash-dismissed`);
    localstorage.setItem(`suppressSplashScreen`, `true`);
  },
  renderWelcomeSplash() {
    if (this.state.suppressSplashScreen) {
      return null;
    }
    return (
      <div id="splash" ref={(splash) => { this.splash = splash; }}>
        <div className="container">
          <h1><img src="/assets/svg/pulse-wordmark.svg" width="200" height="46" alt="Mozilla Network Pulse" /></h1>
          <p>A stream of assets from peers across the Mozilla Network.</p>
        </div>
      </div>
    );
  },
  render() {
    return (
      <div>
        { this.renderWelcomeSplash() }
        <Navbar router={this.props.router}/>
        <div id="main" className="container">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
});

// We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
// This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
// For user facing bits like UI labels and URL path we want them to stay as "favorites".
// That's why a route like <Route path="favs" component={Bookmarks} /> is seen here.
// For more info see: https://github.com/mozilla/network-pulse/issues/326
module.exports = (
  <Route path="/" component={App}>
    <IndexRedirect to="/featured" />
    <Route path="featured" component={Featured} />
    <Route path="latest" component={Latest} />
    <Route path="favs" component={Bookmarks} />
    <Route path="issues">
      <IndexRoute component={Issues} />
      <Route path=":issue" component={Issue} />
    </Route>
    <Route path="entry/:entryId" component={Entry} />
    <Route path="add" component={Add} />
    <Route path="search" component={Search} />
    <Route path="*" component={NotFound}/>
  </Route>
);
