import React from 'react';
import { Link } from 'react-router';

import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Issues Page</h1>
        <IssueSelector />
        <ProjectList />
      </div>
    );
  }
});
