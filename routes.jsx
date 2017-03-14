import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import localstorage from './js/localstorage.js';

import ProjectLoader from './components/project-loader/project-loader.jsx';
import Bookmarks from './pages/bookmarks.jsx';
import Issues from './pages/issues.jsx';
import Issue from './pages/issue.jsx';
import Entry from './pages/entry.jsx';
import Add from './pages/add/add.jsx';
import Search from './pages/search/search.jsx';
import NotFound from './pages/not-found.jsx';

import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/footer.jsx';

const Featured = () => {
  return <ProjectLoader featured={`True`} />;
};

const Latest = () => {
  return <ProjectLoader />;
};

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
    if (this.refs.splash) {
      setTimeout(this.dismissSplash, this.props.dismissTimeout);
    }
  },
  dismissSplash() {
    this.refs.splash.classList.add(`dismissed`);
    document.querySelector(`#app`).classList.add(`splash-dismissed`);
    this.refs.splash.addEventListener(`transitionend`, () => {
      // wait for CSS animation to finish first before we
      // set `suppressSplashScreen` in localStorage and 
      // this.state.suppressSplashScreen to true
      localstorage.setItem(`suppressSplashScreen`, `true`);
      this.setState({ suppressSplashScreen: true });
    });
  },
  renderWelcomeSplash() {
    if (this.state.suppressSplashScreen) {
      return null;
    }
    return (
      <div id="splash" ref="splash">
        <div className="container">
          <div><img src="/assets/svg/pulse-wordmark.svg" width="204" height="34" alt="Mozilla Pulse" /></div>
          <p className="mt-2">A stream of assets from peers across the Mozilla Network.</p>
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
