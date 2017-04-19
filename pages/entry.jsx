import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
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
          entry: response
        });
        this.checkIfRedirectedFromFormSubmission();
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  checkIfRedirectedFromFormSubmission() {
    let location = this.props.router.location;
    let query = location.query;
    let justPostedByUser;

    if (query && query.justPostedByUser) {
      justPostedByUser = query.justPostedByUser === `true`;

      // remove 'justPostedByUser' query from URL
      delete query.justPostedByUser;
      browserHistory.replace({
        pathname: location.pathname,
        query: query
      });
    }

    this.setState({
      justPostedByUser: justPostedByUser
    });
  },
  render() {
    let docTitle;
    let justPostedByUserMessage;
    let projectCard;

    if (this.state.dataLoaded) {
      docTitle = `${this.state.entry.title}`;
      justPostedByUserMessage = this.state.justPostedByUser ? (<h5 className="text-center">Thanks for submitting!</h5>) : null;
      projectCard = this.state.dataLoaded ? <ProjectCard {...Utility.processEntryData(this.state.entry)} onDetailView={true} /> : null;
    }

    if (docTitle) {
      docTitle = <Helmet><title>{ docTitle }</title></Helmet>;
    }

    return (
      <div>
        { docTitle }
        { justPostedByUserMessage }
        { projectCard }
      </div>
    );
  }
});
