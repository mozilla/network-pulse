import React from 'react';
import ProjectCard from '../components/project-card/project-card.jsx';
import Service from '../js/service.js';

export default React.createClass({
  getInitialState() {
    return {
      loadedFromGoogle: false,
      entry: null
    };
  },
  componentDidMount() {
    this.fetchData(this.props.params.entryId);
  },
  fetchData(entryId = ``) {
    Service.entry
      .get(entryId)
      .then((entry) => {
        this.setState({
          loadedFromGoogle: true,
          entry: entry
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  render() {
    return (
      <div>
        { this.state.loadedFromGoogle ? <ProjectCard {...this.state.entry} onDetailView={true} /> : null }
      </div>
    );
  }
});
