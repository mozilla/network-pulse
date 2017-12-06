import React from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';
import Utility from '../js/utility.js';

export default function (props) {
  const issueParam = decodeURIComponent(props.match.params.issue);
  let issueName = Utility.getIssueNameFromUriPath(issueParam);

  // render page if issueName is one of the 5 hyphenated all lowercase routes we want to serve
  // e.g., digital-inclusion, open-innovation
  if (issueName) {
    return <div>
              <Helmet><title>{issueName}</title></Helmet>
              <IssueSelector />
              <ProjectLoader issue={issueName} showCounter={true} />
            </div>;
  }

  issueName = Utility.getUriPathFromIssueName(issueParam);

  // redirect to the corresponding matching route if issueName is a known "issue"
  // e.g., "Digital Inclusion", "Open Innovation"
  if (issueName) {
    return <Redirect to={`/issues/${issueName}`} />;
  }

  // issueName can't be recognized, redirect to /issues
  return <Redirect to="/issues" />;
}
