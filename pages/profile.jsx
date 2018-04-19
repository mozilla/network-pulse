import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import Bio from '../components/bio/bio.jsx';
import ProfileTabGroup from '../components/profile-tab-group/profile-tab-group.jsx';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProfile() {
    if (!this.props.profile) return null;

    return <div className="col-12"><Bio {...this.props.profile} user={this.props.user} history={this.props.history} /></div>;
  }

  render() {
    return (
      <div className="profile-page">
        <Helmet><title>{this.props.profile.name}</title></Helmet>
        <div className="row">
          { this.renderProfile() }
        </div>
        <hr />
        <ProfileTabGroup profileId={this.props.profile.profile_id} myProfile={this.props.profile.my_profile} />
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Profile;
