import React from 'react';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <ProjectList filter={ {key: `entry`, value: this.props.params.entryId} } onDetailView={true} />
    );
  }
});

