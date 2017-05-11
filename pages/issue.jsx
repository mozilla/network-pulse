import React from 'react';
import { Helmet } from "react-helmet";
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';
import Utility from '../js/utility.js';

export default function (props) {
  const issueName = Utility.getIssueNameFromUriPath(props.params.issue);

  return <div>
            <Helmet><title>{issueName}</title></Helmet>
            <IssueSelector />
            <ProjectLoader issue={encodeURIComponent(issueName)} />
          </div>;
}
