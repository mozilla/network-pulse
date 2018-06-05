import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
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
    let visibleTabs = this.getVisibleTabs(props);
    let activeTab;

    if (visibleTabs.indexOf(props.activeTab) >= 0) {
      activeTab = props.activeTab;
    }

    if (!props.activeTab) {
      activeTab = visibleTabs[0];
    }

    return {
      activeTab,
      visibleTabs
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTab !== this.state.activeTab) {
      this.setState(this.getInitialState(nextProps));
    }
  }

  getVisibleTabs(props) {
    // 2 scenarios
    // [1] viewing your own profile: show all tabs
    // [2] viewing other people's profile: show tab only if there are entries in that category
    const TAB_NAMES = Object.keys(PROJECT_TYPES_BY_TAB_NAME);

    return props.myProfile ? TAB_NAMES : TAB_NAMES.filter(tab => {
      return PROJECT_TYPES_BY_TAB_NAME[tab].some(type => props.entryCount[type] && props.entryCount[type] > 0);
    });
  }

  renderTabControls() {
    if (!this.state.visibleTabs) return null;

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
    return <ProfileProjectTab
      profileId={this.props.profileId}
      myProfile={this.props.myProfile}
      tabName={this.state.activeTab}
      projectTypes={PROJECT_TYPES_BY_TAB_NAME[this.state.activeTab]}
    />;
  }

  render() {
    return (
      <div>
        { this.renderTabControls() }
        { this.state.activeTab && this.renderTab() }
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
