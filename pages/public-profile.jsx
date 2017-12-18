import React from 'react';
import NotFound from './not-found.jsx';
import Service from '../js/service';
import Profile from './profile.jsx';
import LoadingNotice from '../components/loading-notice.jsx';
import user from '../js/app-user';

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user,
      userProfile: null,
      showLoadingNotice: true
    };
  }

  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.location, this.props.history);

    this.fetchProfile(this.props.match.params.id, newState => {
      this.setState(newState);
    });
  }

  componentWillUnmount() {
    user.removeListener(this);
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

    return <Profile profile={this.state.userProfile} user={this.state.user} history={this.props.history} />;
  }

  render() {
    return this.state.showLoadingNotice ? <LoadingNotice /> : this.renderProfile();
  }
}

export default PublicProfile;
