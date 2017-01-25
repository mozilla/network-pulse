import React from 'react';
import ProjectCard from '../components/project-card/project-card.jsx';
import Service from '../js/service.js';
import Utility from '../js/utility.js';

export default React.createClass({
  getInitialState() {
    return {
      dataLoaded: false,
      entry: null
    };
  },
  componentDidMount() {
    this.fetchData(this.props.params.entryId);
  },
  fetchData(entryId = ``) {
    Service.entry
      .get(entryId)
      .then((response) => {
        this.setState({
          dataLoaded: true,
          entry: response
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  render() {
    return (
      <div>
        { this.state.dataLoaded ? <ProjectCard {...Utility.processEntryData(this.state.entry)} onDetailView={true} /> : null }
      </div>
    );
  }
});
