import React from "react";
import { Link } from "react-router-dom";
import qs from "qs";
import LoadingNotice from "../components/loading-notice.jsx";
import NotificationBar from "../components/notification-bar/notification-bar.jsx";
import ProjectCardDetailed from "../components/project-card/project-card-detailed.jsx";
import Service from "../js/service.js";
import Utility from "../js/utility.js";
import pageSettings from "../js/app-page-settings.js";
import user from "../js/app-user";

const NO_ENTRY_TITLE = `Entry unavailable`;
const NO_ENTRY_BLOCK = (
  <div className="text-center">
    <div className="content">
      <p className="description">This entry is not currently available.</p>
    </div>
  </div>
);

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user,
      dataLoaded: false,
      justPostedByUser: false,
      entry: null
    };
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.entryId);
  }

  componentWillUnmount() {
    pageSettings.setRestore(true);
  }

  fetchData(entryId = ``) {
    Service.entry
      .get(entryId)
      .then(response => {
        this.setState({
          dataLoaded: true,
          entry: response
        });
        this.checkIfRedirectedFromFormSubmission();
      })
      .catch(reason => {
        console.error(reason);
        this.setState({
          dataLoaded: true,
          errorLoadingData: true
        });
      });
  }

  checkIfRedirectedFromFormSubmission() {
    let location = this.props.location;
    let query = qs.parse(location.search.substring(1));
    let justPostedByUser = false;

    if (query.justPostedByUser) {
      justPostedByUser = query.justPostedByUser === `true`;

      // remove 'justPostedByUser' query from URL
      delete query.justPostedByUser;
      this.props.history.replace({
        pathname: location.pathname,
        search: `?${qs.stringify(query)}`
      });
    }

    this.setState({ justPostedByUser });
  }

  renderEntry() {
    if (!this.state.dataLoaded) return <LoadingNotice />;

    let justPostedByUserMessage = null;
    let content = NO_ENTRY_BLOCK;
    let docTitle = NO_ENTRY_TITLE; // html doc title

    if (!this.state.errorLoadingData) {
      docTitle = `${this.state.entry.title}`;
      justPostedByUserMessage = this.state.justPostedByUser && (
        <div className="col-12 my-3">
          <NotificationBar>
            Thanks! Submission was added to{" "}
            <Link to={`/profile/${this.state.user.profileid}`}>
              your profile
            </Link>
            .
          </NotificationBar>
        </div>
      );
      content = (
        <ProjectCardDetailed
          {...Utility.processEntryData(this.state.entry)}
          onDetailView={true}
        />
      );
    }

    return (
      <div className="w-100">
        {Utility.generateMetaTags(
          docTitle,
          `Discover and collaborate on Mozilla Pulse`,
          this.state.entry.thumbnail
        )}
        {justPostedByUserMessage}
        {content}
      </div>
    );
  }

  render() {
    return this.renderEntry();
  }
}

export default Entry;
