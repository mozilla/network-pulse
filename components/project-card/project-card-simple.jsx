import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModerationPanel from '../moderation-panel.jsx';
import Creators from './meta/creators.jsx';
import Thumbnail from './meta/thumbnail.jsx';
import Title from './meta/title.jsx';
import Description from './meta/description.jsx';
import GetInvolved from './meta/get-involved.jsx';
import WhyInteresting from './meta/why-interesting.jsx';
import IssuesAndTags from './meta/issues-and-tags.jsx';
import BookmarkControl from '../bookmark-control.jsx';
import bookmarkManager from '../../js/bookmarks-manager';
import user from '../../js/app-user.js';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false
    };
  }

  sendGaEvent(config) {
    config = Object.assign({
      category: `Entry`,
      action: ``,
      label: this.props.title
    }, config);

    // config usually contains the following properties:
    // category, action, label, transport
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

  handleCreatorClick(event, creator) {
    this.sendGaEvent({
      action: `Creator tap`,
      label: `${this.props.title} - ${creator}`
    });
  }

  handleReadMoreClick() {
    this.sendGaEvent({
      action: `Read More`,
    });
  }

  renderActionPanel() {
    if (this.props.onModerationMode) return null;

    return (
      <BookmarkControl id={this.props.id}
        title={this.props.title}
        isBookmarked={this.props.isBookmarked}
        updateCardBookmarkedState={(bookmarked) => { this.updateCardBookmarkedState(bookmarked); }}
        className="align-middle"
      />
    );
  }

  renderModerationPanel() {
    if (!this.props.onModerationMode) return null;

    return <ModerationPanel id={this.props.id} moderationState={this.props.moderationState} featured={this.props.featured} />;
  }

  renderExtraMeta() {
    if (!this.props.onModerationMode) return null;

    return <div>
      <WhyInteresting interest={this.props.interest} />
      <IssuesAndTags issues={this.props.issues} tags={this.props.tags} className={`pb-3 mb-3`} />
      <GetInvolved getInvolved={this.props.getInvolved}
        getInvolvedUrl={this.props.getInvolvedUrl}
        helpTypes={this.props.helpTypes}
        sendGaEvent={(config) => this.sendGaEvent(config)} />
    </div>;
  }

  renderFullUrlSection() {
    if (!this.props.onModerationMode) return null;

    let urls = [
      { label: `Link`, link: this.props.contentUrl },
      { label: `Help`, link: this.props.getInvolvedUrl }
    ].map(url => {
      return url.link && <li key={url.label}>{url.label}: <a href={url.link} target="_blank">{url.link}</a></li>;
    });

    return <ul className="list-unstyled">{urls}</ul>;
  }

  renderFeaturedFlag() {
    if (!this.props.featured) return null;

    return <div role="featured-content" className="featured-flag-container mt-3 p-1 text-align-right"><p className="body-small featured-flag mb-0 featured-glyph">Featured</p></div>;
  }

  render() {
    let wrapperClassnames = classNames(`col-md-6 col-lg-4`);

    let classnames = classNames(`project-card`, {
      "regular-list-mode": !this.props.onModerationMode,
      "moderation-mode": this.props.onModerationMode,
      "bookmarked": this.state.bookmarked
    });

    let detailViewLink = `/entry/${this.props.id}`;

    return (
      <div className={wrapperClassnames}>
        <div className={classnames}>
          { this.renderModerationPanel() }
          <div className="summary-content">
            { this.renderFeaturedFlag() }
            <Thumbnail thumbnail={this.props.thumbnail}
              link={!this.props.onModerationMode ? detailViewLink : ``}
              sendGaEvent={() => this.handleReadMoreClick()} />
            <div className="content mt-2">
              <div className="d-flex">
                <Title title={this.props.title}
                  link={!this.props.onModerationMode ? detailViewLink : ``}
                  sendGaEvent={() => this.handleReadMoreClick()}
                  className="pr-2"
                />
                { this.renderActionPanel() }
              </div>
              <Creators
                creators={this.props.relatedCreators}
                creatorClickHandler={(event, name) => this.handleCreatorClick(event, name)}
              />
              { this.props.onModerationMode && <Description description={this.props.description} /> }
              { this.renderExtraMeta() }
              { this.renderFullUrlSection() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProjectCard.propTypes = {
  id: PropTypes.number.isRequired,
  creators: PropTypes.array,
  description: PropTypes.string,
  thumbnail: PropTypes.string,
  title: PropTypes.string.isRequired,
  isBookmarked: PropTypes.bool
};

ProjectCard.defaultProps = {
  moderationState: undefined // id of the moderation state
};

export default ProjectCard;
