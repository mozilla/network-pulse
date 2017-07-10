import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import Select from 'react-select';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { getBookmarks, saveBookmarks } from '../../js/bookmarks-manager';
import Service from '../../js/service.js';
import Utility from '../../js/utility.js';

class ModerationPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      moderationState: this.props.moderationState
    };
  }

  getModerationStates(input, callback) {
    Service.moderationStates
      .get()
      .then((data) => {
        let options = data.map((option) => {
          return { value: option.id, label: option.name };
        });

        callback(null, {options});
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  getNonce(callback) {
    Service.nonce()
      .then((nonce) => {
        callback(false, nonce);
      })
      .catch((reason) => {
        callback(new Error(`Could not retrieve data from /nonce. Reason: ${reason}`));
      });
  }

  handleModerationStateChange(selected) {
    this.getNonce((error, nonce) => {
      if (error) {
        console.error(error);
        return;
      }

      let formattedNonce = {
        nonce: nonce.nonce,
        csrfmiddlewaretoken: nonce.csrf_token
      };

      Service.entry
        .put.moderationState(this.props.id, selected.value, formattedNonce)
        .then(() => {
          this.setState({ moderationState: selected });
        })
        .catch(reason => {
          this.setState({
            serverError: true
          });
          console.error(reason);
        });
    });
  }

  render() {
    return  <div className="moderation-panel p-3">
              <Select.Async
                name="form-field-name"
                value={this.state.moderationState}
                className="d-block text-left"
                searchable={false}
                loadOptions={(input, callback) => this.getModerationStates(input, callback)}
                onChange={(selected) => this.handleModerationStateChange(selected)}
                clearable={false}
              />
            </div>;
  }
}

ModerationPanel.defaultProps = {
  id: ``,
  moderationState: ``
};


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

    return props.onDetailView || props.onModerationMode ?
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

  renderDescription() {
    return this.props.description.split(`\n`).map((paragraph, i) => <p key={i}>{paragraph}</p>);
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
                {this.renderTimePosted()}
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
  moderationState: `` // id of the moderation
};

export default ProjectCard;
