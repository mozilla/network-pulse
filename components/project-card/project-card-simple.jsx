import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModerationPanel from '../moderation-panel.jsx';
import bookmarkManager from '../../js/bookmarks-manager';
import Utility from '../../js/utility.js';
import Service from '../../js/service.js';
import user from '../../js/app-user.js';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false
    };
  }

  createGaEventConfig(category = ``, action = ``, transport = ``) {
    let config = {
      category: `Entry Card - ${category}`,
      action: action,
      label: `${this.props.id} - ${this.props.title}`
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
    this.setState({bookmarked: true});
  }

  unbookmarkToLocalStorage(bookmarks) {
    bookmarks.splice(bookmarks.indexOf(this.props.id), 1);
    this.setState({bookmarked: false});
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
    Service.entry
      .put.bookmark(this.props.id)
      .then(() => {
        callback(null);
      })
      .catch(reason => {
        console.error(reason);
        callback(reason);
      });
  }

  handleBookmarkClick() {
    if (document && document.onanimationend !== `undefined`) {
      this.refs.heart.classList.add(`beating`);
      this.refs.heart.addEventListener(`animationend`, () => {
        this.refs.heart.classList.remove(`beating`);
      });
    }

    ReactGA.event(this.createGaEventConfig(`Bookmark button`, this.state.bookmarked ? `Unbookmarked` : `Bookmarked`));

    if (user.loggedin) {
      this.toggleBookmark((error) => {
        if (error) return;

        this.setState({
          bookmarked: !this.state.bookmarked
        });
      });

      return;
    }

    this.updateBookmarkOnLocalStorage();
  }

  handleThumbnailClick() {
    ReactGA.event(this.createGaEventConfig(`Thumbnail`, `Clicked`));
  }

  handleTitleClick() {
    ReactGA.event(this.createGaEventConfig(`Title`, `Clicked`));
  }

  handleReadMoreClick() {
    ReactGA.event(this.createGaEventConfig(`Read more`, `Clicked`));
  }

  handleTwitterShareClick() {
    ReactGA.event(this.createGaEventConfig(`Twitter Share button`, `Clicked`, `beacon`));
  }

  renderTitle(detailViewLink) {
    return <h2><Link to={detailViewLink} onClick={this.handleTitleClick}>{this.props.title}</Link></h2>;
  }

  renderThumbnail(detailViewLink) {
    if (!this.props.thumbnail) return null;

    return (
      <Link to={detailViewLink} onClick={this.handleThumbnailClick} className="thumbnail">
        <div className="img-container"><img src={this.props.thumbnail} /></div>
      </Link>
    );
  }

  renderActionPanel(detailViewLink) {
    return (
      <div className="action-panel">
        <div>
          <Link to={detailViewLink} onClick={evt => this.handleReadMoreClick(evt) }>Read more</Link>
        </div>
        <a className="heart" ref="heart" onClick={() => this.handleBookmarkClick()}></a>
      </div>
    );
  }

  renderCreatorInfo() {
    if (this.props.creators.length === 0) return null;

    return (
      <small className="creator d-block text-muted">{this.props.creators.join(`, `)}</small>
    );
  }

  renderDescription() {
    return this.props.description.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });
  }

  renderModerationPanel() {
    if (!this.props.onModerationMode) return null;

    return <ModerationPanel id={this.props.id} moderationState={this.props.moderationState} />;
  }

  render() {
    console.log(this.props.moderationState);
    let wrapperClassnames = classNames({
      "col-md-6": true,
      "col-lg-4": true
    });

    let classnames = classNames({
      "project-card": true,
      "moderation-mode": this.props.onModerationMode,
      "bookmarked": this.state.bookmarked
    });

    let detailViewLink = `/entry/${this.props.id}`;

    return (
      <div className={wrapperClassnames}>
        <div className={classnames}>
          { this.renderModerationPanel() }
          <div className="summary-content">
            {this.renderThumbnail(detailViewLink)}
            <div className="content m-3">
              {this.renderTitle(detailViewLink)}
              <div className="mb-2">
                {this.renderCreatorInfo()}
              </div>
              <div className="description">{this.renderDescription()}</div>
            </div>
            <div className="fade-overlay"></div>
          </div>
          <div className="m-3">
            {this.renderActionPanel(detailViewLink)}
          </div>
        </div>
      </div>
    );
  }
}

ProjectCard.propTypes = {
  id: PropTypes.number.isRequired,
  creators: PropTypes.array,
  description: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  title: PropTypes.string.isRequired
};

ProjectCard.defaultProps = {
  moderationState: undefined // id of the moderation state
};

export default ProjectCard;
