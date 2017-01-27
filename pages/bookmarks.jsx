import React from 'react';
import { getBookmarks } from '../js/bookmarks-manager';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';

import UserData from '../js/user-data.js';
import Login from '../js/login.js';
import env from "../config/env.generated.json";

export default React.createClass({
  getInitialState() {
    return {
      bookmarks: null
    };
  },
  handleLogOutBtnClick(event) {
    event.preventDefault();
    Login.logoutUser(error => {
      if (!error) {
        this.forceUpdate();
      }
    });
  },
  componentDidMount() {
    // get IDs of user's bookmarked entries
    this.setState({bookmarks: getBookmarks()});

    // let's verify what the logged in status is
    let currentLocation = this.props.router.location;

    Login.verifyLoggedInStatus(currentLocation, error => {
      if (!error) {
        this.forceUpdate();
      }
    });
  },
  render() {
    let redirectUrl = `${env.ORIGIN}${this.props.router.getCurrentLocation().pathname}`;
    let logInUrl = UserData.logInUrl.get(redirectUrl);
    let promptToLogIn = <p>Are you Mozilla Staff? <a href={logInUrl}>Sign in</a>.</p>;
    let contentForStaff = <p>Hi {UserData.username.get()}! <button onClick={this.handleLogOutBtnClick} className="btn-link">Log out</button>.</p>;
    let contentForNonStaff = <p>Only Mozilla staff can login now as we test this new platform. Meanwhile, your favorited projects can still be remembered on this device.</p>;

    let loggedInStatus = promptToLogIn;
    let userType = UserData.type.get();

    if (userType === `staff`) {
      loggedInStatus = contentForStaff;
    } else if (userType === `nonstaff`) {
      loggedInStatus = contentForNonStaff;
    } else {
      loggedInStatus = promptToLogIn;
    }

    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // For more info see: https://github.com/mozilla/network-pulse/issues/326
    let headerText = `Save your Favs`;

    return (
      <div>
        <div className="logged-in-status">{ loggedInStatus }</div>
        { this.state.bookmarks && this.state.bookmarks.length > 0 ?
                            <ProjectList params={{ids: this.state.bookmarks.join(`,`)}} />
                            : <HintMessage imgSrc={`/assets/svg/icon-bookmark-selected.svg`}
                                           header={headerText}
                                           btn={{to: `/featured`, text: `Explore featured`}}>
                                <p>Tap the heart on any project to save it here.</p>
                              </HintMessage>
        }
      </div>
    );
  }
});
