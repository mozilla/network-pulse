import React from 'react';
import { Link } from 'react-router';
import ReactGA from 'react-ga';
import NotFound from './not-found.jsx';
import Service from '../js/service';
import Profile from './profile.jsx';
import LoadingNotice from '../components/loading-notice.jsx';
import user from '../js/app-user';
import utility from '../js/utility';

class MyProfile extends React.Component {
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
    user.verify(this.props.router.location);
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified` ) {
      this.setState({ user }, () => {
        if (this.state.user.loggedin) {
          this.fetchProfile(this.props.params.id, newState => {
            this.setState(newState);
          });
        }
      });
    }
  }

  fetchProfile(profileId, response) {
    Service.profileMe()
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

  handleSignInBtnClick(event) {
    event.preventDefault();

    ReactGA.event({
      category: `Account`,
      action: `Login`,
      label: `Login ${window.location.pathname}`,
      transport: `beacon`
    });

    user.login(utility.getCurrentURL());
  }

  renderProfile() {
    if (!this.state.userProfile) return <NotFound header="Profile not found" />;

    return <Profile profile={this.state.userProfile} user={this.state.user} />;
  }

  getContentForLoggedInUser() {
    return this.state.showLoadingNotice ? <LoadingNotice /> : this.renderProfile();
  }

  getAnonymousContent() {
    return <NotFound header="You do not have access to this page" linkComponent={false}>
      <p><button className="btn btn-link inline-link" onClick={(event) => this.handleSignInBtnClick(event)}>Log in</button> or see <Link to="/featured">Featured projects</Link></p>
    </NotFound>;
  }

  renderContent() {
    if (user.loggedin === undefined) return null;

    if (user.loggedin) return this.getContentForLoggedInUser();

    return this.getAnonymousContent();
  }

  render() {
    return this.renderContent();
  }
}

export default MyProfile;
