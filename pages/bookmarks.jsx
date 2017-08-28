import React from 'react';
import { Link } from 'react-router';
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import ProjectLoader from '../components/project-loader/project-loader.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';
import Service from '../js/service.js';
import bookmarkManager from '../js/bookmarks-manager';
import utility from '../js/utility';
import user from '../js/app-user';
import pageSettings from '../js/app-page-settings';

export default React.createClass({
  getInitialState() {
    return {
      user,
      lsBookmarkedIds: [], // localStorage bookmarked entry ids,
      bookmarksImported: false
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
    this.setState({lsBookmarkedIds: bookmarkManager.bookmarks.get()}, () => {
      if (pageSettings.shouldRestore) {
        // restore state back to what is stored in pageSettings
        this.setState(pageSettings.currentList);
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
  bulkBookmark(entryIds, onError) {
    Service.bookmarks
      .post(entryIds)
      .then(() => {
        onError(null);
      })
      .catch(reason => {
        onError(reason);
      });
  },
  handleImportBookmarksClick() {
    // import
    this.bulkBookmark(this.state.lsBookmarkedIds, (error) => {
      if (error) {
        console.error(error);
      } else {
        bookmarkManager.bookmarks.delete();
        this.setState({
          lsBookmarkedIds: [],
          bookmarksImported: true
        });
      }
    });
  },
  getContentForLoggedInUser() {
    let importHint;

    if (this.state.lsBookmarkedIds.length > 0) {
      importHint = <span>Did you add favs while logged out? You can <button className="btn btn-link inline-link" onClick={evt=>this.handleImportBookmarksClick(evt)}>import favs</button> from this browser.</span>;
    }

    if (this.state.bookmarksImported) {
      importHint = <span>Your favs have been imported.</span>;
    }

    if (importHint) {
      importHint = <p><small className="text-muted">{importHint}</small></p>;
    }

    return <div>
            <p className={classNames({'mb-0': !!importHint})}>Hi {user.username}! <button onClick={this.handleLogOutBtnClick} className="btn btn-link inline-link">Log out</button>.</p>
            {importHint}
            <ProjectLoader bookmarkedOnly={true} />
          </div>;
  },
  getAnonymousContent() {
    let signInPrompt = <p><button className="btn btn-link inline-link" onClick={(event) => this.handleSignInBtnClick(event)}>Sign in with Google</button>.</p>;
    let bookmarkedProjects = this.renderHintMessage();

    if (user.failedLogin) {
      signInPrompt = <p>Sorry, login failed! Please try again or <a href="mailto:https://mzl.la/pulse-contact">contact us</a>.</p>;
    }

    if (this.state.lsBookmarkedIds.length > 0) {
      bookmarkedProjects = <ProjectLoader ids={this.state.lsBookmarkedIds} />;
    }

    return <div>
            {signInPrompt}
            {bookmarkedProjects}
          </div>;
  },
  renderContent() {
    if (user.loggedin === undefined) return null;

    if (user.loggedin) return this.getContentForLoggedInUser();

    return this.getAnonymousContent();
  },
  renderHintMessage() {
    return <HintMessage iconComponent={<img src="/assets/svg/icon-bookmark-selected.svg" />}
                       header="Save your Favs"
                       linkComponent={<Link to={`/featured`}>Explore featured</Link>}>
            <p>Tap the heart on any project to save it here.</p>
          </HintMessage>;
  },
  render() {
    return (
      <div>
        <Helmet><title>Favs</title></Helmet>
        { this.renderContent() }
      </div>
    );
  }
});
