import React from 'react';
import { browserHistory } from 'react-router';
import SelectorLink from '../selector-link/selector-link.jsx';

export default React.createClass({
  handleAddPageLinkClick(event) {
    event.preventDefault();
    let onAddPage = this.props.router.isActive({ pathname: `/add`});

    if (onAddPage) {
      // TODO:FIXME: this should go back to previous route that user was before coming to /add
      browserHistory.push(`/`);
    } else {
      browserHistory.push(this.btnAdd.props.to);
    }
  },
  render() {
    return (
      <div className="navbar">
        <div className="container">
          <div className="inner">
            <div className="logo">
              <h2>Mozilla</h2>
              <h1>Network Pulse</h1>
            </div>
            <ul>
              <li><SelectorLink to="/featured">Featured</SelectorLink></li>
              <li><SelectorLink to="/latest">Latest</SelectorLink></li>
              <li><SelectorLink to="/favs">Favs</SelectorLink></li>
              <li><SelectorLink to="/issues">Issues</SelectorLink></li>
              <li><SelectorLink to="/search" className="btn-search"><i className="fa fa-search"/><span className="sr-only">Search</span></SelectorLink></li>
              <li><SelectorLink to="/add" className="btn-add" onClick={this.handleAddPageLinkClick} ref={(link) => { this.btnAdd = link; }}><img src="/assets/svg/icon-plus.svg" /></SelectorLink></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
