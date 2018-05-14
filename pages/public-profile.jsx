import React from 'react';
import NotFound from './not-found.jsx';
import Service from '../js/service';
import { Helmet } from "react-helmet";
import Bio from '../components/bio/bio.jsx';
import ProfileTabGroup from '../components/profile-tab-group/profile-tab-group.jsx';
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

  componentWillReceiveProps(nextProps) {
    this.fetchProfile(nextProps.match.params.id, newState => {
      this.setState(newState);
    });
  }

  renderProfile() {
    if (!this.state.userProfile) return <NotFound header="Profile not found" />;

    let userProfile = this.state.userProfile;

    return <div>
      <Helmet><title>{userProfile.name}</title></Helmet>
      <div className="row">
        <div className="col-12">
          <Bio {...userProfile} user={this.state.user} history={this.props.history} />
        </div>
      </div>
      <hr />
      <ProfileTabGroup profileId={userProfile.profile_id} myProfile={userProfile.my_profile} />
    </div>;
  }

  render() {
    return <div className="profile-page">
      { this.state.showLoadingNotice ? <LoadingNotice /> : this.renderProfile() }
    </div>;
  }
}

export default PublicProfile;
