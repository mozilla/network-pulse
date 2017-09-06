import React from 'react';
import { Helmet } from "react-helmet";
import Service from '../js/service.js';
import Bio from '../components/bio/bio.jsx';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: null
    };
  }

  componentDidMount() {
    Service.profileMe()
      .then(userProfile => {
        console.log(userProfile);
        this.setState({ userProfile });
      })
      .catch(reason => {
        console.error(reason);

      });
  }

  renderProfile() {
    if (!this.state.userProfile) return null;

    return <div className="col-12"><Bio {...this.state.userProfile} /></div>;
  }

  renderProjects() {
    return null;
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
