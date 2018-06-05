import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, Redirect } from 'react-router-dom';
import ProfileProjectTab from '../../components/profile-project-tab/profile-project-tab.jsx';

const PROJECT_TYPES_BY_TAB_NAME = {
  projects: [ `published`, `created` ],
  favs: [ `favorited` ]
};

class ProfileTabGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    let visibleTabs = this.getAvailableTabs(props);
    let activeTab;
    let states = {
      activeTab,
      visibleTabs
    };

    if (visibleTabs.length === 0) return states;

    if (visibleTabs.indexOf(props.activeTab) >= 0) {
      states.activeTab = props.activeTab;
    }

    if (!props.activeTab) {
      states.activeTab = visibleTabs[0];
    }

    return states;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTab !== this.state.activeTab) {
      this.setState(this.getInitialState(nextProps));
    }
  }

  getAvailableTabs(props) {
    // 2 scenarios
    // [1] viewing your own profile: show all tabs
    // [2] viewing other people's profile: show tab only if there are entries in that category
    const TAB_NAMES = Object.keys(PROJECT_TYPES_BY_TAB_NAME);

    return props.myProfile ? TAB_NAMES : TAB_NAMES.filter(tab => {
      return PROJECT_TYPES_BY_TAB_NAME[tab].some(type => props.entryCount[type] && props.entryCount[type] > 0);
    });
  }

  renderTabControls() {
    let tabControls = this.state.visibleTabs.map(tabName => {
      let classnames = classNames(`btn btn-link btn-tab open-sans text-capitalize`, {
        active: this.state.activeTab === tabName
      });

      return <Link
        key={tabName}
        className={classnames}
        to={`/profile/${this.props.profileId}/${tabName}`}
      >
        {tabName}
      </Link>;
    });

    return <div className="tab-control-container">
      { tabControls }
    </div>;
  }

  renderTab() {
    if (!this.state.activeTab) {
      return <Redirect to={{
        pathname: `/profile/${this.props.profileId}`,
        state: { activeTab: this.state.visibleTabs[0] }
      }} />;
    }

    return <ProfileProjectTab
      profileId={this.props.profileId}
      myProfile={this.props.myProfile}
      tabName={this.state.activeTab}
      projectTypes={PROJECT_TYPES_BY_TAB_NAME[this.state.activeTab]}
    />;
  }

  render() {
    if (this.state.visibleTabs.length === 0) {
      if (this.props.activeTab) {
        return <Redirect to={`/profile/${this.props.profileId}`} />;
      }

      return null;
    }

    return (
      <div>
        { this.renderTabControls() }
        { this.renderTab() }
      </div>
    );
  }
}

ProfileTabGroup.propTypes = {
  profileId: PropTypes.number.isRequired,
  myProfile: PropTypes.bool.isRequired,
  entryCount: PropTypes.object.isRequired,
  activeTab: PropTypes.string
};


export default ProfileTabGroup;
