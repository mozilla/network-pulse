import React from 'react';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <div className="container">
          <ProjectList />
        </div>
      </div>
    );
  }
});
