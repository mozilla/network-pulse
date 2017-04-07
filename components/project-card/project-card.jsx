import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import classNames from 'classnames';
import moment from 'moment';
import { getBookmarks, saveBookmarks } from '../../js/bookmarks-manager';

const Details = React.createClass({
  propTypes: {
    createGaEventConfig: React.PropTypes.func.isRequired
  },
  handleVisitBtnClick() {
    ReactGA.event(this.props.createGaEventConfig(`Visit button`, `Clicked`, `beacon`));
  },
  handleGetInvolvedLinkClick() {
    ReactGA.event(this.props.createGaEventConfig(`Get involved`, `Clicked`, `beacon`));
  },
  render() {
    let props = this.props;
    let getInvolvedText = props.getInvolved ? props.getInvolved : null;
    let getInvolvedLink = props.getInvolvedUrl ? ( <a href={props.getInvolvedUrl} target="_blank" onClick={this.handleGetInvolvedLinkClick}>Get Involved</a>) : null;

    return props.onDetailView ?
            (<div>
              { props.interest ? <p className="interest">{props.interest}</p> : null }
              { getInvolvedText || getInvolvedLink ? <p className="get-involved">{getInvolvedText} {getInvolvedLink}</p> : null }
              { props.contentUrl ? <a href={props.contentUrl} target="_blank" className="btn btn-block btn-outline-info btn-view" onClick={this.handleVisitBtnClick}>Visit</a> : null }
            </div>) : null;
  }
});

export default React.createClass({
  getInitialState() {
    return {
      bookmarked: false
    };
  },
  getDefaultProps() {
    return {
      onDetailView: false
    };
  },
  propTypes: {
    id: React.PropTypes.number.isRequired,
    creators: React.PropTypes.array,
    description: React.PropTypes.string.isRequired,
    featured: React.PropTypes.bool,
    getInvolved: React.PropTypes.string,
    getInvolvedUrl: React.PropTypes.string,
    interest: React.PropTypes.string,
    issues: React.PropTypes.arrayOf(React.PropTypes.string),
    thumbnail: React.PropTypes.string,
    created: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    contentUrl: React.PropTypes.string,
    onDetailView: React.PropTypes.bool
  },
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
  },
  componentDidMount() {
    if (this.urlToShare) {
      // TODO:FIXME: not sure if this is the best way to display URL of the current page
      this.urlToShare.value = window.location.href;
    }

    this.setInitialBookmarkedStatus();

  },
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
  },
  bookmarkProject(bookmarks) {
    ReactGA.event(this.createGaEventConfig(`Bookmark button`, `Bookmarked`));
    bookmarks.unshift(this.props.id);
    this.setState({bookmarked: true});
  },
  unbookmarkProject(bookmarks,index) {
    ReactGA.event(this.createGaEventConfig(`Bookmark button`, `Unbookmarked`));
    bookmarks.splice(index,1);
    this.setState({bookmarked: false});
  },
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
  },
  handleThumbnailClick() {
    ReactGA.event(this.createGaEventConfig(`Thumbnail`, `Clicked`));
  },
  handleTitleClick() {
    ReactGA.event(this.createGaEventConfig(`Title`, `Clicked`));
  },
  handleReadMoreClick() {
    ReactGA.event(this.createGaEventConfig(`Read more`, `Clicked`));
  },
  handleShareBtnClick() {
    ReactGA.event(this.createGaEventConfig(`Reveal entry share link`, `Clicked`));
    this.shareBtn.classList.add(`active`);
    this.urlToShare.focus();
    this.urlToShare.select();
  },
  renderTitle(detailViewLink) {
    let title = this.props.title;
    if (!this.props.onDetailView) {
      title = <Link to={detailViewLink} onClick={this.handleTitleClick}>{title}</Link>;
    }
    return <h2>{title}</h2>;
  },
  renderThumbnail(detailViewLink) {
    let thumbnailSource = this.props.thumbnail;

    if (!thumbnailSource) return null;

    return <Link to={detailViewLink} onClick={this.handleThumbnailClick} className="thumbnail">
              <div className="img-container">
                <img src={thumbnailSource} />
              </div>
            </Link>;
  },
  renderActionPanel(detailViewLink) {
    let actionPanel = this.props.onDetailView ?
                  (<div className="share">
                    <a className="btn" onClick={this.handleShareBtnClick} ref={(btn) => { this.shareBtn = btn; }}></a>
                    <input readOnly type="text" ref={(input) => { this.urlToShare = input; }} />
                  </div>)
                  : (<div>
                      <Link to={detailViewLink} onClick={this.handleReadMoreClick}>Read more</Link>
                    </div>);
    return <div className="action-panel">
            {actionPanel}
            <a className="heart" ref="heart" onClick={this.toggleBookmarkedState}></a>
          </div>;
  },
  renderCreatorInfo() {
    if (this.props.creators.length === 0) return null;

    return <small className="creator d-block text-muted">
             By {this.props.creators.join(`, `)}
          </small>;
  },
  renderTimePosted() {
    if (!this.props.created) return null;
    return <small className="time-posted d-block text-muted">
            Added {moment(this.props.created).format(`MMM DD, YYYY`)}
          </small>;
  },
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
          <div className="content">
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
        <div className="project-links">
          {this.renderActionPanel(detailViewLink)}
        </div>
      </div>
    );
  }
});
