import React from 'react';
import { getFavs } from '../js/favs-manager';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';

import Service from '../js/service.js';
import config from '../config/config.js';
import env from "../config/env.generated.json";

export default React.createClass({
  getInitialState() {
    return {
      favs: null,
      loggedInCheckTimestamp: null
    };
  },
  verifyLoggedInStatus() {
    Service.nonce()
      .then((response) => {
        let user = {};

        try {
          user = JSON.parse(response).user;
        } catch (err) {
          console.error(err);
        }
        this.updateLoggedInInfo(true, user);
      })
      .catch((reason) => {
        this.updateLoggedInInfo(false);
        console.error(reason);
      });
  },
  updateLoggedInInfo(status, username = ``) {
    config.userLoggedInStatus.set(status);
    config.username.set(username);
    this.setState({loggedInCheckTimestamp: new Date()});
  },
  logOutUser(event) {
    event.preventDefault();

    Service.logout()
      .then(() => {
        // we have successfully logged user out
        this.updateLoggedInInfo(false);
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  componentDidMount() {
    // get IDs of user's favorited entries
    this.setState({favs: getFavs()});

    // let's verify what the logged in status is
    this.verifyLoggedInStatus();
  },
  render() {
    let redirectBackUrl = `${env.ORIGIN}${this.props.router.getCurrentLocation().pathname}`;
    let logInUrl = config.logInUrl.get(redirectBackUrl);
    let loggedInStatus = config.userLoggedInStatus.get() ?
                        <p>Hi {config.username.get()}! <a href="" onClick={this.logOutUser}>Log out</a>.</p>
                        : <p>Are you Mozilla Staff? <a href={logInUrl}>Sign in</a>.</p>;

    return (
      <div>
        <div className="logged-in-status">{ loggedInStatus }</div>
        { this.state.favs && this.state.favs.length > 0 ?
                            <ProjectList params={{ids: this.state.favs.join(`,`)}} />
                            : <HintMessage imgSrc={`/assets/svg/icon-fav-selected.svg`}
                                           header={`Save your Favs`}
                                           btn={{to: `/featured`, text: `Explore featured`}}>
                                <p>Tap the heart on any project to save it here.</p>
                              </HintMessage>
        }
      </div>
    );
  }
});
