import React from 'react';
import NotFound from './not-found.jsx';
import Service from '../js/service';
import Profile from './profile.jsx';
import LoadingNotice from '../components/loading-notice.jsx';

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
        showLoadingNotice: false
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

  render() {
    return this.state.showLoadingNotice ? <LoadingNotice /> : this.renderProfile();
  }
}

export default PublicProfile;
