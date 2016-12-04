import React from 'react';
import classNames from 'classnames';

import Navbar from '../navbar/navbar.jsx';
import Footer from '../footer/footer.jsx';
import ProjectList from '../project-list/project-list.jsx';

export default React.createClass({
  propTypes: {
    showSearchBar: React.PropTypes.bool,
    showNav: React.PropTypes.bool
  },
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
    this.setState({
      searchActivated: true
    });
  },
  deactivateSearch() {
    this.setState({
      searchActivated: false
    });
    this.searchInput.value = ``;
    this.searchInput.blur();
  },
  updateSearchQuery(event) {
    let query = this.searchInput.value;
    
    this.setState({
      searchQuery: query
    });

    if (event.keyCode === 27) { // escape
      this.deactivateSearch();
    } else {
      // if ( event.keyCode === 13 ) { // enter
      //    Search.updateUrlQuery(query);
      // }
      // Search.showSearchResult(query);
    }
  },
  render() {
    let searchBar = (
      <div id="search" className={classNames({activated: this.state.searchActivated})}>
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

    let content;

    if (this.state.searchActivated) {
      content = (
        <div>
          {searchBar}
          <div className="container">
            <ProjectList filter={{key: `search`, value: this.state.searchQuery}}/>
          </div>
        </div>
      );
    } else {
      content = (
        <div>
          { this.props.showSearch ? searchBar : null }
          { this.props.showNav ? <Navbar/> : null }
          <div className="container">
            {this.props.children}
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        {content}
        <Footer/>
      </div>
    );
  }
});
