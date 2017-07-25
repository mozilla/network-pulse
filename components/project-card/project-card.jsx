import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Details from '../details.jsx';
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
    if (this.urlToShare) {
      // TODO:FIXME: not sure if this is the best way to display URL of the current page
      this.urlToShare.value = window.location.href;
    }

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

  handleShareBtnClick() {
    if (this.shareBtn.classList.contains(`active`)) {
      ReactGA.event(this.createGaEventConfig(`Hide entry share link`, `Clicked`));
      this.shareBtn.classList.remove(`active`);
    } else {
      ReactGA.event(this.createGaEventConfig(`Reveal entry share link`, `Clicked`));
      this.shareBtn.classList.add(`active`);
      this.urlToShare.focus();
      this.urlToShare.select();
    }
  }

  renderTitle(detailViewLink) {
    let title = this.props.title;

    if (!this.props.onDetailView && !this.props.onModerationMode) {
      title = <Link to={detailViewLink} onClick={this.handleTitleClick}>{title}</Link>;
    }

    return <h2>{title}</h2>;
  }

  renderThumbnail(detailViewLink) {
    if (!this.props.thumbnail) return null;

    let classnames = `thumbnail`;
    let thumbnail = <div className="img-container"><img src={this.props.thumbnail} /></div>;

    if (this.props.onDetailView) {
      return <div className={classnames}>{thumbnail}</div>;
    }

    return (
      <Link to={detailViewLink} onClick={this.handleThumbnailClick} className={classnames}>
        {thumbnail}
      </Link>
    );
  }

  renderActionPanel(detailViewLink) {
    let actionPanel = null;

    if (this.props.onDetailView || this.props.onModerationMode) {
      let twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.props.title)}&url=${encodeURIComponent(window.location.href)}`;
      actionPanel = (
        <div className="d-flex share">
          <a href={twitterUrl} onClick={evt => this.handleTwitterShareClick(evt) } className="btn twitter-share d-inline-block align-self-center mr-3"></a>
          <div className="reveal-url">
            <a className="btn" onClick={evt => this.handleShareBtnClick(evt)} ref={(btn) => { this.shareBtn = btn; }}></a>
            <input readOnly type="text" ref={(input) => { this.urlToShare = input; }} className="form-control px-2" />
          </div>
        </div>
      );
    } else {
      actionPanel = (
        <div>
          <Link to={detailViewLink} onClick={evt => this.handleReadMoreClick(evt) }>Read more</Link>
        </div>
      );
    }

    return (
      <div className="action-panel">
        {actionPanel}
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

  renderIssuesAndTags() {
    if (!this.props.onDetailView && !this.props.onModerationMode) return null;

    let issues = this.props.issues.map(issue => {
      return <Link to={`/issues/${Utility.getUriPathFromIssueName(issue)}`} className="btn btn-xs btn-tag" key={issue}>{issue}</Link>;
    });

    let tags = this.props.tags.map(tag => {
      return <Link to={`/tags/${encodeURIComponent(tag)}`} className="btn btn-xs btn-tag" key={tag}>{tag}</Link>;
    });

    return <div>{issues}{tags}</div>;
  }

  renderModerationPanel() {
    if (!this.props.onModerationMode) return null;

    return <ModerationPanel id={this.props.id} moderationState={this.props.moderationState} />;
  }

  render() {
    let wrapperClassnames = classNames({
      "col-md-6": !this.props.onDetailView,
      "col-lg-4": !this.props.onDetailView,
      "col-md-8": this.props.onDetailView
    });

    let classnames = classNames({
      "project-card": true,
      "detail-view": this.props.onDetailView,
      "moderation-mode": this.props.onModerationMode,
      "bookmarked": this.state.bookmarked
    });

    let detailViewLink = `/entry/${this.props.id}`;

    return (
      <div className={wrapperClassnames}>
        <div className={classnames}>
          { this.renderModerationPanel() }
          <div className="main-content">
            {this.renderThumbnail(detailViewLink)}
            <div className="content m-3">
              {this.renderTitle(detailViewLink)}
              <div className="mb-2">
                {this.renderCreatorInfo()}
              </div>
              <div className="description">{this.renderDescription()}</div>
              <Details {...this.props} createGaEventConfig={this.createGaEventConfig} />
            </div>
            <div className="fade-overlay"></div>
          </div>
          <div className="project-links m-3">
            {this.renderActionPanel(detailViewLink)}
          </div>
          <div className="tags mr-3 mb-3 ml-3">
            {this.renderIssuesAndTags()}
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
  featured: PropTypes.bool,
  getInvolved: PropTypes.string,
  getInvolvedUrl: PropTypes.string,
  interest: PropTypes.string,
  issues: PropTypes.arrayOf(PropTypes.string),
  thumbnail: PropTypes.string,
  created: PropTypes.string,
  title: PropTypes.string.isRequired,
  contentUrl: PropTypes.string,
  onDetailView: PropTypes.bool
};

ProjectCard.defaultProps = {
  onDetailView: false,
  moderationState: undefined // id of the moderation
};

export default ProjectCard;
