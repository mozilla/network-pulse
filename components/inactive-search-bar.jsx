import React from 'react';
import { browserHistory } from 'react-router';

export default React.createClass({
  getInitialState() {
    return {
      searchActivated: false
    };
  },
  getDefaultProps() {
    return {
      showSearch: false,
      showNav: false
    };
  },
  activateSearch() {
    browserHistory.push(`/search/`);
  },
  render() {
    return (
      <div className="search-bar">
        <div className="container">
          <input id="search-box"
                  placeholder="Search keywords, people, tags..."
                  onFocus={this.activateSearch} />
        </div>
      </div>
    );
  }
});
