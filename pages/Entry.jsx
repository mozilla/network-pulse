import React from 'react';

import PageWrapper from '../components/page-wrapper/page-wrapper.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <PageWrapper showSearch={false} showNav={true}>
        <h1>Project Entry: {this.props.params.entryId}</h1>
        <ProjectList filter={ {key: `entry`, value: this.props.params.entryId} } showDetail={true} />
      </PageWrapper>
    );
  }
});
