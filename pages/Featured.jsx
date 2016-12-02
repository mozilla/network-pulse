import React from 'react';

import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Featured Page</h1>
        <ProjectList featuredProjectsOnly={true} />
      </div>
    );
  }
});
