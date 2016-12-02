import React from 'react';
import request from 'superagent';
import slug from 'slug';
import ProjectCard from '../project-card/project-card.jsx';

import googleSheetParser from '../../js/google-sheet-parser';

// see https://www.npmjs.com/package/slug#options for config options
slug.defaults.mode =`rfc3986`;

export default React.createClass({
  getInitialState() {
    this.projects = null;

    return {
      loadedFromGoogle: false,
    };
  },
  componentDidMount() {
    let GOOGLE_SHEET_ID = `1vmYQjQ9f6CR8Hs5JH3GGJ6F9fqWfLSW0S4dz-t2KTF4`;
    let url = `https://spreadsheets.google.com/feeds/cells/${GOOGLE_SHEET_ID}/1/public/values?alt=json`;

    request
      .get(url)
      .set(`Accept`, `application/json`)
      .end((err, res)=>{
        console.log(googleSheetParser.parse(res.body));
        this.setState({
          loadedFromGoogle: true,
          projects: googleSheetParser.parse(res.body)
        });
      });
  },
  render() {
    let projects;

    if (this.state.loadedFromGoogle) {
      projects = this.state.projects.sort((a,b) => {
        return a.timestamp < b.timestamp;
      }).filter((project)=>{
        if (this.props.featuredProjectsOnly) {
          return project.featured;
        } else if (this.props.entryId) {
          return project.id === this.props.entryId;
        } else if (this.props.issue) {
          return project.issues.some((issue)=>{
            return slug(issue) === this.props.issue;
          });
        }
        return true;
      }).map((project) => {
        // console.log(project);
        return ( <ProjectCard key={project.id} {...project} /> );
      });
    }

    return (
      <div className="project-list">
        {projects}
      </div>
    );
  }
});
