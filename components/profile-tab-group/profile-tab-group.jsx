import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Service from '../../js/service';
import LoadingNotice from '../../components/loading-notice.jsx';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import ProjectList from '../../components/project-list/project-list.jsx';

const TABS = {
  // tab name: [ `project type 1`, `project type 2`, ... ]
  projects: [ `published`, `created` ],
  favs: [ `favorited` ]
};

class ProfileTabGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: null,
      entries: null
    };
  }

  componentDidMount() {
    this.fetchProfileEntries(this.props.profileId);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProfileEntries(nextProps.profileId);
  }

  fetchProfileEntries(profileId) {
    Service.profileEntries(profileId)
      .then(profileEntries => {
        let visibleTabs = this.getVisibleTabs(profileEntries);

        this.setState({
          entries: profileEntries,
          visibleTabs,
          activeTab: visibleTabs.length > 0 ? visibleTabs[0] : null
        });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  getVisibleTabs(entries) {
    // 2 scenarios
    // [1] viewing your own profile: show all tabs
    // [2] viewing other people's profile: show tab only if there are entries in that category
    return this.props.myProfile ? Object.keys(TABS) : Object.keys(TABS).filter(tab => {
      return TABS[tab].some(type => entries[type] && entries[type].length > 0);
    });
  }

  handleTabClick(event, type) {
    this.setState({
      activeTab: type
    });
  }

  renderTabControls() {
    if (!this.state.visibleTabs) return null;

    let tabControls = this.state.visibleTabs.map(tab => {
      let classnames = classNames(`btn btn-link btn-tab open-sans text-capitalize`, {
        active: this.state.activeTab === tab
      });

      return <button key={tab} className={classnames} onClick={(event) => this.handleTabClick(event, tab)}>{tab}</button>;
    });

    return <div className="tab-control-container">
      { tabControls }
    </div>;
  }

  renderProjects(headerText, entries, prompt) {
    let content;

    if (prompt) {
      content = <div className="mb-5">{prompt}</div>;
    }

    if (entries && entries.length > 0) {
      content = <ProjectList entries={entries}
        loadingData={false}
        moreEntriesToFetch={false}
        fetchData={()=>{}}
        onModerationMode={false}
      />;
    }

    return <div className="row my-5">
      { headerText && content &&
      <div className="col-12">
        <h2 className="h6 text-uppercase">
          {headerText}
        </h2>
      </div>
      }
      { content &&
      <div className="col-12">
        {content}
      </div>
      }
    </div>
    ;
  }

  renderProjectsTab() {
    let prompt;

    // show prompt only if user is viewing his/her own profile
    if (this.props.myProfile) {
      prompt = <HintMessage
        header="Do you have something to share?"
        linkComponent={<Link to={`/add`}>Add entry</Link>}
      >
        <p>If it might be useful to someone in our network, share it here.</p>
      </HintMessage>;

      if (this.state.entries.published.length === 0 && this.state.entries.created.length === 0) {
        return this.renderProjects(``, [], prompt);
      }
    }

    return <div>
      { this.renderProjects(`Published Projects`, this.state.entries.published, prompt) }
      { this.renderProjects(`Created Projects`, this.state.entries.created, prompt) }
    </div>;
  }

  renderFavsTab() {
    // show prompt only if user is viewing his/her own profile
    let prompt = this.props.myProfile ? <HintMessage
      header="Save your Favs"
      linkComponent={<Link to={`/featured`}>Explore featured</Link>}
    >
      <p>Tap the heart on any project to save it here.</p>
    </HintMessage> : null;

    return this.renderProjects(``, this.state.entries.favorited, prompt);
  }

  renderTab() {
    if (!this.state.activeTab) {
      return null;
    }

    return this.state.activeTab === `favs` ? this.renderFavsTab() : this.renderProjectsTab();
  }

  render() {
    return (
      <div>
        { !this.state.entries ? <LoadingNotice /> :
          <div>
            { this.renderTabControls() }
            { this.renderTab() }
          </div>
        }
      </div>
    );
  }
}

ProfileTabGroup.propTypes = {
  profileId: PropTypes.number.isRequired,
  myProfile: PropTypes.bool.isRequired
};


export default ProfileTabGroup;
