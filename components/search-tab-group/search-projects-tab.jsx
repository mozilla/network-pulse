import React from 'react';
import { Helmet } from "react-helmet";
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

class SearchProjectsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderProjects() {
    if (!this.props.keywordSearched) return null;

    if (this.props.keywordSearched) {
      return <ProjectLoader search={this.props.keywordSearched} showCounter={true} />;
    }
  }

  render() {
    return (
      <div className="search-projects-tab">
        <Helmet><title></title></Helmet>
        { this.renderProjects() }
      </div>
    );
  }
}

export default SearchProjectsTab;
