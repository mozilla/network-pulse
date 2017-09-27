import React from 'react';
import NotFound from './not-found.jsx';
import Service from '../js/service';
import Profile from './profile.jsx';

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null,
      showLoadingNotice: true
    };
  }

  componentDidMount() {
    this.fetchProfile(this.props.params.id, newState => {
      this.setState(newState);
    });
  }

  fetchProfile(profileId, response) {
    Service.profile(profileId)
    .then(userProfile => {
      response({
        userProfile,
        showLoadingNotice: true
      });
    })
    .catch(reason => {
      console.error(reason);
      response({
        showLoadingNotice: false
      });
    });
  }

  renderProfile() {
    if (!this.state.userProfile) return <NotFound header="Profile not found" />;

    return <Profile profile={this.state.userProfile} />;
  }

  renderLoadingNotice() {
    // 3 empty <div></div> here are for the loading animation dots (done in CSS) to show.
    return <div className="loading my-5 d-flex justify-content-center align-items-center">
              <div></div>
              <div></div>
              <div></div>
            </div>;
  }

  render() {
    return this.state.showLoadingNotice ? this.renderLoadingNotice() : this.renderProfile();
  }
}

export default PublicProfile;
