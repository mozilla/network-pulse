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
  handleViewMoreClick() {
    this.props.fetchData();
  },
  renderProjectCards() {
    return this.props.entries.map(project => {
      return <ProjectCard key={project.id} {...Utility.processEntryData(project)} />;
    });
  },
  renderLoadingNotice() {
    // 3 empty <div></div> here are for the loading animation dots (done in CSS) to show.
    return this.props.loadingData ?
      (<div className="loading my-5 d-flex justify-content-center align-items-center">
        <div></div>
        <div></div>
        <div></div>
      </div>) : null;
  },
  renderViewMoreBtn() {
    return this.props.moreEntriesToFetch ?
      (<div className="view-more text-center">
        <button type="button" className="btn btn-outline-info" onClick={this.handleViewMoreClick}>View more</button>
       </div>) : null;
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
