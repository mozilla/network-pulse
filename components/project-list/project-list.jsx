import React from 'react';
import request from 'superagent';
import ProjectCard from '../project-card/project-card.jsx';

import googleSheetParser from '../../js/google-sheet-parser';

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
        return Date.parse(a.Timestamp) < Date.parse(b.Timestamp);
      }).filter((project)=>{
        if (this.props.featuredProjectsOnly) {
          return project.featured;
        } else if (this.props.singleProjectId) {
          return project.id === this.props.singleProjectId;
        }
        return true;
      }).map((project) => {
        console.log(project);
        return ( <ProjectCard key={project.id} id={project.id}
                                               creators={project.Creators}
                                               description={project.Description}
                                               issues={project.Issues}
                                               featured={project.Featured}
                                               getInvolved={project[`Get involved`]}
                                               thumbnailUrl={project[`Thumbnail URL`]}
                                               timestamp={project.Timestamp}
                                               title={project.Title}
                                               url={project.url}
                                                /> );
      });
    }

    return (
      <div className="project-list">
        {projects}
      </div>
    );
  }
});
