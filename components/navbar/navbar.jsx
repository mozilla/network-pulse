import React from 'react';
import SelectorLink from '../selector-link/selector-link.jsx';

export default React.createClass({
  getDefaultProps() {
    return {
      onDetailView: false
    };
  },
  render() {
    return (
      <div className="navbar">
        <div className="container">
          { this.props.onDetailView ?
            <ul><li><SelectorLink to="/" className="back-link">Back</SelectorLink></li></ul> :
            (
            <ul>
              <li><SelectorLink to="/featured">Featured</SelectorLink></li>
              <li><SelectorLink to="/latest">Latest</SelectorLink></li>
              <li><SelectorLink to="/favs">Favs</SelectorLink></li>
              <li><SelectorLink to="/issues">Issues</SelectorLink></li>
              <li><SelectorLink to="/add" className="btn-add"><img src="../assets/svg/icon-plus.svg" /></SelectorLink></li>
            </ul>
            )
          }
        </div>
      </div>
    );
  }
});
