import React from 'react';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  getIssueName() {
    let issue = ``;

    switch(this.props.params.issue) { // the five issues we have
      case `online-privacy-and-security`:
        issue = `Online Privacy & Security`;
        break;
      case `open-innovation`:
        issue = `Open Innovation`;
        break;
      case `decentralization`:
        issue = `Decentralization`;
        break;
      case `web-literacy`:
        issue = `Web Literacy`;
        break;
      case `digital-inclusion`:
        issue = `Digital Inclusion`;
        break;
      default:
        issue = ``;
    }

    return issue;
  },
  render() {
    return (
      <div>
        <IssueSelector />
        <ProjectList params={{issue: encodeURIComponent(this.getIssueName())}} />
      </div>
    );
  }
});
