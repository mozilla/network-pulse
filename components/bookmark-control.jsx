import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import bookmarkManager from '../js/bookmarks-manager';
import Service from '../js/service.js';
import user from '../js/app-user.js';
import classNames from 'classnames';

class BookmarkControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false
    };
  }

  createGaEventConfig(action = ``, transport = ``) {
    let config = {
      category: `Entry`,
      action: action,
      label: this.props.title
    };

    if (transport) {
      config.transport = transport;
    }

    return config;
  }

  componentDidMount() {
    this.setInitialBookmarkedStatus();
  }

  setInitialBookmarkedStatus() {
    if (user.loggedin) {
      this.setState({
        bookmarked: this.props.isBookmarked
      });

      return;
    }

    let bookmarks = bookmarkManager.bookmarks.get();
    let bookmarked;

    if (bookmarks) {
      bookmarked = bookmarks.indexOf(this.props.id) > -1;
      this.setState({bookmarked: bookmarked});
    }
  }

  bookmarkToLocalStorage(bookmarks) {
    bookmarks.unshift(this.props.id);
    this.setState({ bookmarked: true }, () => {
      this.props.updateCardBookmarkedState(this.state.bookmarked);
    });
  }

  unbookmarkToLocalStorage(bookmarks) {
    bookmarks.splice(bookmarks.indexOf(this.props.id), 1);
    this.setState({ bookmarked: false }, () => {
      this.props.updateCardBookmarkedState(this.state.bookmarked);
    });
  }

  updateBookmarkOnLocalStorage() {
    let bookmarks = bookmarkManager.bookmarks.get();

    if (bookmarks) {
      if (this.state.bookmarked) {
        this.unbookmarkToLocalStorage(bookmarks);
      } else {
        this.bookmarkToLocalStorage(bookmarks);
      }
      bookmarkManager.bookmarks.set(bookmarks);
    }
  }

  toggleBookmark(callback) {
    const toggleUI = () => {
      this.setState({ bookmarked: !this.state.bookmarked }, () => {
        this.props.updateCardBookmarkedState(this.state.bookmarked);
      });
    };

    toggleUI(); // Immediately update UI (assume success)

    Service.entry
      .put.bookmark(this.props.id)
      .then(() => {
        if (callback) {
          callback(null);
        }
      })
      .catch(reason => {
        console.error(reason);
        toggleUI(); // Toggle UI back since changes weren't persisted to server
        if (callback) {
          callback(reason);
        }
      });
  }

  handleBookmarkClick() {
    if (document && document.onanimationend !== `undefined`) {
      this.refs.heart.classList.add(`beating`);
      this.refs.heart.addEventListener(`animationend`, () => {
        this.refs.heart.classList.remove(`beating`);
      });
    }

    ReactGA.event(this.createGaEventConfig(this.state.bookmarked ? `Remove fav` : `Add fav`));

    if (user.loggedin) {
      this.toggleBookmark();
    }

    this.updateBookmarkOnLocalStorage();
  }

  render() {
    let classnames = classNames(`heart`, this.props.className);

    return (
      <a className={classnames} ref="heart" onClick={() => this.handleBookmarkClick()}></a>
    );
  }
}

BookmarkControl.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  updateCardBookmarkedState: PropTypes.func.isRequired
};

export default BookmarkControl;
