import React from 'react';
import ProjectList from '../project-list/project-list.jsx';
import pageSettings from '../../js/app-page-settings';
import env from "../../config/env.generated.json";

const PROJECT_BATCH_SIZE = env.PROJECT_BATCH_SIZE;

class StaticProjectLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedEntries: [],
      loadingData: false,
      nextBatchIndex: 1,
      moreEntriesToFetch: false,
      // totalMatched: 0
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <ProjectList entries={this.state.renderedEntries}
                    loadingData={this.state.loadingData}
                    moreEntriesToFetch={this.state.moreEntriesToFetch}
                    fetchData={this.fetchData}
                    restoreScrollPosition={pageSettings.shouldRestore}
                    onModerationMode={!!this.props.moderationState} />
    );
  }
}

export default StaticProjectLoader;
