import React from 'react';
import { Helmet } from "react-helmet";
// import { Link } from 'react-router';
import Bio from '../components/bio/bio.jsx';
import ProjectLoader from '../components/project-loader/project-loader.jsx';


// real schema
/*
{
    "user_bio": "",
    "custom_name": "",
    "is_group": false,
    "thumbnail": null,
    "issues": [],
    "twitter": "",
    "linkedin": "",
    "github": "",
    "website": ""
}
*/


const SomeUser = {
  thumbnail: `/assets/temp-profile-pic-4.png`,
  twitter: `https://example.com/twitter`,
  linkedin: `https://example.com/linkedin`,
  github: `https://example.com/github`,
  website: `https://example.com/website`,
  "user_bio": `Mom, PhD, Academic, Educator, loves myAfrica, has a passion for inclusive tech, #ict4d #mobilelearning #edutech #egovernance #womenintech`,

  firstname: `Mmaki`,
  lastname: `Jantjies`,
  org: `Mozilla Tech Policy Fellow`,
  orgIcon: ``,
  location: `Washington, DC, USA`,
  language: [
    `English`
  ],
  storyLink: `https://example.com/story`,
  interest: [
    `web literacy`,
    `digital inclusion`
  ],
  "help_with": [
    `create content`,
    `fundraise`
  ]
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
