import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { getBookmarks, saveBookmarks } from '../../js/bookmarks-manager';
import Utility from '../../js/utility.js';

class Details extends React.Component {
  handleVisitBtnClick() {
    ReactGA.event(this.props.createGaEventConfig(`Visit button`, `Clicked`, `beacon`));
  }

  handleGetInvolvedLinkClick() {
    ReactGA.event(this.props.createGaEventConfig(`Get involved`, `Clicked`, `beacon`));
  }

  render() {
    let props = this.props;
    let getInvolvedText = props.getInvolved ? props.getInvolved : null;
    let getInvolvedLink = props.getInvolvedUrl ? ( <a href={props.getInvolvedUrl} target="_blank" onClick={this.handleGetInvolvedLinkClick}>Get Involved</a>) : null;

    return props.onDetailView ?
            (<div>
              { props.interest ? <p className="interest">{props.interest}</p> : null }
              { getInvolvedText || getInvolvedLink ? <p className="get-involved">{getInvolvedText} {getInvolvedLink}</p> : null }
              { props.contentUrl ? <a href={props.contentUrl} target="_blank" className="btn btn-block btn-outline-info mb-3" onClick={this.handleVisitBtnClick}>Visit</a> : null }
            </div>) : null;
  }
}
Details.propTypes = {
  createGaEventConfig: PropTypes.func.isRequired
};

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
    let bookmarks = getBookmarks();
    let bookmarked;
    let index;

    if (bookmarks) {
      index = bookmarks.indexOf(this.props.id);
      if (index > -1) {
        bookmarked = true;
      } else {
        bookmarked = false;
      }
      this.setState({bookmarked: bookmarked});
    }
  }

  bookmarkProject(bookmarks) {
    ReactGA.event(this.createGaEventConfig(`Bookmark button`, `Bookmarked`));
    bookmarks.unshift(this.props.id);
    this.setState({bookmarked: true});
  }

  unbookmarkProject(bookmarks,index) {
    ReactGA.event(this.createGaEventConfig(`Bookmark button`, `Unbookmarked`));
    bookmarks.splice(index,1);
    this.setState({bookmarked: false});
  }

  toggleBookmarkedState() {
    if (document && document.onanimationend !== `undefined`) {
      this.refs.heart.classList.add(`beating`);
      this.refs.heart.addEventListener(`animationend`, () => {
        this.refs.heart.classList.remove(`beating`);
      });
    }

    let bookmarks = getBookmarks();
    let index;

    if (bookmarks) {
      index = bookmarks.indexOf(this.props.id);
      if (index > -1) {
        this.unbookmarkProject(bookmarks,index);
      } else {
        this.bookmarkProject(bookmarks);
      }
      saveBookmarks(bookmarks);
    }
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

  handleShareBtnClick() {
    ReactGA.event(this.createGaEventConfig(`Reveal entry share link`, `Clicked`));
    this.shareBtn.classList.add(`active`);
    this.urlToShare.focus();
    this.urlToShare.select();
  }

  renderTitle(detailViewLink) {
    let title = this.props.title;

    if (!this.props.onDetailView) {
      title = <Link to={detailViewLink} onClick={this.handleTitleClick}>{title}</Link>;
    }

    return <h2>{title}</h2>;
  }

  renderThumbnail(detailViewLink) {
    let thumbnailSource = this.props.thumbnail;

    if (!thumbnailSource) return null;

    return (
      <Link to={detailViewLink} onClick={this.handleThumbnailClick} className="thumbnail">
        <div className="img-container">
          <img src={thumbnailSource} />
        </div>
      </Link>
    );
  }

  renderActionPanel(detailViewLink) {
    let actionPanel = null;

    if (this.props.onDetailView) {
      actionPanel = (
        <div className="share">
          <a className="btn" onClick={evt => this.handleShareBtnClick(evt)} ref={(btn) => { this.shareBtn = btn; }}></a>
          <input readOnly type="text" ref={(input) => { this.urlToShare = input; }} />
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
        <a className="heart" ref="heart" onClick={() => this.toggleBookmarkedState()}></a>
      </div>
    );
  }

  renderCreatorInfo() {
    if (this.props.creators.length === 0) return null;

    return (
      <small className="creator d-block text-muted">
         By {this.props.creators.join(`, `)}
      </small>
    );
  }

  renderTimePosted() {
    if (!this.props.created) return null;

    return (
      <small className="time-posted d-block text-muted">
        Added {moment(this.props.created).format(`MMM DD, YYYY`)}
      </small>
    );
  }

  renderIssuesAndTags() {
    if (!this.props.onDetailView) return null;

    let issues = this.props.issues.map(issue => {
      return <Link to={`/issues/${Utility.getUriPathFromIssueName(issue)}`} className="btn btn-xs btn-tag" key={issue}>{issue}</Link>;
    });

    let tags = this.props.tags.map(tag => {
      return <Link to={`/tags/${encodeURIComponent(tag)}`} className="btn btn-xs btn-tag" key={tag}>{tag}</Link>;
    });

    return <div>{issues}{tags}</div>;
  }

  render() {
    let classnames = classNames({
      "project-card": true,
      "detail-view": this.props.onDetailView,
      "bookmarked": this.state.bookmarked
    });

    let detailViewLink = `/entry/${this.props.id}`;

    return (
      <div className={classnames}>
        <div className="main-content">
          {this.renderThumbnail(detailViewLink)}
          <div className="content m-3">
            {this.renderTitle(detailViewLink)}
            <div className="mb-2">
              {this.renderCreatorInfo()}
              {this.renderTimePosted()}
            </div>
            <p className="description">{this.props.description}</p>
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
  onDetailView: false
};

export default ProjectCard;
