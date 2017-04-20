import React from 'react';
import { Helmet } from "react-helmet";
import IssueSelector from '../components/issue-selector/issue-selector.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <Helmet><title>Issues</title></Helmet>
        <IssueSelector />
        <p>Mozilla has identified five issues critical to a healthy and open internet. Tap above to browse by issue.</p>
      </div>
    );
  }
});
