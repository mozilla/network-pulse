import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Service from '../../js/service';
import LoadingNotice from '../../components/loading-notice.jsx';
import HintMessage from '../../components/hint-message/hint-message.jsx';
import ItemList from '../../components/item-list/item-list.jsx';

class ProfileProjectTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    return {
      profileId: props.profileId,
      entries: null
    };
  }

  componentDidMount() {
    this.fetchProfileEntries();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tabName !== this.props.tabName) {
      this.setState(this.getInitialState(nextProps), () => {
        this.fetchProfileEntries();
      });
    }
  }

  fetchProfileEntries() {
    let params = {};

    this.props.projectTypes.forEach(type => {
      params[type] = true;

      if (type === `favorited`) {
        params.favorited_ordering = `-id`;
      }
    });

    Service.profileEntries(this.state.profileId, params)
      .then(profileEntries => {
        this.setState({
          entries: profileEntries
        });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  renderProjects(headerText, entries, prompt) {
    let content;

    if (prompt) {
      content = <div className="mb-5">{prompt}</div>;
    }

    if (entries && entries.length > 0) {
      content = <ItemList
        items={entries}
        loadingData={false}
        moreItemsToFetch={false}
        fetchData={()=>{}}
        onModerationMode={false}
      />;
    }

    if (!content) return null;

    return <div className="row mb-5">
      { headerText &&
      <div className="col-12">
        <h2 className="h6 text-uppercase">
          {headerText}
        </h2>
      </div>
      }
      <div className="col-12">
        {content}
      </div>
    </div>
    ;
  }

  renderProjectsTab() {
    let prompt;

    if (this.props.myProfile) {
      prompt = <HintMessage
        header="Do you have something to share?"
        linkComponent={<Link to={`/add`}>Add entry</Link>}
      >
        <p>If it might be useful to someone in our network, share it here.</p>
      </HintMessage>;
    }

    if (this.state.entries.published.length === 0 && this.state.entries.created.length === 0) {
      return this.renderProjects(``, [], prompt);
    }

    return <div>
      { this.renderProjects(`Published Projects`, this.state.entries.published, prompt) }
      { this.renderProjects(`Created Projects`, this.state.entries.created, prompt) }
    </div>;
  }

  renderFavsTab() {
    let prompt;

    if (this.props.myProfile) {
      prompt = <HintMessage
        header="Save your Favs"
        linkComponent={<Link to={`/featured`}>Explore featured</Link>}
      >
        <p>Tap the heart on any project to save it here.</p>
      </HintMessage>;
    }

    return this.renderProjects(``, this.state.entries.favorited, prompt);
  }

  renderTab() {
    return this.props.tabName === `favs` ? this.renderFavsTab() : this.renderProjectsTab();
  }

  render() {
    return !this.state.entries ? <LoadingNotice /> : <div>{ this.renderTab() }</div>;
  }
}

ProfileProjectTab.propTypes = {
  profileId: PropTypes.number.isRequired,
  myProfile: PropTypes.bool.isRequired,
  tabName: PropTypes.string.isRequired,
  projectTypes: PropTypes.array.isRequired
};


export default ProfileProjectTab;
