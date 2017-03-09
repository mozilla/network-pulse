import React from 'react';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';

export default function (props) {
  const encodeIssueAsUri = function(issue) {
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
  };

  return <div>
            <IssueSelector />
            <ProjectLoader params={{ issue: encodeIssueAsUri(props.params.issue) }} />
          </div>;
}
