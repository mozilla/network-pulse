import React from 'react';
import ProjectCard from '../project-card/project-card.jsx';
import Service from '../../js/service.js';
import Utility from '../../js/utility.js';

export default React.createClass({
  numProjectsInBatch: 24, // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes
  getInitialState() {
    return {
      dataLoaded: false,
      entries: [],
      displayBatchIndex: 1
    };
  },
  getDefaultProps() {
    return {
      params: {
        featured: null,
        issue: null,
        ids: null
      }
    };
  },
  componentDidMount() {
    this.fetchData(this.props.params);
  },
  componentWillReceiveProps(nextProps) {
    // Reset state
    this.resetState();

    // <ProjectList> doesn't always get unmounted and remounted when navigating between pages.
    // (e.g., When navigating between the /issue/issue-name pages <Issue><ProjectList></Issue>
    //        do not get re-mounted since the same components are being rendered.)
    // It is treated as passing new props to <ProjectList {...newProps} />
    let newIssueEntered = (nextProps.params.issue !== this.props.params.issue);

    if ( newIssueEntered ) {
      // Fetch data based on the new params props to ensure data gets fetched and displayed accordingly.
      this.fetchData(nextProps.params);
    }
  },
  resetState() {
    this.setState(this.getInitialState());
  },
  fetchData(params = {}, entries = [], apiPageIndex = 1) {
    params.page = apiPageIndex;

    Service.entries
      .get(params)
      .then((data) => {
        entries = entries.concat(data.results);

        if (data.next) { // there are more data in the database we need to fetch
          apiPageIndex += 1;
          this.fetchData(params);
        } else {
          this.setState({
            dataLoaded: true,
            entries: entries
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
    let projects = (<div className="loading my-5 d-flex justify-content-center align-items-center">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>);
    let moreToShow;
    let showViewMoreBtn;

    if (this.state.dataLoaded) {
      // get all matching projects
      projects = this.applyFilterToList(this.state.entries,this.props.params);
      // we only want to show a fixed number of projects at once (this.numProjectsInBatch)
      // first, check to see if there are more projects to show after this batch
      moreToShow = (projects.length/this.numProjectsInBatch) > this.state.displayBatchIndex;
      showViewMoreBtn = moreToShow ? (<div className="view-more text-center">
                                        <button type="button" className="btn btn-outline-info" onClick={this.handleViewMoreClick}>View more</button>
                                      </div>)
                                   : null;
      // prepare ProjectCards we are going to render in this batch
      projects = projects.slice(0,this.state.displayBatchIndex*this.numProjectsInBatch).map((project) => {
        return ( <ProjectCard key={project.id} {...Utility.processEntryData(project)} /> );
      });
      projects = <div className="projects">{projects}</div>;
    }

    return (<div className="project-list">
              { projects }
              { showViewMoreBtn }
            </div>);
  }
});
