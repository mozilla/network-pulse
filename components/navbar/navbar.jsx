import React from 'react';
import { IndexLink, browserHistory } from 'react-router';
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
              <IndexLink to="/"><img src="/assets/svg/pulse-wordmark.svg" width="160" alt="Mozilla Network Pulse" /></IndexLink>
            </div>
            <ul className="page-navs">
              <li><SelectorLink to="/featured" className="text-nav-link">Featured</SelectorLink></li>
              <li><SelectorLink to="/latest" className="text-nav-link">Latest</SelectorLink></li>
              <li><SelectorLink to="/issues" className="text-nav-link">Issues</SelectorLink></li>
              <li><SelectorLink to="/favs" className="text-nav-link favs">Favs</SelectorLink></li>
              <li><SelectorLink to="/search" className="text-nav-link btn-search"><i className="fa fa-search"/><span className="sr-only">Search</span></SelectorLink></li>
            </ul>
            <div className="log-in-out-panel">
              <SelectorLink to="/log-in" className="log-in-out-link text-nav-link">Sign In</SelectorLink>
              <SelectorLink to="/add" className="btn-add" onClick={this.handleAddPageLinkClick} ref={(link) => { this.btnAdd = link; }}></SelectorLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
