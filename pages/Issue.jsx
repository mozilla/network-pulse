import React from 'react';

import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Issue: {this.props.params.issue}</h1>
        <IssueSelector />
        <ProjectList issue={this.props.params.issue} />
      </div>
    );
  }
});
