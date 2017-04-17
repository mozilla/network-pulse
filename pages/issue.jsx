import React from 'react';
import { Helmet } from "react-helmet";
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';

export default function (props) {
  const getFullIssueName = function(issue) {
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

    return issue;
  };

  const issueName = getFullIssueName(props.params.issue);

  return <div>
            <Helmet><title>{issueName}</title></Helmet>
            <IssueSelector />
            <ProjectLoader issue={encodeURIComponent(issueName)} />
          </div>;
}
