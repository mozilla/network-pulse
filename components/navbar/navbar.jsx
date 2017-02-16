import React from 'react';
import { IndexLink } from 'react-router';
import NavLink from '../nav-link/nav-link.jsx';

export default React.createClass({
  render() {
    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // That's why a link like <NavLink to="/favs" className="text-nav-link bookmarks">Favs</NavLink> is seen here.
    // For more info see: https://github.com/mozilla/network-pulse/issues/326

    return (
      <div className="navbar">
        <div className="container">
          <div className="inner">
            <div className="logo">
              <IndexLink to="/"><img src="/assets/svg/pulse-wordmark.svg" width="160" alt="Mozilla Network Pulse" /></IndexLink>
            </div>
            <ul>
              <li><NavLink to="/featured" className="text-nav-link">Featured</NavLink></li>
              <li><NavLink to="/latest" className="text-nav-link">Latest</NavLink></li>
              <li><NavLink to="/issues" className="text-nav-link">Issues</NavLink></li>
              <li><NavLink to="/favs" className="text-nav-link bookmarks">Favs</NavLink></li>
              <li><NavLink to="/search" className="btn-search"><i className="fa fa-search"/><span className="sr-only">Search</span></NavLink></li>
              <li><NavLink to="/add" className="btn-add"><img src="/assets/svg/icon-plus.svg" /></NavLink></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
