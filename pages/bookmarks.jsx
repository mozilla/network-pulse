import React from 'react';
import { Link } from 'react-router';
import { Helmet } from "react-helmet";
import ProjectLoader from '../components/project-loader/project-loader.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';
import { getBookmarks } from '../js/bookmarks-manager';
import utility from '../js/utility';
import user from '../js/app-user';
import pageSettings from '../js/app-page-settings';

export default React.createClass({
  getInitialState() {
    return {
      user,
      bookmarkedIds: []
    };
  },
  handleSignInBtnClick(event) {
    event.preventDefault();

    user.login(utility.getCurrentURL());
  },
  handleLogOutBtnClick(event) {
    event.preventDefault();
    user.logout();
  },
  componentDidMount() {
    // get IDs of user's bookmarked entries
    this.setState({bookmarkedIds: getBookmarks()}, () => {
      if (pageSettings.shouldRestore) {
        // restore state back to what is stored in pageSettings
        this.setState(pageSettings.currentList);
      } else {
        this.fetchData();
      }
    });

    user.addListener(this);
    user.verify(this.props.router.location);
  },
  componentWillUnmount() {
    user.removeListener(this);
  },
  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified` || event === `logged out`) {
      this.setState({ user });
    }
  },
  getContentForLoggedInUser() {
    return(<p>Hi {user.username}! <button onClick={this.handleLogOutBtnClick} className="btn btn-link inline-link">Log out</button>.</p>);
  },
  getFailurePrompt() {
    return (<p>Only Mozilla staff can login now as we test this new platform. Meanwhile, your favorited projects can still be remembered on this device.</p>);
  },
  getAnonymousContent() {
    return (<p>Are you Mozilla Staff? <button className="btn btn-link inline-link" onClick={this.handleSignInBtnClick}>Sign in</button>.</p>);
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
  getBookmarkedProjects() {
    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // For more info see: https://github.com/mozilla/network-pulse/issues/326
    let headerText = `Save your Favs`;
    let bookmarkedProjects = (<HintMessage iconComponent={<img src="/assets/svg/icon-bookmark-selected.svg" />}
                                           header={headerText}
                                           linkComponent={<Link to={`/featured`}>Explore featured</Link>}>
                                <p>Tap the heart on any project to save it here.</p>
                              </HintMessage>);

    if (this.state.bookmarkedIds.length > 0) {
      bookmarkedProjects = <ProjectLoader ids={this.state.bookmarkedIds} />;
    }

    return bookmarkedProjects;
  },
  render() {
    return (
      <div>
        <Helmet><title>Favs</title></Helmet>
        <div className="logged-in-status">{ this.getloggedInStatusContent() }</div>
        { this.getBookmarkedProjects() }
      </div>
    );
  }
});
