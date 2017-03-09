import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import ReactGA from 'react-ga';
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

export default React.createClass({
  getInitialState() {
    return {
      keywordSearched: ``
    };
  },
  componentWillReceiveProps(nextProps) {
    // when window.history.back() or windows.history.forward() is triggered
    // (e.g., clicking on browser's back / forward button)
    // we want to make sure search result gets updated accordingly
    let searchKeyword = nextProps.location.query.keyword;
    this.searchByQueryInUrl(searchKeyword);
  },
  componentDidMount() {
    let queryKeyword = this.props.location.query.keyword;
    this.searchByQueryInUrl(queryKeyword);
  },
  searchByQueryInUrl(searchQueryInUrl) {
    let inputBoxValue = this.refs.searchInput.state.value;

    if (searchQueryInUrl !== inputBoxValue) {
      // make sure input box value is updated with searchQueryInUrl
      // then use searchQueryInUrl as the search param to fetch data from Pulse API
      this.refs.searchInput.setState({value: searchQueryInUrl ? decodeURIComponent(searchQueryInUrl) : ``});
      this.setState({ keywordSearched: searchQueryInUrl });
    }
  },
  updateBrowserHistory() {
    let query = this.refs.searchInput.state.value;
    let location = {
      pathname: this.props.router.location.pathname
    };

    if ( query ) {
      location[`query`] = { keyword: query };
    }

    // note browserHistory.push() triggers component re-render
    browserHistory.push(location);
  },
  clearSearch() {
    this.refs.searchInput.setState({value: ``}, () => {
      this.updateBrowserHistory();
    });
  },
  handleInputChange() {
    let keywordsEntered = this.refs.searchInput.state.value;

    ReactGA.event({
      category: `Search input box`,
      action: `Keywords entered`,
      label: `${keywordsEntered}`
    });

    this.updateBrowserHistory();

    this.setState({ keywordSearched: keywordsEntered });
  },
  handleDismissBtnClick() {
    this.clearSearch();
  },
  render() {
    return (
      <div className="search-page">
        <div className={classNames({activated: true, 'search-bar': true})}>
          <DebounceInput id="search-box"
                          debounceTimeout={250}
                          type="search"
                          ref="searchInput"
                          onChange={this.handleInputChange}
                          placeholder="Search keywords, people, tags..." />
          <button className="btn dismiss" onClick={this.handleDismissBtnClick}>&times;</button>
        </div>
        { this.state.keywordSearched ? <ProjectLoader params={ {search: this.state.keywordSearched} } /> : null }
      </div>
    );
  }
});
