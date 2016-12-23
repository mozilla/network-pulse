import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import ProjectList from '../../components/project-list/project-list.jsx';

export default React.createClass({
  getInitialState() {
    return {
      searchQuery: ``
    };
  },
  componentWillReceiveProps(nextProps) {
    // this makes sure searchQuery is updated accordingly when
    // browser's back / forward button is triggered
    this.setSearchQuery(nextProps.location.query.keyword);
  },
  componentDidMount() {
    this.setSearchQuery(this.props.location.query.keyword);
  },
  setSearchQuery(searchQuery) {
    this.searchInput.focus();
    this.searchInput.value = searchQuery ? decodeURIComponent(searchQuery) : ``;
    this.setState({searchQuery: searchQuery});
  },
  clearSearch() {
    this.searchInput.value = ``;
    this.searchInput.blur();
  },
  handleInputBlur() {
    this.updateSearchQuery();
  },
  handleInputKeyUp(event) {
    if (event.keyCode === 27) { // escape key
      this.clearSearch();
    }
    this.updateSearchQuery();
  },
  handleDismissBtnClick() {
    this.clearSearch();
    this.updateSearchQuery();
  },
  updateSearchQuery() {
    let query = this.searchInput.value;
    let location = {
      pathname: this.props.router.location.pathname
    };

    if ( query ) {
      location[`query`] = { keyword: query };
    }

    browserHistory.push(location);

    this.setState({
      searchQuery: query
    });
  },
  render() {
    return (
      <div className="search-page">
        <div className={classNames({activated: true, 'search-bar': true})}>
          <input id="search-box"
                  placeholder="Search keywords, people, tags..."
                  onKeyUp={this.handleInputKeyUp}
                  onBlur={this.handleInputBlur}
                  ref={(searchInput) => { this.searchInput = searchInput; }} />
          <a className="btn dismiss" onClick={this.handleDismissBtnClick}>&times;</a>
        </div>
        <ProjectList filter={{key: `search`, value: this.state.searchQuery}} onSearch={true} />
      </div>
    );
  }
});
