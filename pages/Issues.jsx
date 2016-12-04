import React from 'react';
import PageWrapper from '../components/page-wrapper/page-wrapper.jsx';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';

export default React.createClass({
  render() {
    return (
      <PageWrapper showSearch={true} showNav={true}>
        <h1>Issues Page</h1>
        <IssueSelector />
        <p>Mozilla has identified five issues critical to a healthy and open internet. Tap above to browse by issue.</p>
      </PageWrapper>
    );
  }
});
