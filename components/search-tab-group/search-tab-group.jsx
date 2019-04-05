import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, Redirect } from 'react-router-dom';
import SearchProfilesTab from './search-profiles-tab.jsx';
import SearchProjectsTab from './search-projects-tab.jsx';

const TAB_NAMES = [ `profiles`, `projects` ];
const DEFAULT_TAB_NAME = `projects`;

class SearchTabGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    let availableTabs = TAB_NAMES;
    let activeTab;
    let states = {
      activeTab,
      availableTabs
    };

    // when there are no available tabs to show
    if (availableTabs.length === 0) return states;

    // the tab we are trying to load has content and can be rendered
    if (availableTabs.indexOf(props.activeTab) >= 0) {
      states.activeTab = props.activeTab;
    }

    // set states.activeTab to be the default tab (first tab in availableTabs)
    if (!props.activeTab) {
      states.activeTab = DEFAULT_TAB_NAME;
    }

    return states;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTab !== this.state.activeTab) {
      this.setState(this.getInitialState(nextProps));
    }
  }

  renderTabControls() {
    let tabControls = this.state.availableTabs.map(tabName => {
      let classnames = classNames(`btn btn-tab open-sans text-uppercase`, {
        active: this.state.activeTab === tabName
      });

      let to = `/search/${tabName}`;

      if (this.props.keywordSearched) {
        to += `?keyword=` + encodeURIComponent(this.props.keywordSearched);
      }

      return <Link
        key={tabName}
        className={classnames}
        to={to}
      >
        {tabName}
      </Link>;
    });

    return <div className="tab-control-container">
      { tabControls }
    </div>;
  }

  renderTab() {
    // if activeTab isn't set, redirect to base search route and show the default tab
    if (!this.state.activeTab) {
      return <Redirect to={{
        pathname: `/search`,
        state: { activeTab: this.state.availableTabs[0] }
      }} />;
    }

    let tab = <SearchProfilesTab
      keywordSearched={this.props.keywordSearched}
    />;

    // let tab = <h1>hello</h1>;

    if (this.state.activeTab === `projects`) {
      tab = <SearchProjectsTab
        keywordSearched={this.props.keywordSearched}
      />;
      // tab = <h1>world</h1>;
    }

    return tab;

    // return null;
  }

  render() {
    console.log(`SearchTabGroup props`, this.props);

    return (
      <div>
        { this.renderTabControls() }
        { this.renderTab() }
      </div>
    );
  }
}

SearchTabGroup.propTypes = {
  activeTab: PropTypes.string,
  keywordSearched: PropTypes.string
};

SearchTabGroup.defaultProps = {
  keywordSearched: ``
};

export default SearchTabGroup;
