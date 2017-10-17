import React from 'react';
import { Link } from 'react-router';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import Creators from './meta/creators.jsx';
import Thumbnail from './meta/thumbnail.jsx';
import Title from './meta/title.jsx';
import Description from './meta/description.jsx';
import WhyInteresting from './meta/why-interesting.jsx';
import IssuesAndTags from './meta/issues-and-tags.jsx';
import GetInvolved from './meta/get-involved.jsx';
import BookmarkControl from '../bookmark-control.jsx';
import bookmarkManager from '../../js/bookmarks-manager';
import user from '../../js/app-user.js';

class DetailedProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false
    };
  }

  sendGaEvent(action = ``, transport = ``) {
    let config = {
      category: `Entry`,
      action: action,
      label: this.props.title
    };

    if (transport) {
      config.transport = transport;
    }

    ReactGA.event(config);
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

    if (bookmarks) {
      let bookmarked = bookmarks.indexOf(this.props.id) > -1;
      this.setState({ bookmarked });
    }
  }

  updateCardBookmarkedState(isBookmarked) {
    this.setState({ bookmarked: isBookmarked });
  }

  handleTwitterShareClick() {
    this.sendGaEvent(`Twitter share tap`, `beacon`);
  }

  handleVisitBtnClick() {
    this.sendGaEvent(`Visit button tap`, `beacon`);
  }

  renderVisitButton() {
    if (!this.props.contentUrl) return null;

    return <a href={this.props.contentUrl} target="_blank" className="btn btn-block btn-info btn-visit text-capitalize mt-3" onClick={() => this.handleVisitBtnClick()}>Visit</a>;
  }

  renderTimePosted() {
    if (!this.props.created && !this.props.publishedBy) return null;

    let timePosted = this.props.created ? ` ${moment(this.props.created).format(`MMM DD, YYYY`)}` : null;
    let publishedBy = this.props.publishedBy ? <span> by <Link to={`/profile/${this.props.submitterProfileId}`}>{this.props.publishedBy}</Link></span> : null;

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

  renderTopHeader() {
    return <div className="col-12 mb-3">
            <div className="row">
              <div className="col-12 col-sm-8">
                <Title title={this.props.title} className="mb-1" />
                <Creators creators={this.props.creatorsWithProfiles} showLabelText={true} />
              </div>
            </div>
          </div>;
  }

  renderLeftColumn() {
    let wrapperClassnames = classNames(`col-12 col-md-8`);

    return <div className={wrapperClassnames}>
              <Thumbnail thumbnail={this.props.thumbnail} />
              { this.renderVisitButton() }
              <Description description={this.props.description} className="mt-3" />
              <WhyInteresting interest={this.props.interest} />
              { this.renderTimePosted() }
              <IssuesAndTags issues={this.props.issues} tags={this.props.tags} />
            </div>;
  }

  renderRightColumn() {
    let wrapperClassnames = classNames(`col-12 col-md-4 mt-3 mt-md-0`);

    return <div className={wrapperClassnames}>
              { this.renderActionPanel() }
              <GetInvolved getInvolved={this.props.getInvolved}
                           getInvolvedUrl={this.props.getInvolvedUrl}
                           helpTypes={this.props.helpTypes}
                           sendGaEvent={(action, transport) => this.sendGaEvent(action, transport)} />
            </div>;
  }

  render() {
    let wrapperClassnames = classNames(`col-12 pt-3 project-card detail-view`, {
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
        <div className="row">
          <div className="col-12 col-md-8">
            <p className="report-correction mt-3 pt-3"><small>Correction? <a href="https://mzl.la/pulse-contact">Contact us</a>.</small></p>
          </div>
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
