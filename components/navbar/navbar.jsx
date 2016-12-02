import React from 'react';
import SelectorLink from '../selector-link/selector-link.jsx';

export default React.createClass({
  render() {
    return (
      <div className="navbar">
        <div className="container">
          <ul>
            <li><SelectorLink to="/featured">Featured</SelectorLink></li>
            <li><SelectorLink to="/latest">Latest</SelectorLink></li>
            <li><SelectorLink to="/favs">Favs</SelectorLink></li>
            <li><SelectorLink to="/issues">Issues</SelectorLink></li>
          </ul>
        </div>
      </div>
    );
  }
});
