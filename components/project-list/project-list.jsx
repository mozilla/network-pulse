// this file has some complicated logics going
// this is just interim and will be fixed once all the backend API is ready to use

import React from 'react';
import ProjectCard from '../project-card/project-card.jsx';
import Service from '../../js/service.js';
import Utility from '../../js/utility.js';

export default React.createClass({
  numProjectsInBatch: 24, // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes
  getInitialState() {
    return {
      dataLoaded: false,
      apiPageIndex: 1,
      entries: [],
      displayBatchIndex: 1
    };
  },
  getDefaultProps() {
    return {
      params: {
        featured: null,
        issue: null,
        search: null,
        ids: null
      }
    };
  },
  componentDidMount() {
    this.fetchData(this.props.params);
  },
  componentWillReceiveProps(nextProps) {
    // Reset this.state.entries
    this.resetEntries();

    // <ProjectList> doesn't always get unmounted and remounted when navigating between pages.
    // (e.g., When navigating between the /issue/issue-name pages <Issue><ProjectList></Issue>
    //        do not get re-mounted since the same components are being rendered.)
    // It is treated as passing new props to <ProjectList {...newProps} />
    let newIssueEntered = (nextProps.params.issue !== this.props.params.issue);

    // Similarly, on the /search page, <ProjectList> doesn't get re-mounted as user changes the
    // search keyword.
    // It is treated as passing new props to (<ProjectList {...newProps} />
    let newSearchQueryEntered = (nextProps.params.search !== this.props.params.search);

    if ( newIssueEntered || newSearchQueryEntered ) {
      // Fetch data based on the new params props to ensure data gets fetched and displayed accordingly.
      this.fetchData(nextProps.params);
    }
  },
  resetEntries() {
    this.setState({
      entries: []
    });
  },
  fetchData(params = {}) {
    if (params.hasOwnProperty(`search`) && !params.search) {
      // we don't want to show any entries if no search query was passed
      return;
    }

    params.page = this.state.apiPageIndex;
    Service.entries
      .get(params)
      .then((data) => {
        this.setState({
          entries: this.state.entries.concat(data.results)
        });

        if (data.next) { // there are more data in the database we need to fetch
          this.setState({apiPageIndex: this.state.apiPageIndex+1});
          this.fetchData(params);
        } else {
          this.setState({
            dataLoaded: true
          });
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  applyFilterToList(entries,params = {}) {
    if ( params.ids ) { // we want to show the list from the most recently bookmarked entry first
      let bookmarkedIdArray = params.ids.split(`,`);

      return entries.sort((a,b) => {
        return bookmarkedIdArray.indexOf(a.id.toString()) > bookmarkedIdArray.indexOf(b.id.toString());
      });
    } else {
      return entries;
    }

  },
  handleViewMoreClick() {
    this.setState({displayBatchIndex: this.state.displayBatchIndex+1});
  },
  render() {
    let projects = this.state.dataLoaded ? this.applyFilterToList(this.state.entries,this.props.params) : null;
    let showViewMoreBtn;
    let searchResult;

    if (this.props.params && this.props.params.search && projects) {
      // show search result if on search page and search keyword is presented
      searchResult = (<p>{projects.length} {projects.length > 1 ? `results` : `result`} found for ‘{this.props.params.search}’</p>);
    }

    if (projects) {
      // we only want to show a fixed number of projects at once (this.numProjectsInBatch)
      // first, check to see if there are more projects to show after this batch
      showViewMoreBtn = (projects.length/this.numProjectsInBatch) > this.state.displayBatchIndex;
      // prepare ProjectCards we are going to render in this batch
      projects = projects.slice(0,this.state.displayBatchIndex*this.numProjectsInBatch).map((project) => {
        return ( <ProjectCard key={project.id} {...Utility.processEntryData(project)} /> );
      });
    }

    return (
      <div className="project-list">
        { searchResult }
        { projects ? <div className="projects">{projects}</div> : null }
        { showViewMoreBtn ? <div className="view-more"><button type="button" className="btn" onClick={this.handleViewMoreClick}>View more</button></div> : null }
      </div>
    );
  }
});
