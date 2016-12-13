import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';

import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  getInitialState() {
    return {
      searchActivated: true
    };
  },
  componentDidMount() {
    let searchQuery = this.props.location.query.keyword;

    if (!searchQuery) {
      this.searchInput.focus();
    } else {
      this.searchInput.value = decodeURIComponent(searchQuery);
      this.setState({searchQuery: searchQuery});
    }
  },
  activateSearch() {
    this.setState({
      searchActivated: true,
      returnTo: `/hi`
    });
  },
  deactivateSearch() {
    this.setState({
      searchActivated: false
    });
    this.searchInput.value = ``;
    this.searchInput.blur();
    // TODO:FIXME: this should go back to the route that the user was before coming to /search
    // not like clicking on browser's back button
    browserHistory.goBack();
  },
  updateSearchQuery(event) {
    let query = this.searchInput.value;

    this.setState({
      searchQuery: query
    });

    if (event.keyCode === 27) { // escape
      this.deactivateSearch();
    } else if ( event.keyCode === 13 ) { // enter
      this.props.router.push({
        pathname: this.props.router.location.pathname,
        query: { keyword: query },
        // state: { fromDashboard: true }
      });
    }
  },
  render() {
    let searchBar = (
      <div className={classNames({activated: true, 'search-bar': true})}>
        <div className="container">
          <input id="search-box"
                  placeholder="Search keywords, people, tags..."
                  onFocus={this.activateSearch}
                  onKeyUp={this.updateSearchQuery}
                  ref={(searchInput) => { this.searchInput = searchInput; }} />
          <a className="btn dismiss" onClick={this.deactivateSearch}>&times;</a>
        </div>
      </div>
    );

    return (
      <div>
        {searchBar}
        <div className="container">
          <ProjectList filter={{key: `search`, value: this.state.searchQuery}}/>
        </div>
      </div>
    );
  }
});
