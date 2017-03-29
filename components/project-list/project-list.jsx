import React from 'react';
import ProjectCard from '../project-card/project-card.jsx';
import Utility from '../../js/utility.js';

export default React.createClass({
  getDefaultProps() {
    return {
      entries: []
    };
  },
  propTypes: {
    entries: React.PropTypes.array.isRequired,
    loadingData: React.PropTypes.bool.isRequired,
    moreEntriesToFetch: React.PropTypes.bool.isRequired,
    fetchData: React.PropTypes.func.isRequired
  },
  renderProjectCards() {
    return this.props.entries.map(project => {
      return <ProjectCard key={project.id} {...Utility.processEntryData(project)} />;
    });
  },
  renderLoadingNotice() {
    if (!this.props.loadingData ) return null;

    // 3 empty <div></div> here are for the loading animation dots (done in CSS) to show.
    return <div className="loading my-5 d-flex justify-content-center align-items-center">
              <div></div>
              <div></div>
              <div></div>
            </div>;
  },
  renderViewMoreBtn() {
    if (!this.props.moreEntriesToFetch) return null;

    return <div className="view-more text-center">
            <button type="button" className="btn btn-outline-info" onClick={this.props.fetchData}>View more</button>
           </div>;
  },
  render() {
    return (<div className="project-list">
              <div className="projects">
                { this.renderProjectCards() }
              </div>
              { this.renderLoadingNotice() }
              { this.renderViewMoreBtn() }
            </div>);
  }
});
