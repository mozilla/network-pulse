import React from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import WhyInteresting from "./meta/why-interesting.jsx";
import Creators from "./meta/creators.jsx";
import Thumbnail from "./meta/thumbnail.jsx";
import Title from "./meta/title.jsx";
import Description from "./meta/description.jsx";
import IssuesAndTags from "./meta/issues-and-tags.jsx";
import GetInvolved from "./meta/get-involved.jsx";
import BookmarkControl from "../bookmark-control.jsx";
import bookmarkManager from "../../js/bookmarks-manager";
import user from "../../js/app-user.js";

class DetailedProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false
    };
  }

  sendGaEvent(config) {
    config = Object.assign(
      {
        category: `Entry`,
        action: ``,
        label: this.props.title
      },
      config
    );

    // config usually contains the following properties:
    // category, action, label, transport
    ReactGA.event(config);
  }

  componentDidMount() {
    this.setInitialBookmarkedStatus();
    this.setSocialPanelHeight();
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

  handleCreatorClick(event, creator) {
    this.sendGaEvent({
      action: `Creator tap`,
      label: `${this.props.title} - ${creator}`
    });
  }

  handlePublisherClick(event, publisher) {
    this.sendGaEvent({
      action: `Submitter tap`,
      label: `${this.props.title} - ${publisher}`
    });
  }

  handleTwitterShareClick() {
    this.sendGaEvent({
      action: `Twitter share tap`,
      transport: `beacon`
    });
  }

  handleVisitBtnClick() {
    this.sendGaEvent({
      action: `Visit button tap`,
      transport: `beacon`
    });
  }

  setSocialPanelHeight() {
    let article = document.querySelector('.main-content');
    let socialIcons = document.querySelector('.social-panel-wrapper');
    let breakpoint = window.matchMedia("(min-width: 992px)");

    function Test(breakpoint) {
      if (breakpoint.matches) {
        socialIcons.style.height = `calc(${article.offsetHeight}px)`;
        article.style.marginTop = `calc(0px - (${article.offsetHeight}px + 80px))`;
      } else {
        socialIcons.style.height = `auto`;
        article.style.marginTop = `auto`;
      }
    }

    Test(breakpoint);
    breakpoint.addListener(Test);
  }

  renderVisitButton() {
    if (!this.props.contentUrl) return null;

    return (
      <a
        href={this.props.contentUrl}
        target="_blank"
        className="btn btn-primary mb-3 mb-md-0 mr-md-3"
        onClick={() => this.handleVisitBtnClick()}
      >
        Visit
      </a>
    );
  }

  renderTimePosted() {
    if (!this.props.created && !this.props.publishedBy) return null;

    let timePosted = this.props.created
      ? ` ${moment(this.props.created).format(`MMM DD, YYYY`)}`
      : null;
    let publishedBy = this.props.publishedBy ? (
      <span>
        {" "}
        by{" "}
        <Link
          to={`/profile/${this.props.submitterProfileId}`}
          onClick={event =>
            this.handlePublisherClick(event, this.props.publishedBy)
          }
        >
          {this.props.publishedBy}
        </Link>
      </span>
    ) : null;

    return (
      <p className="time-posted mb-4">
        Added{timePosted}
        {publishedBy}
      </p>
    );
  }

  renderSocialPanel() {
    let twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      this.props.title
    )}&url=${encodeURIComponent(window.location.href)}`;

    return (
      <aside className="social-panel-wrapper mb-4 pl-md-3 pb-xl-4">
        <div className="social-panel">
          <BookmarkControl
            id={this.props.id}
            className="circle-heart large"
            title={this.props.title}
            isBookmarked={this.props.isBookmarked}
            updateCardBookmarkedState={bookmarked => {
              this.updateCardBookmarkedState(bookmarked);
            }}
          />
          <a
            href={twitterUrl}
            onClick={evt => this.handleTwitterShareClick(evt)}
            className="circle-twitter large"
            aria-label="Share on Twitter"
          />
        </div>
      </aside>
    );
  }

  renderTitleAuthor() {
    return (
      <div className="title-author-wrapper mb-4 mb-md-5 mb-lg-0">
        <div className="title-author p-lg-4">
          <header className="mb-md-4">
            <Title 
              title={this.props.title} 
              className="h1-heading mb-1 mb-md-3"
              role="banner"
              ariaLevel="1"
            />
            <Creators
            creators={this.props.relatedCreators}
            showLabelText={true}
            creatorClickHandler={(event, name) =>
              this.handleCreatorClick(event, name)
            }
            />
          </header>
          <div className="action-panel d-md-flex justify-content-lg-between">
            {this.renderVisitButton()}
            <a
              href={this.props.getInvolvedUrl}
              target="_blank"
              className="btn btn-secondary d-flex justify-content-center"
            >
              Get Involved
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderThumbnail() { 
    return (
      <div className="thumbnail-wrapper mb-4 mb-md-0">
        <div className="thumbnail-container">
          <Thumbnail 
            thumbnail={this.props.thumbnail} 
          />
        </div>
      </div>
    );
  }

  renderMainContent() {
    return (
      <article className="main-content">
        <section className="summary-info mb-5">
          <div className="container">
            <div className="offset-lg-2">
              <Description description={this.props.description} className="mt-3" />
              <WhyInteresting interest={this.props.interest} />
            </div>
          </div>
        </section>
        <GetInvolved
          getInvolved={this.props.getInvolved}
          getInvolvedUrl={this.props.getInvolvedUrl}
          helpTypes={this.props.helpTypes}
          sendGaEvent={config => this.sendGaEvent(config)}
        />
        <IssuesAndTags 
          issues={this.props.issues} 
          tags={this.props.tags}
          className="mb-4 mb-md-5"
        />
        <section>
          <div className="container">
            <div className="offset-lg-2">
              {this.renderTimePosted()}
              <p className="report-correction">
                Correction?{" "}<a href="https://mzl.la/pulse-contact">Contact us</a>.
              </p>
            </div>
          </div>
        </section>
      </article>
    );
  }

  render() {
    let wrapperClassnames = classNames(`project-card detail-view`, {
      bookmarked: this.state.bookmarked
    });

    return (
      <main className={wrapperClassnames}>
        <div className="thumbnail-title-social-wrapper mb-4 mb-md-5">
          <div className="thumbnail-title-social">
            {this.renderThumbnail()}
            {this.renderTitleAuthor()}
            {this.renderSocialPanel()}
          </div>
        </div>
        {this.renderMainContent()}
      </main>
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
