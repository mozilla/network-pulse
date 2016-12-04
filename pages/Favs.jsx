import React from 'react';
import PageWrapper from '../components/page-wrapper/page-wrapper.jsx';

export default React.createClass({
  render() {
    return (
      <PageWrapper showSearch={true} showNav={true}>
        <h1>Fav Page</h1>
      </PageWrapper>
    );
  }
});
