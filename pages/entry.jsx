import React from 'react';
import ProjectCard from '../components/project-card/project-card.jsx';
import Service from '../js/service.js';
import Utility from '../js/utility.js';

export default React.createClass({
  getInitialState() {
    return {
      dataLoaded: false,
      justPostedByUser: false,
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
          entry: response,
          justPostedByUser: this.props.router.location.query.justPostedByUser.toLowerCase() === `true`
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  render() {
    let justPostedByUserMessage;
    let projectCard;

    if (this.state.dataLoaded) {
      justPostedByUserMessage = this.state.justPostedByUser ? (<h5 className="text-center">Thanks for submitting! Here's the entry you just posted.</h5>) : null;
      projectCard = this.state.dataLoaded ? <ProjectCard {...Utility.processEntryData(this.state.entry)} onDetailView={true} /> : null;
    }

    return (
      <div>
        { justPostedByUserMessage }
        { projectCard }
      </div>
    );
  }
});
