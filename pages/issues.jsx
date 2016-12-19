import React from 'react';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <div className="container">
          <IssueSelector />
          <p>Mozilla has identified five issues critical to a healthy and open internet. Tap above to browse by issue.</p>
        </div>
      </div>
    );
  }
});
