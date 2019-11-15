import React from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import Creators from "./meta/creators.jsx";
import Thumbnail from "./meta/thumbnail.jsx";
import Title from "./meta/title.jsx";
import Description from "./meta/description.jsx";
import WhyInteresting from "./meta/why-interesting.jsx";
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

  // Sets height for social icons grid cell to match the height of entry content
  setSocialPanelHeight() {
    let article = this.article; //entry content
    let socialIcons = this.socialIcons; //social icons

    // We want to set the social icons height at large+ devices
    let breakpoint = window.matchMedia("(min-width: 992px)");

    function renderHeight(breakpoint) {
      // If screen size is at large+ breakpoint
      if (breakpoint.matches) {
        // Set the height of the social icons grid cell to the height of loaded entry
        socialIcons.style.height = `${article.offsetHeight}px`;

        // Since social icons is in a CSS Grid cell, the cell is now the height of the entry &
        // the entry has been pushed below the grid; so, we want to offset the social icons height with
        // a negative margin-top on the entry (article) to bring the content back up.
        article.style.marginTop = `calc(0px - (${
          article.offsetHeight
        }px + 80px))`;
      } else {
        // If not at large+ breakpoint we want these values to be 'auto'
        socialIcons.style.height = `auto`;
        article.style.marginTop = `auto`;
      }
    }

    renderHeight(breakpoint); // Calls our function at run time
    breakpoint.addListener(renderHeight); // Runs our callback function in response to any media query status changes
  }

  renderVisitButton() {
    if (!this.props.contentUrl) return null;

    let classes = classNames(
      "btn btn-primary mb-3 mb-md-0 mr-md-3 d-flex justify-content-center align-items-center",
      {
        "single-btn": !this.props.getInvolvedUrl
      }
    );

    return (
      <a
        href={this.props.contentUrl}
        target="_blank"
        className={classes}
        onClick={() => this.handleVisitBtnClick()}
      >
        Visit
      </a>
    );
  }

  renderGetInvolvedButton() {
    if (!this.props.getInvolvedUrl) return null;

    return (
      <a
        href={this.props.getInvolvedUrl}
        target="_blank"
        className="btn btn-secondary d-flex justify-content-center"
      >
        Get Involved
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
      <aside
        className="social-panel-wrapper mb-4 pl-md-3 pb-xl-4"
        ref={socialIcons => {
          this.socialIcons = socialIcons;
        }}
      >
        <div className="social-panel">
          <BookmarkControl
            id={this.props.id}
            className="circle-heart large mr-3 mr-lg-0 mb-lg-2"
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
          />
        </div>
      </aside>
    );
  }

  renderTitleAuthor() {
    return (
      <div className="title-author-wrapper mb-4 mb-md-5 mb-lg-0">
        <div className="title-author">
          <header className="mb-md-4">
            <Title title={this.props.title} />
            <Creators
              creators={this.props.relatedCreators}
              showLabelText={true}
              creatorClickHandler={(event, name) =>
                this.handleCreatorClick(event, name)
              }
              className="mb-4"
            />
          </header>
          <div className="action-panel d-flex flex-column flex-md-row">
            {this.renderVisitButton()}
            {this.renderGetInvolvedButton()}
          </div>
        </div>
      </div>
    );
  }

  renderThumbnail() {
    return (
      <div className="thumbnail-wrapper mb-4 mb-md-0">
        <div className="thumbnail-container">
          <Thumbnail thumbnail={this.props.thumbnail} />
        </div>
      </div>
    );
  }

  renderMainContent() {
    let getInvolved = classNames("get-involved w-100 mb-5", {
      "d-none":
        !this.props.getInvolved &&
        !this.props.getInvolvedUrl &&
        !this.props.helpTypes.length > 0
    });

    return (
      <article
        className="main-content"
        ref={article => {
          this.article = article;
        }}
      >
        <section className="summary-info mb-5">
          <div className="container">
            <div className="offset-lg-2">
              <Description description={this.props.description} />
              <WhyInteresting interest={this.props.interest} />
            </div>
          </div>
        </section>
        <section className={getInvolved}>
          <div className="container">
            <div className="offset-lg-2 py-5">
              <GetInvolved
                getInvolved={this.props.getInvolved}
                getInvolvedUrl={this.props.getInvolvedUrl}
                helpTypes={this.props.helpTypes}
                sendGaEvent={config => this.sendGaEvent(config)}
              />
            </div>
          </div>
        </section>
        <section className="issues-and-tags-container mb-4 mb-md-5">
          <div className="container">
            <div className="offset-lg-2">
              <IssuesAndTags
                issues={this.props.issues}
                tags={this.props.tags}
                className="mb-4 mb-md-5"
              />
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <div className="offset-lg-2">
              {this.renderTimePosted()}
              <p className="report-correction">
                Correction?{" "}
                <a href="https://mzl.la/pulse-contact">Contact us</a>.
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
