import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import ProjectCard from '../components/project-card/project-card.jsx';
import Service from '../js/service.js';
import Utility from '../js/utility.js';

const NO_ENTRY_TITLE = `Entry unavailable`;
const NO_ENTRY_BLOCK = (
  <div className="main-content text-center">
    <div className="content">
      <p className="description">
        This entry is not currently available.
      </p>
    </div>
  </div>
);

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
        this.setState({
          noData: true
        });
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
    let description;
    let justPostedByUserMessage = null;
    let content;

    if (this.state.dataLoaded) {
      docTitle = `${this.state.entry.title}`;
      justPostedByUserMessage = this.state.justPostedByUser ? (<h5 className="col-12 text-center">Thanks for submitting!</h5>) : null;
      content = <ProjectCard {...Utility.processEntryData(this.state.entry)} onDetailView={true} />;
      description = `${this.state.entry.description}`;
    }

    if (this.state.noData) {
      docTitle = NO_ENTRY_TITLE;
      content = NO_ENTRY_BLOCK;
      description = '';
    }

    if (docTitle) {
      docTitle = <Helmet>
      <meta property="og:title" content= "{ `${this.state.entry.title}` }" />
      <meta property="og:description"  content="{ `${this.state.entry.description}` }" />   
      </Helmet>;
    }

    return (
      <div className="row justify-content-center">
        { docTitle }
        { justPostedByUserMessage }
        { content }
      </div>
    );
  }
});
