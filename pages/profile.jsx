import React from "react";
import NotFound from "./not-found.jsx";
import Service from "../js/service";
import { Helmet } from "react-helmet";
import Bio from "../components/bio/bio.jsx";
import ProfileTabGroup from "../components/profile-tab-group/profile-tab-group.jsx";
import LoadingNotice from "../components/loading-notice.jsx";
import user from "../js/app-user";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    return {
      user,
      userProfile: null,
      showLoadingNotice: true,
      activeTab: props.match.params.tab
    };
  }

  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.location, this.props.history);

    this.fetchProfile(this.props.match.params.id, newState => {
      this.setState(newState);
    });
  }

  componentWillReceiveProps(nextProps) {
    let diffProfile = nextProps.match.params.id !== this.props.match.params.id;
    let diffTab = nextProps.match.params.tab !== this.props.match.params.tab;

    if (!diffProfile && diffTab) {
      this.setState({ activeTab: nextProps.match.params.tab });
    }

    if (diffProfile) {
      this.setState(this.getInitialState(nextProps), () => {
        this.fetchProfile(nextProps.match.params.id, newState => {
          this.setState(newState);
        });
      });
    }
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
    let userProfile = this.state.userProfile;
    let activeTab = this.props.match.params.tab;

    if (!userProfile) return <NotFound header="Profile not found" />;

    if (this.props.location.state) {
      activeTab = this.props.location.state.activeTab;
    }

    return (
      <div>
        <Helmet>
          <title>{userProfile.name}</title>
        </Helmet>
        <div className="row">
          <div className="col-12">
            <Bio
              {...userProfile}
              user={this.state.user}
              history={this.props.history}
            />
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ProfileTabGroup
              profileId={userProfile.profile_id}
              myProfile={userProfile.my_profile}
              entryCount={userProfile.entry_count}
              userBioLong={userProfile.user_bio_long}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="profile-page container mt-5">
        {this.state.showLoadingNotice ? (
          <LoadingNotice />
        ) : (
          this.renderProfile()
        )}
      </div>
    );
  }
}

export default Profile;
