import React from 'react';

import PageWrapper from '../components/page-wrapper/page-wrapper.jsx';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <PageWrapper showSearch={true} showNav={true}>
        <h1>Issue: {this.props.params.issue}</h1>
        <IssueSelector />
        <ProjectList filter={ {key: `issue`, value: this.props.params.issue} } />
      </PageWrapper>
    );
  }
});
