import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import BookmarkControl from '../bookmark-control.jsx';
import bookmarkManager from '../../js/bookmarks-manager';
import Utility from '../../js/utility.js';
import user from '../../js/app-user.js';

class DetailedProjectCard extends React.Component {
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

  updateCardBookmarkedState(isBookmarked) {
    this.setState({ bookmarked: isBookmarked });
  }

  handleTwitterShareClick() {
    ReactGA.event(this.createGaEventConfig(`Twitter Share button`, `Clicked`, `beacon`));
  }

  handleVisitBtnClick() {
    ReactGA.event(this.props.createGaEventConfig(`Visit button`, `Clicked`, `beacon`));
  }

  renderTitle() {
    return <h2>{this.props.title}</h2>;
  }

  renderThumbnail() {
    if (!this.props.thumbnail) return null;

    return <div className="thumbnail">
              <div className="img-container"><img src={this.props.thumbnail} /></div>
           </div>;
  }

  renderCreatorInfo() {
    if (this.props.creators.length === 0) return null;

    return (
      <small className="creator d-block">Created by {this.props.creators.join(`, `)}</small>
    );
  }

  renderDescription() {
    let paragraphs = this.props.description.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    if (paragraphs.length < 1) return null;

    return <div className="description mt-3">{paragraphs}</div>;
  }

  renderIssuesAndTags() {
    let issues = this.props.issues.map(issue => {
      return <Link to={`/issues/${Utility.getUriPathFromIssueName(issue)}`} className="btn btn-xs btn-tag" key={issue}>{issue}</Link>;
    });

    let tags = this.props.tags.map(tag => {
      return <Link to={`/tags/${encodeURIComponent(tag)}`} className="btn btn-xs btn-tag" key={tag}>{tag}</Link>;
    });

    return <div>{issues}{tags}</div>;
  }

  renderVisitButton() {
    if (!this.props.contentUrl) return null;

    let classnames = classNames(`btn btn-block btn-info btn-visit text-capitalize`, {
      "mt-3": this.props.thumbnail
    });

    return <a href={this.props.contentUrl} target="_blank" className={classnames} onClick={() => this.handleVisitBtnClick()}>Visit</a>;
  }

  renderTimePosted() {
    if (!this.props.created && !this.props.publishedBy) return null;

    let timePosted = this.props.created ? ` ${moment(this.props.created).format(`MMM DD, YYYY`)}` : null;
    let publishedBy = this.props.publishedBy ? <span> by {this.props.publishedBy}</span> : null;

    return (
      <p><small className="time-posted d-block">
        Added{timePosted}{publishedBy}
      </small></p>
    );
  }

  renderActionPanel() {
    let twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.props.title)}&url=${encodeURIComponent(window.location.href)}`;

    return (
      <div className="action-panel pb-3 mb-3">
        <div className="d-flex share">
          <BookmarkControl id={this.props.id}
                           title={this.props.title}
                           isBookmarked={this.props.isBookmarked}
                           updateCardBookmarkedState={(bookmarked) => { this.updateCardBookmarkedState(bookmarked); }} />
          <a href={twitterUrl} onClick={evt => this.handleTwitterShareClick(evt) } className="btn twitter-share d-inline-block align-self-center mx-3"></a>
        </div>
      </div>
    );
  }

  renderHelpLabels() {
    if (!this.props.helpTypes) return null;

    return this.props.helpTypes.map(helpType => {
      return <Link to={`/help/${encodeURIComponent(helpType)}`} className="btn btn-xs btn-tag" key={helpType}>{helpType}</Link>;
    });
  }

  renderGetInvolved() {
    let props = this.props;
    let getInvolvedText = props.getInvolved ? props.getInvolved : null;
    let getInvolvedLink = props.getInvolvedUrl ? ( <a href={props.getInvolvedUrl} target="_blank" onClick={this.handleGetInvolvedLinkClick}>Get Involved</a>) : null;

    if (!getInvolvedText && !getInvolvedLink) return null;

    return <div className="get-involved pb-3 mb-3">
            <h2>Get involved</h2>
            <p>{getInvolvedText} {getInvolvedLink}</p>
            { this.renderHelpLabels() }
           </div>;
  }

  renderTopHeader() {
    return <div className="col-12 mb-3">
            <div className="row">
              <div className="col-12 col-sm-8">
                { this.renderTitle() }
                { this.renderCreatorInfo() }
              </div>
            </div>
          </div>;
  }

  renderLeftColumn() {
    let wrapperClassnames = classNames({
      "col-12": true,
      "col-md-8": true
    });

    return <div className={wrapperClassnames}>
              { this.renderThumbnail() }
              { this.renderVisitButton() }
              { this.renderDescription() }
              { this.props.interest && <p className="interest">{this.props.interest}</p> }
              { this.renderTimePosted() }
              <div className="tags">
                { this.renderIssuesAndTags() }
              </div>
            </div>;
  }

  renderRightColumn() {
    let wrapperClassnames = classNames({
      "col-12": true,
      "col-md-4": true
    });

    return <div className={wrapperClassnames}>
              <div>
                { this.renderActionPanel() }
                { this.renderGetInvolved() }
              </div>
            </div>;
  }

  render() {
    let wrapperClassnames = classNames({
      "col-12": true,
      "pt-3": true,
      "project-card": true,
      "detail-view": true,
      "bookmarked": this.state.bookmarked
    });

    return (
      <div className={wrapperClassnames}>
        <div className="row">
          { this.renderTopHeader() }
        </div>
        <div className="row">
          { this.renderLeftColumn() }
          { this.renderRightColumn() }
        </div>
      </div>
    );
  }
}

DetailedProjectCard.propTypes = {
  id: PropTypes.number.isRequired,
  creators: PropTypes.array,
  description: PropTypes.string.isRequired,
  featured: PropTypes.bool,
  getInvolved: PropTypes.string,
  getInvolvedUrl: PropTypes.string,
  interest: PropTypes.string,
  issues: PropTypes.arrayOf(PropTypes.string),
  thumbnail: PropTypes.string,
  title: PropTypes.string.isRequired,
  contentUrl: PropTypes.string,
  isBookmarked: PropTypes.bool,
  onDetailView: PropTypes.bool
};

DetailedProjectCard.defaultProps = {
  onDetailView: true
};

export default DetailedProjectCard;
