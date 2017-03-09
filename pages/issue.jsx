import React from 'react';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';

export default React.createClass({
  encodeIssueAsUri(issue) {
    switch(issue) { // the five issues we have
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

    return encodeURIComponent(issue);
  },
  render() {
    return (
      <div>
        <IssueSelector />
        <ProjectLoader params={{ issue: this.encodeIssueAsUri(this.props.params.issue) }} />
      </div>
    );
  }
});
