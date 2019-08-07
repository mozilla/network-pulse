import React from "react";
import NavLink from "../nav-link/nav-link.jsx";
import Utility from "../../js/utility";

const ISSUES = [
  `Decentralization`,
  `Digital Inclusion`,
  `Privacy & Security`,
  `Openness`,
  `Web Literacy`
];

class IssueSelector extends React.Component {
  renderIssueLinks() {
    return ISSUES.map(issueName => {
      let linkTo = `/issues/${Utility.getUriPathFromIssueName(issueName)}`;
      return (
        <NavLink className="btn btn-tag" to={linkTo} key={issueName}>
          {issueName}
        </NavLink>
      );
    });
  }

  render() {
    return <div className="issue-selector">{this.renderIssueLinks()}</div>;
  }
}
export default IssueSelector;
