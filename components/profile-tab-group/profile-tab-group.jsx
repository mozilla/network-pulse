import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, Redirect } from 'react-router-dom';
import ProfileAboutTab from '../../components/profile-about-tab/profile-about-tab.jsx';
import ProfileProjectTab from '../../components/profile-project-tab/profile-project-tab.jsx';

const PROJECT_TYPES_BY_TAB_NAME = {
  about: [ ], // a tab to show user's long bio
  projects: [ `published`, `created` ], // a tab to show projects
  favs: [ `favorited` ] // a tab to show user's favourited projects
};

class ProfileTabGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    let availableTabs = this.getAvailableTabs(props);
    let activeTab;
    let states = {
      activeTab,
      availableTabs
    };

    // this profile doesn't have any available tabs to show
    if (availableTabs.length === 0) return states;

    // the tab we are trying to load has content and can be rendered
    if (availableTabs.indexOf(props.activeTab) >= 0) {
      states.activeTab = props.activeTab;
    }

    // we are trying to load the base profile page (e.g., without specifying which tab)
    // set states.activeTab to be the default tab (first tab in availableTabs)
    if (!props.activeTab) {
      states.activeTab = availableTabs[0];
    }

    return states;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTab !== this.state.activeTab) {
      this.setState(this.getInitialState(nextProps));
    }
  }

  getAvailableTabs(props) {
    // returns a list of names of the tabs that are available for this profile

    return Object.keys(PROJECT_TYPES_BY_TAB_NAME).filter(tab => {
      // show "about" tab only when there's long bio to available to show
      if (tab === `about`) {
        return !!props.userBioLong;
      }

      // for rest of the tabs (project based tabs) like "projects" and "favs"...
      // 2 scenarios
      // [1] viewing your own profile: always show tab
      // [2] viewing other people's profile: show tab only if there is content to show
      return props.myProfile || PROJECT_TYPES_BY_TAB_NAME[tab].some(type => props.entryCount[type] && props.entryCount[type] > 0);
    });
  }

  renderTabControls() {
    let tabControls = this.state.availableTabs.map(tabName => {
      let classnames = classNames(`btn btn-tab open-sans text-uppercase`, {
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
    // if activeTab isn't set, redirect to base profile route and show the default tab
    if (!this.state.activeTab) {
      return <Redirect to={{
        pathname: `/profile/${this.props.profileId}`,
        state: { activeTab: this.state.availableTabs[0] }
      }} />;
    }

    let tab = <ProfileProjectTab
      profileId={this.props.profileId}
      myProfile={this.props.myProfile}
      tabName={this.state.activeTab}
      projectTypes={PROJECT_TYPES_BY_TAB_NAME[this.state.activeTab]}
    />;

    if (this.state.activeTab === `about`) {
      tab = <ProfileAboutTab longBio={this.props.userBioLong} />;
    }

    return tab;
  }

  render() {
    // when this profile has no available tabs to show
    if (this.state.availableTabs.length === 0) {
      // redirect users to base profile route if they are trying to view a specific profile tab
      if (this.props.activeTab) {
        return <Redirect to={`/profile/${this.props.profileId}`} />;
      }

      // show nothing if nothing is available to show on the base profile route
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
  userBioLong: PropTypes.string,
  activeTab: PropTypes.string
};

ProfileTabGroup.defaultProps = {
  entryCount: {}
};

export default ProfileTabGroup;
