import React from 'react';
import { browserHistory } from 'react-router';
import { getFavs } from '../js/favs-manager';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';

import Service from '../js/service.js';
import config from '../config/config.js';
import env from "../config/env.generated.json";

export default React.createClass({
  getInitialState() {
    return {
      favs: null
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

    browserHistory.push({
      pathname: this.props.router.location.pathname,
      query: query
    });

    // get IDs of user's favorited entries
    this.setState({favs: getFavs()});

    // let's verify what the logged in status is
    this.verifyLoggedInStatus();
  },
  render() {
    let redirectUrl = `${env.ORIGIN}${this.props.router.getCurrentLocation().pathname}`;
    let logInUrl = config.logInUrl.get(redirectUrl);
    let loggedInStatus = config.userLoggedInStatus.get() ?
                        <p>Hi {config.username.get()}! <button onClick={this.logOutUser} className="btn-link">Log out</button>.</p>
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
