import React from 'react';

import Navbar from '../components/navbar/navbar.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <Navbar onDetailView={true} />
        <div className="container">
          <ProjectList filter={ {key: `entry`, value: this.props.params.entryId} } onDetailView={true} />
        </div>
      </div>
    );
  }
});

