import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import ProjectLoader from '../components/project-loader/project-loader.jsx';
import HintMessage from '../components/hint-message/hint-message.jsx';
import Service from '../js/service.js';
import bookmarkManager from '../js/bookmarks-manager';
import user from '../js/app-user';
import pageSettings from '../js/app-page-settings';

class Bookmarks extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      user,
      lsBookmarkedIds: [], // localStorage bookmarked entry ids,
      bookmarksImported: false,
      displayBookmarkPrompt: false // false because we don't know if there's any bookmarked entry yet
    };
  }

  componentDidMount() {
    // get IDs of user's bookmarked entries
    this.setState({lsBookmarkedIds: bookmarkManager.bookmarks.get()}, () => {
      if (pageSettings.shouldRestore) {
        // restore state back to what is stored in pageSettings
        this.setState(pageSettings.currentList);
      }
    });

    user.addListener(this);
    user.verify(this.props.location, this.props.history);
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified` || event === `logged out`) {
      this.setState({ user });
    }
  }

  bulkBookmark(entryIds, onError) {
    Service.bookmarks
      .post(entryIds)
      .then(() => {
        onError(null);
      })
      .catch(reason => {
        onError(reason);
      });
  }

  handleImportBookmarksClick() {
    // import
    this.bulkBookmark(this.state.lsBookmarkedIds, (error) => {
      if (error) {
        console.error(error);
      } else {
        bookmarkManager.bookmarks.delete();
        this.setState({
          lsBookmarkedIds: [],
          bookmarksImported: true,
          displayBookmarkPrompt: false
        });
      }
    });
  }

  showBookmarkPrompt() {
    this.setState({ displayBookmarkPrompt: true });
  }

  getContentForLoggedInUser() {
    let projects = this.state.displayBookmarkPrompt ? this.renderBookmarkPrompt() : <ProjectLoader
      bookmarkedOnly={true}
      showBookmarkPrompt={() => this.showBookmarkPrompt()}
    />;
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
      { importHint }
      { projects }
    </div>;
  }

  getAnonymousContent() {
    let bookmarkedProjects = this.renderBookmarkPrompt();

    if (this.state.lsBookmarkedIds.length > 0) {
      bookmarkedProjects = <ProjectLoader ids={this.state.lsBookmarkedIds} />;
    }

    return bookmarkedProjects;
  }

  renderContent() {
    if (user.loggedin === undefined) return null;

    if (user.loggedin) return this.getContentForLoggedInUser();

    return this.getAnonymousContent();
  }

  renderBookmarkPrompt() {
    return <HintMessage iconComponent={<img src="/assets/svg/icon-bookmark-selected.svg" />}
                       header="Save your Favs"
                       linkComponent={<Link to={`/featured`}>Explore featured</Link>}>
            <p>Tap the heart on any project to save it here.</p>
          </HintMessage>;
  }

  render() {
    return (
      <div>
        <Helmet><title>Favs</title></Helmet>
        { this.renderContent() }
      </div>
    );
  }
}

Bookmarks.propTypes = {
  location: PropTypes.object
};

export default Bookmarks;
