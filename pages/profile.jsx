import React from 'react';
import { Helmet } from "react-helmet";
import Service from '../js/service.js';
import Bio from '../components/bio/bio.jsx';
import ProjectList from '../components/project-list/project-list.jsx';
import pageSettings from '../js/app-page-settings';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      userProfileLoaded: false
    };
  }

  componentDidMount() {
    Service.profileMe()
      .then(userProfile => {
        this.setState({ userProfile, userProfileLoaded: true });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  renderProfile() {
    if (!this.state.userProfileLoaded) return null;

    return <div className="col-12"><Bio {...this.state.userProfile} /></div>;
  }

  renderProjects() {
    if (!this.state.userProfileLoaded) return null;
    if (this.state.userProfileLoaded && this.state.userProfile.published_entries.length < 1) return null;

    return <div className="col-12">
      {/* TODO:FIXME: for now let's just render all entries at once. (no 'view more' button) I will file another PR to refine this. */}
      <ProjectList entries={this.state.userProfile.published_entries}
        loadingData={false}
        moreEntriesToFetch={false}
        fetchData={()=>{}}
        restoreScrollPosition={pageSettings.shouldRestore}
        onModerationMode={false}
      />
    </div>;
  }

  render() {
    return (
      <div className="profile-page">
        <Helmet><title>Profile</title></Helmet>
        <div className="row">
          { this.renderProfile() }
        </div>
        <div className="row">
          { this.renderProjects() }
        </div>
      </div>
    );
  }
}
export default Profile;
