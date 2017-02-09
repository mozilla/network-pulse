import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import ProjectCard from '../../components/project-card/project-card.jsx';
import Service from '../../js/service.js';
import Utility from '../../js/utility.js';

export default React.createClass({
  numProjectsInBatch: 24, // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes
  getInitialState() {
    return {
      displayBatchIndex: 1,
      keywordSearched: ``,
      entriesMatched: []
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
      this.fetchData({search: searchQueryInUrl});
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
  fetchData(params = {}) {
    if (!params.search) {
      // if no search keyword was passed reset search page back to its initial state
      this.setState(this.getInitialState());
      return;
    }

    let newResult = [];
    let apiPageIndex = 1;

    params.page = apiPageIndex;

    Service.entries
      .get(params)
      .then((data) => {
        newResult = newResult.concat(data.results);

        if (data.next) { // there is more data in the database we need to fetch
          apiPageIndex += 1;
          this.fetchData(params);
        } else {
          this.setState({
            keywordSearched: params.search,
            entriesMatched: newResult
          });
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  handleInputChange() {
    this.updateBrowserHistory();
    this.fetchData({search: this.refs.searchInput.state.value});
  },
  handleDismissBtnClick() {
    this.clearSearch();
  },
  render() {
    let projects;
    let showViewMoreBtn;
    let searchResult;

    if (this.state.keywordSearched) {
      let numEntriesMatched = this.state.entriesMatched.length;

      // show search result
      searchResult = (<p>{numEntriesMatched} {numEntriesMatched > 1 ? `results` : `result`} found for ‘{this.state.keywordSearched}’</p>);
      // we only want to show a fixed number of projects at once (this.numProjectsInBatch)
      // first, check to see if there are more projects to show after this batch
      showViewMoreBtn = (numEntriesMatched/this.numProjectsInBatch) > this.state.displayBatchIndex;
      // prepare ProjectCards we are going to render in this batch
      projects = this.state.entriesMatched.slice(0,this.state.displayBatchIndex*this.numProjectsInBatch).map((project) => {
        return ( <ProjectCard key={project.id} {...Utility.processEntryData(project)} /> );
      });
    }

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
        <div className="project-list">
          { searchResult }
          { projects ? <div className="projects">{projects}</div> : null }
          { showViewMoreBtn ? <div className="view-more"><button type="button" className="btn" onClick={this.handleViewMoreClick}>View more</button></div> : null }
        </div>
      </div>
    );
  }
});
