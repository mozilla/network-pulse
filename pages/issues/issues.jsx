import React from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router';
import IssueSelector from '../../components/issue-selector/issue-selector.jsx';
import Service from '../../js/service';
import Utility from '../../js/utility';

class Issues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issues: []
    };
  }

  componentDidMount() {
    this.getIssues();
  }

  getIssues() {
    Service.issues
      .get()
      .then((issues) => {
        // sort issues alphabetically by their name
        issues.sort((a,b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        this.setState({ issues });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  renderIssueSection(issue) {
    return (
      <div className="issue-section col-md-6" key={issue.name}>
        <h2><Link to={`/issues/${Utility.getUriPathFromIssueName(issue.name)}`}>{issue.name}</Link></h2>
        <p>{issue.description}</p>
      </div>
    );
  }

  render() {
    return (
      <div className="issues-page">
        <Helmet><title>Issues</title></Helmet>
        <IssueSelector />
        <p className="intro">Mozilla has identified five issues that we believe must be tackled in the current era, to build the open internet we want. Tap above to browse by issue.</p>
        <div className="row">
          {
            this.state.issues.map(issue => { return this.renderIssueSection(issue); })
          }
        </div>
      </div>
    );
  }
}
export default Issues;
