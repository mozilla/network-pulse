import React from 'react';

import PageWrapper from '../components/page-wrapper/page-wrapper.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <PageWrapper showSearch={true} showNav={true}>
        <h1>Latest Page</h1>
        <ProjectList />
      </PageWrapper>
    );
  }
});
