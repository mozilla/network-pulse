import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import LoadingNotice from '../loading-notice.jsx';
import ProjectCardSimple from '../project-card/project-card-simple.jsx';
import ProfileCard from '../profile-card/profile-card.jsx';
import Utility from '../../js/utility.js';
import pageSettings from '../../js/app-page-settings';

class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inPageUpdate: false
    };
  }

  componentDidMount() {
    pageSettings.setCurrentPathname(window.location.pathname);
  }

  componentDidUpdate() {
    if (!this.state.inPageUpdate) {
      pageSettings.restoreScrollPosition();
    }
  }

  componentWillUnmount() {
    pageSettings.setScrollPosition();
  }

  handleLoadMoreBtnClick() {
    ReactGA.event({
      category: `Browse`,
      action: `View more tap`,
      label: window.location.pathname
    });
    this.props.fetchData();
    this.setState({inPageUpdate: true});
  }

  renderProjectCards() {
    return this.props.items.map(item => {
      return <ProjectCardSimple key={item.id} onModerationMode={this.props.onModerationMode} {...Utility.processEntryData(item)} />;
    });
  }

  renderProfileCards() {
    return this.props.items.map(item => {
      return <ProfileCard key={item.id} {...item} />;
    });
  }

  renderLoadingNotice() {
    if (!this.props.loadingData ) return null;

    return <LoadingNotice />;
  }

  renderViewMoreBtn() {
    if (!this.props.moreItemsToFetch) return null;

    return <div className="view-more text-center">
      <button type="button" className="btn btn-outline-info" onClick={() => this.handleLoadMoreBtnClick()}>View more</button>
    </div>;
  }

  render() {
    return <div className="item-list">
      <div className="row">
        { this.props.type === `profile` ? this.renderProfileCards() : this.renderProjectCards() }
      </div>
      { this.renderLoadingNotice() }
      { this.renderViewMoreBtn() }
    </div>;
  }
}

ItemList.propTypes = {
  type: PropTypes.string,
  items: PropTypes.array.isRequired,
  loadingData: PropTypes.bool.isRequired,
  moreItemsToFetch: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
};

ItemList.defaultProps = {
  type: `projects`
};

export default ItemList;
