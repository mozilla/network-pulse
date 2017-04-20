import React from 'react';
import { Helmet } from "react-helmet";
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';

const issueMapping = {
  "online-privacy-and-security": `Online Privacy & Security`,
  "open-innovation": `Open Innovation`,
  "decentralization": `Decentralization`,
  "web-literacy": `Web Literacy`,
  "digital-inclusion": `Digital Inclusion`
};

export default function (props) {
  const issueName = issueMapping[props.params.issue] || ``;

  return <div>
            <Helmet><title>{issueName}</title></Helmet>
            <IssueSelector />
            <ProjectLoader issue={encodeURIComponent(issueName)} />
          </div>;
}
