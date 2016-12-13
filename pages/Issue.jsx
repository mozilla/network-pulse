import React from 'react';

import InactiveSearchBar from '../components/inactive-search-bar.jsx';
import Navbar from '../components/navbar/navbar.jsx';
import IssueSelector from '../components/issue-selector/issue-selector.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <InactiveSearchBar/>
        <Navbar/>
        <div className="container">
          <IssueSelector />
          <ProjectList filter={ {key: `issue`, value: this.props.params.issue} } />
        </div>
      </div>
    );
  }
});
