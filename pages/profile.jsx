import React from 'react';
import { Helmet } from "react-helmet";
// import { Link } from 'react-router';
import Bio from '../components/bio/bio.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';


const SomeUser = {
  firstname: `Mmaki`,
  lastname: `Jantjies`,
  pic: `/assets/temp-profile-pic-4.png`,
  org: `Mozilla Tech Policy Fellow`,
  orgIcon: ``,
  location: `Washington, DC, USA`,
  socialMedia: [
    {
      'type': `twitter`,
      'link': ``
    },
    {
      'type': `linkedin`,
      'link': ``
    }
  ],
  language: [ `English` ],
  storyLink: `https://example.com/story`,
  link: `https://example.com/link`
};


class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProfile() {
    return <div className="col-12"><Bio {...SomeUser} /></div>;
  }

  renderProjects() {
    return <div className="col-12"><ProjectLoader /></div>;
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
