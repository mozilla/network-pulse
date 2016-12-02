import React from 'react';

import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Project Entry: {this.props.params.entryId}</h1>
        <ProjectList entryId={this.props.params.entryId} />
      </div>
    );
  }
});
