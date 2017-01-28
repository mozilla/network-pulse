import React from 'react';
import { getBookmarks } from '../js/bookmarks-manager';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';

import utility from '../js/utility';
import user from '../js/app-user';

export default React.createClass({
  getInitialState() {
    return {
      bookmarks: null,
      user
    };
  },
  handleSignInBtnClick(event) {
    event.preventDefault();

    user.login(utility.getCurrentURL());
  },
  handleLogOutBtnClick(event) {
    event.preventDefault();
    user.logout();
    this.setState({ user });
  },
  componentDidMount() {
    // get IDs of user's bookmarked entries
    this.setState({bookmarks: getBookmarks()});

    // let's verify what the logged in status is
    user.verify(this.props.router.location, () => this.setState({ user }));
  },
  getContentForLoggedInUser() {
    return(<p>Hi {user.username}! <button onClick={this.handleLogOutBtnClick} className="btn-link">Log out</button>.</p>);
  },
  getFailurePrompt() {
    return (<p>Only Mozilla staff can login now as we test this new platform. Meanwhile, your favorited projects can still be remembered on this device.</p>);
  },
  getAnonymousContent() {
    return (<p>Are you Mozilla Staff? <button className="btn btn-link" onClick={this.handleSignInBtnClick}>Sign in</button>.</p>);
  },
  getloggedInStatusContent() {
    if (user.loggedin) {
      return this.getContentForLoggedInUser();
    }

    if (user.failedLogin) {
      return this.getFailurePrompt();
    }

    return this.getAnonymousContent();
  },
  render() {
    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // For more info see: https://github.com/mozilla/network-pulse/issues/326
    let headerText = `Save your Favs`;

    return (
      <div>
        <div className="logged-in-status">{ this.getloggedInStatusContent() }</div>
        { this.state.bookmarks && this.state.bookmarks.length > 0 ?
                            <ProjectList params={{ids: this.state.bookmarks.join(`,`)}} />
                            : <HintMessage imgSrc={`/assets/svg/icon-bookmark-selected.svg`}
                                           header={headerText}
                                           internalLink={`/featured`}
                                           linkText={`Explore featured`}>
                                <p>Tap the heart on any project to save it here.</p>
                              </HintMessage>
        }
      </div>
    );
  }
});
