import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  render() {
    return (
      <div className="navbar">
        <div className="container">
          <ul>
            <li><Link to="/featured" activeClassName="active">Featured</Link></li>
            <li><Link to="/latest" activeClassName="active">Latest</Link></li>
            <li><Link to="/favs" activeClassName="active">Favs</Link></li>
            <li><Link to="/issues" activeClassName="active">Issues</Link></li>
          </ul>
        </div>
      </div>
    );
  }
});
