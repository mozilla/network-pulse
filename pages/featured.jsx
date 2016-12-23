import React from 'react';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    console.log(`this.props.router`,this.props.router);
    return (
      <ProjectList filter={{key: `featured`}} />
    );
  }
});
