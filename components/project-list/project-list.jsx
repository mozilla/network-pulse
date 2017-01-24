// this file has some complicated logics going
// this is just interim and will be fixed once all the backend API is ready to use

import React from 'react';
import ProjectCard from '../project-card/project-card.jsx';
import Service from '../../js/service.js';

export default React.createClass({
  numProjectsInBatch: 24, // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes
  getInitialState() {
    return {
      dataLoaded: false,
      entries: null,
      displayBatchIndex: 1
    };
  },
  componentDidMount() {
    this.fetchData(this.props.params);
  },
  componentWillReceiveProps(nextProps) {
    // When navigating between the /issue/issue-name pages component does not get re-mounted,
    // as been treated as passing new props to the same components (<Issue><ProjectList></Issue>)
    // By calling this.fetchData() in the componentWillReceiveProps method here it ensures data gets fetched and displayed accordingly
    if (nextProps.params.issue) {
      this.fetchData(nextProps.params);
    }
  },
  fetchData(params = {}) {
    Service.entries
      .get(params)
      .then((data) => {
        this.setState({
          dataLoaded: true,
          entries: data.results
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  applyFilterToList(entries,params = {}) {
    if ( params.ids ) { // we want to show the list from the most recently faved entry first
      let favedIdArray = params.ids.split(`,`);

      return entries.sort((a,b) => {
        return favedIdArray.indexOf(a.id.toString()) > favedIdArray.indexOf(b.id.toString());
      });
    } else if ( Object.keys(params).indexOf(`search`) > -1 ) { // if this is for the search page, filter entries as user types on client side
      if (params.search) {
        return entries.filter(project =>
          // return entries that include the search keyword user has entered
          JSON.stringify(project).toLowerCase().indexOf(params.search.toLowerCase().trim()) > -1
        );
      } else { // by default shows empty list
        return [];
      }
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
        return ( <ProjectCard key={project.id} {...project} /> );
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
