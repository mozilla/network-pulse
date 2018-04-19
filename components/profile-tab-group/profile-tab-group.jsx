import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Service from '../../js/service';
import LoadingNotice from '../../components/loading-notice.jsx';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import ProjectList from '../../components/project-list/project-list.jsx';

const TABS = {
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
    this.fetchProfileEntries(this.props.profileId, profileEntries => {
      let visibleTabs = this.getVisibleTabs(profileEntries);

      this.setState({
        entries: profileEntries,
        visibleTabs,
        activeTab: visibleTabs[0]
      });
    });
  }

  fetchProfileEntries(profileId, response) {
    Service.profileEntries(profileId)
      .then(entries => {
        response(entries);
      })
      .catch(reason => {
        console.error(reason);
        response({});
      });
  }

  getVisibleTabs(entries) {
    // 2 scenarios
    // [1] viewing your own profile: show all tabs
    // [2] viewing other people's profile: show tab only if there are entries in that category
    return this.props.myProfile ? Object.keys(TABS) : Object.keys(TABS).filter(tab => {
      return TABS[tab].some(type => {
        console.log(tab, type, entries[type] && entries[type].length > 0);
        return entries[type] && entries[type].length > 0;
      });
    });
  }

  handleTabClick(event, type) {
    this.setState({
      activeTab: type
    });
  }

  renderTabControls() {
    let tabNames = this.props.myProfile ? Object.keys(TABS) : Object.keys(TABS).filter(tab => {
      return TABS[tab].some(type => {
        return this.state.entries[type] && this.state.entries[type].length > 0;
      });
    });

    let tabControls = tabNames.map(tab => {
      let classnames = classNames(`btn btn-link btn-tab open-sans text-capitalize`, {
        active: this.state.activeTab === tab
      });

      return <button key={tab} className={classnames} onClick={(event) => this.handleTabClick(event, tab)}>{tab}</button>;
    });

    return <div className="my-5">
      { tabControls }
    </div>;
  }

  renderProjects(label, entries, prompt) {
    let content = <div className="mb-5">{prompt}</div>;

    if (entries && entries.length > 0) {
      content = <ProjectList entries={entries}
        loadingData={false}
        moreEntriesToFetch={false}
        fetchData={()=>{}}
        onModerationMode={false}
      />;
    }

    return <div className="row my-5">
      <div className="col-12">
        <h2 className="h4">
          {label}
        </h2>
      </div>
      <div className="col-12">
        {content}
      </div>
    </div>
    ;
  }

  renderProjectsTab() {
    // show prompt only if user is viewing his/her own profile
    let prompt = this.props.myProfile ? <HintMessage
      header="Do you have something to share?"
      linkComponent={<Link to={`/add`}>Add entry</Link>}
    >
      <p>If it might be useful to someone in our network, share it here.</p>
    </HintMessage> : null;

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

    return this.renderProjects(`Favs`, this.state.entries.favorited, prompt);
  }

  render() {
    return (
      <div>
        { !this.state.entries ? <LoadingNotice /> :
          <div>
            { this.renderTabControls() }
            { this.state.activeTab === `favs` ? this.renderFavsTab() : this.renderProjectsTab() }
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
