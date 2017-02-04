import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
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
  setSearchQuery(newSearchQuery) {
    let prevSearchQuery = this.refs.searchInput.state.value;

    if (newSearchQuery !== prevSearchQuery) {
      // update value in input box
      this.refs.searchInput.setState({value: newSearchQuery ? decodeURIComponent(newSearchQuery) : ``});
      // update searchQuery state
      this.setState({searchQuery: newSearchQuery});
    }
  },
  clearSearch() {
    this.refs.searchInput.setState({value: ``}, () => {
      this.updateSearchQuery();
    });
  },
  handleInputChange() {
    this.updateSearchQuery();
  },
  handleDismissBtnClick() {
    this.clearSearch();
  },
  updateSearchQuery() {
    let query = this.refs.searchInput.state.value;
    let location = {
      pathname: this.props.router.location.pathname
    };

    if ( query ) {
      location[`query`] = { keyword: query };
    }

    // note browserHistory.push() triggers component re-render
    browserHistory.push(location);

    this.setState({
      searchQuery: query
    });
  },
  render() {
    return (
      <div className="search-page">
        <div className={classNames({activated: true, 'search-bar': true})}>
          <DebounceInput id="search-box"
                          debounceTimeout={500}
                          type="search"
                          ref="searchInput"
                          onChange={this.handleInputChange}
                          placeholder="Search keywords, people, tags..." />
          <button className="btn dismiss" onClick={this.handleDismissBtnClick}>&times;</button>
        </div>
        <ProjectList params={{search: this.state.searchQuery}} />
      </div>
    );
  }
});
