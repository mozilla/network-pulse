import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
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

  handleReadMoreClick() {
    this.sendGaEvent(`Read More`);
  }

  renderActionPanel(detailViewLink) {
    if (this.props.onModerationMode) return null;

    return (
      <div className="action-panel">
        <div>
          <Link to={detailViewLink} onClick={() => this.handleReadMoreClick() }>Read more</Link>
        </div>
        <BookmarkControl id={this.props.id}
                         title={this.props.title}
                         isBookmarked={this.props.isBookmarked}
                         updateCardBookmarkedState={(bookmarked) => { this.updateCardBookmarkedState(bookmarked); }} />
      </div>
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
                           sendGaEvent={(action, transport) => this.sendGaEvent(action, transport)} />
          </div>;
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
            <Thumbnail thumbnail={this.props.thumbnail}
                       link={!this.props.onModerationMode ? detailViewLink : ``}
                       sendGaEvent={(action, transport) => this.sendGaEvent(action, transport)} />
            <div className="content m-3">
              <Title title={this.props.title}
                     link={!this.props.onModerationMode ? detailViewLink : ``}
                     sendGaEvent={(action, transport) => this.sendGaEvent(action, transport)} />
              <Creators creators={this.props.creators} className="text-muted" />
              <Description description={this.props.description} />
              { this.renderExtraMeta() }
            </div>
            <div className="fade-overlay"></div>
          </div>
          <div className="m-3">
            { this.renderActionPanel(detailViewLink) }
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
  title: PropTypes.string.isRequired,
  isBookmarked: PropTypes.bool
};

ProjectCard.defaultProps = {
  moderationState: undefined // id of the moderation state
};

export default ProjectCard;
