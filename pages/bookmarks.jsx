import React from 'react';
import { getBookmarks } from '../js/bookmarks-manager';
import Service from '../js/service.js';
import ProjectList from '../components/project-list/project-list.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';
import utility from '../js/utility';
import user from '../js/app-user';
import pageSettings from '../js/app-page-settings';
import env from "../config/env.generated.json";

const PROJECT_BATCH_SIZE = env.PROJECT_BATCH_SIZE;

export default React.createClass({
  getInitialState() {
    return {
      user,
      bookmarkedIds: [],
      loadingData: false,
      batchIndex: 0,
      entries: [],
      moreEntriesToFetch: false
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
        this.setState(Object.assign({},this.state,pageSettings.currentList));
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
  fetchData() {
    // find out entry ids in the batch we are going to fetch
    let ids = this.state.bookmarkedIds.slice(this.state.batchIndex*PROJECT_BATCH_SIZE, (this.state.batchIndex+1)*PROJECT_BATCH_SIZE);

    if ( ids.length === 0 ) {
      return;
    }

    // We are about to make a new request, set loadingData to true.
    this.setState({ loadingData: true });

    let params = {
      ids: ids.join(`,`),
      page: 1
    };

    Service.entries
      .get(params)
      .then((data) => {
        // sort entries by the time they were bookmarked, from most recently bookmarked
        let sorter = (a,b) => ids.indexOf(a.id) - ids.indexOf(b.id);
        let currentListInfo = {
          entries: this.state.entries.concat(data.results.sort(sorter)),
          batchIndex: this.state.batchIndex+1,
          moreEntriesToFetch: (this.state.batchIndex+1)*PROJECT_BATCH_SIZE < this.state.bookmarkedIds.length
        };

        // store current project list's info in pageSettings
        pageSettings.setCurrentList(currentListInfo);

        // update component's state
        currentListInfo.loadingData = false;
        this.setState(currentListInfo);
      })
      .catch((reason) => {
        console.error(reason);
      });
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
    let bookmarkedProjects = (<HintMessage imgSrc={`/assets/svg/icon-bookmark-selected.svg`}
                                           header={headerText}
                                           internalLink={`/featured`}
                                           linkText={`Explore featured`}>
                                <p>Tap the heart on any project to save it here.</p>
                              </HintMessage>);

    if (this.state.bookmarkedIds.length > 0) {
      bookmarkedProjects = <ProjectList entries={this.state.entries}
                                        loadingData={this.state.loadingData}
                                        moreEntriesToFetch={this.state.moreEntriesToFetch}
                                        fetchData={this.fetchData} />;
    }

    return bookmarkedProjects;
  },
  render() {
    return (
      <div>
        <div className="logged-in-status">{ this.getloggedInStatusContent() }</div>
        { this.getBookmarkedProjects() }
      </div>
    );
  }
});
