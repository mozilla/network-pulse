import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';
import slug from 'slug';
import moment from 'moment';
import ProjectCard from '../project-card/project-card.jsx';

import googleSheetParser from '../../js/google-sheet-parser';

// see https://www.npmjs.com/package/slug#options for config options
slug.defaults.mode =`rfc3986`;

export default React.createClass({
  getInitialState() {
    return {
      loadedFromGoogle: false,
      projects: null
    };
  },
  getDefaultProps() {
    return {
      onSearch: false
    };
  },
  componentDidMount() {
    console.log(`(componentDidMount) Send request to Google Sheet`);

    let GOOGLE_SHEET_ID = `1vmYQjQ9f6CR8Hs5JH3GGJ6F9fqWfLSW0S4dz-t2KTF4`;
    let url = `https://spreadsheets.google.com/feeds/cells/${GOOGLE_SHEET_ID}/1/public/values?alt=json`;

    request
      .get(url)
      .set(`Accept`, `application/json`)
      .end((err, res)=>{
        // console.log(googleSheetParser.parse(res.body));
        this.setState({
          loadedFromGoogle: true,
          projects: googleSheetParser.parse(res.body)
        });
      });
  },
  applyFilterToList(filter) {
    if (!filter || !filter.hasOwnProperty(`key`)) {
      return this.state.projects;
    }

    let key = filter.key;
    let value = filter.value;

    console.log(key,value);

    let filteredProjects = this.state.projects.filter((project)=>{
      if ( key === `featured` ) {
        return project.featured;
      } else if ( key === `entry` ) {
        return project.id === value;
      } else if ( key === `favs` ) {
        try {
          return value.indexOf(project.id) > -1;
        } catch (err) {
          return false;
        }
      } else if ( key === `issue` ) {
        return project.issues.some((issue)=>{
          return slug(issue) === value;
        });
      } else if ( key === `search` ) {
        if (value) {
          return JSON.stringify(project).toLowerCase().indexOf(value.toLowerCase().trim()) > -1;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    if ( key === `favs` && value ) {
      // we want to show the list from the most recently faved entry first
      return filteredProjects.sort((a,b) => {
        return value.indexOf(a.id) > value.indexOf(b.id);
      });
    }

    return filteredProjects;
  },
  render() {
    let projects = this.state.loadedFromGoogle ? this.applyFilterToList(this.props.filter) : null;
    let numProjects;

    if (projects) {
      if (this.props.onSearch) {
        numProjects = projects.length;
        projects = projects.map((project) => {
          return (<li key={project.id}>
                    <h2><Link to={`/entry/${project.id}`}>{project.title}</Link></h2>
                    <p>{project.creators} on {moment(project.timestamp).format(`MMM DD, YYYY`)}</p>
                  </li>);
        });
        projects = (<div>
                      { numProjects > 0 ? <p>{numProjects} {numProjects > 1 ? `results` : `result`} found for ‘{this.props.filter.value}’</p>
                                        : null }
                      <ul>{projects}</ul>
                    </div>);
      } else {
        projects = projects.map((project) => {
          return ( <ProjectCard key={project.id} {...project} onDetailView={this.props.onDetailView} /> );
        });
      }
    }

    return (
      <div className="project-list">
        {projects}
      </div>
    );
  }
});
