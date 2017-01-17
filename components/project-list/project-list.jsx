// this file has some complicated logics going
// this is just interim and will be fixed once all the backend API is ready to use

import React from 'react';
import moment from 'moment';
import ProjectCard from '../project-card/project-card.jsx';
import Service from '../../js/service.js';

export default React.createClass({
  numProjectsInBatch: 24, // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes
  getInitialState() {
    return {
      loadedFromGoogle: false,
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
      .then((entries) => {
        // sort data from mostly -> least recently added
        entries = entries.sort((a,b) => {
          return b.id - a.id;
        });
        this.setState({
          loadedFromGoogle: true,
          entries: entries
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  applyFilterToList(entries,params = {}) {
    // TODO:FIXME:
    // currently there are no API endpoints for the following params
    // so there comes the temporary solution to filter entries on client side

    let filteredProjects = entries.filter((project) => {
      if ( Object.keys(params).length === 0 || params.issue ) {
        // if no params have been passed, we want to return all entries returned from the API call
        // OR if entries of a particular issue have been requested, we return all entries as well as the corresponding API call was used and there's no need to go through another fitlering
        return true;
      } else if ( params.featured ) {
        // if we want to only return featured entries
        return project.featured;
      } else if ( params.favs ) {
        // if we want to return projects that have been favrourited by user
        try {
          return params.favs.indexOf(project.id) > -1;
        } catch (err) {
          return false;
        }
      } else if ( params.search ) {
        // if this is for the search page, return entries that include the search keyword user has entered
        return JSON.stringify(project).toLowerCase().indexOf(params.search.toLowerCase().trim()) > -1;
      } else {
        // this is for the search page default view case
        // the default view for search page is blank (no entries shown)
        return false;
      }
    });

    if ( params.favs ) {
      // we want to show the list from the most recently faved entry first
      return filteredProjects.sort((a,b) => {
        return params.favs.indexOf(a.id) > params.favs.indexOf(b.id);
      });
    }

    return filteredProjects;
  },
  handleViewMoreClick() {
    this.setState({displayBatchIndex: this.state.displayBatchIndex+1});
  },
  render() {
    let projects = this.state.loadedFromGoogle ? this.applyFilterToList(this.state.entries,this.props.params) : null;
    let showViewMoreBtn;
    let searchResult;

    if (projects) {
      // we only want to show a fixed number of projects at once (this.numProjectsInBatch)
      // first, check to see if there are more projects to show after this batch
      showViewMoreBtn = (projects.length/this.numProjectsInBatch) > this.state.displayBatchIndex;
      // prepare ProjectCards we are going to render in this batch
      projects = projects.slice(0,this.state.displayBatchIndex*this.numProjectsInBatch).map((project) => {
        return ( <ProjectCard key={project.id} {...project} /> );
      });
    }

    if (this.props.params && this.props.params.search && projects) {
      // show search result if on search page and search keyword is presented
      searchResult = (<p>{projects.length} {projects.length > 1 ? `results` : `result`} found for ‘{this.props.params.search}’</p>);
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
