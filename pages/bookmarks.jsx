import React from 'react';
import { browserHistory } from 'react-router';
import { getBookmarks } from '../js/bookmarks-manager';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';

import Service from '../js/service.js';
import config from '../js/user-data.js';
import env from "../config/env.generated.json";

export default React.createClass({
  getInitialState() {
    return {
      bookmarks: null
    };
  },
  verifyLoggedInStatus() {
    Service.userstatus()
      .then(response => this.updateLoggedInInfo(response.loggedin, response.username))
      .catch(reason => {
        this.updateLoggedInInfo(false);
        console.error(reason);
      });
  },
  updateLoggedInInfo(status, username = ``) {
    config.userLoggedInStatus.set(status);
    config.username.set(username);
    this.forceUpdate();
  },
  logOutUser() {
    Service.logout()
      .then(() => {
        // we have successfully logged user out
        this.updateLoggedInInfo(false);
      })
      .catch(reason => {
        console.error(reason);
      });
  },
  componentDidMount() {
    let query = this.props.router.location.query;
    
    // we don't need the "loggedin" param sent back from Pulse API to be presented at all times
    delete query.loggedin;

    browserHistory.replace({
      pathname: this.props.router.location.pathname,
      query: query
    });

    // get IDs of user's bookmarked entries
    this.setState({bookmarks: getBookmarks()});

    // let's verify what the logged in status is
    this.verifyLoggedInStatus();
  },
  render() {
    let redirectUrl = `${env.ORIGIN}${this.props.router.getCurrentLocation().pathname}`;
    let logInUrl = config.logInUrl.get(redirectUrl);
    let loggedInStatus = config.userLoggedInStatus.get() ?
                        <p>Hi {config.username.get()}! <button onClick={this.logOutUser} className="btn-link">Log out</button>.</p>
                        : <p>Are you Mozilla Staff? <a href={logInUrl}>Sign in</a>.</p>;
    
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
