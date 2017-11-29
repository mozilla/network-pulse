import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";
import Bio from '../components/bio/bio.jsx';
import ProjectList from '../components/project-list/project-list.jsx';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProfile() {
    if (!this.props.profile) return null;

    return <div className="col-12"><Bio {...this.props.profile} user={this.props.user} history={this.props.history} /></div>;
  }

  renderProjects(entries, label) {
    if (!this.props.profile || entries.length < 1) return null;

    return <div className="row">
      <div className="col">
        <h2 className="h4">
          {label}
        </h2>
      </div>
      <div className="col-12">
        {/* TODO:FIXME: for now let's just render all entries at once. (no 'view more' button) I will file another PR to refine this. */}
        <ProjectList entries={entries}
          loadingData={false}
          moreEntriesToFetch={false}
          fetchData={()=>{}}
          onModerationMode={false}
        />
      </div>
    </div>
    ;
  }

  render() {
    return (
      <div className="profile-page">
        <Helmet><title>Profile</title></Helmet>
        <div className="row">
          { this.renderProfile() }
        </div>
        { this.renderProjects(this.props.profile.published_entries, `Published Projects`) }
        { this.renderProjects(this.props.profile.created_entries, `Created Projects`) }
      </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Profile;
