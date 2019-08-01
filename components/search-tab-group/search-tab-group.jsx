import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link, Redirect } from "react-router-dom";
import SearchTab from "./search-tab.jsx";
import ProjectLoader from "../../components/project-loader/project-loader.jsx";
import ProfileLoader from "../profile-loader/profile-loader.jsx";

const TAB_NAMES = [`people`, `projects`];
const DEFAULT_TAB_NAME = `projects`;

// Extends React.PureComponent instead of React.Component as we want
// this component to re-render only when there's change in its props or state.
// Note that React.PureComponent runs *shallow comparison* to determine
// if the componet should be re-rendered or not. So make sure
// SearchTabGroup's props and state doesn't contain anything mutatable otherwise
// we will run into issues.
class SearchTabGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.availableTabs = TAB_NAMES;
    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    let activeTab;
    let states = {
      activeTab
    };

    // when there are no available tabs to show
    if (this.availableTabs.length === 0) return states;

    // the tab we are trying to load has content and can be rendered
    if (this.availableTabs.indexOf(props.activeTab) >= 0) {
      states.activeTab = props.activeTab;
    }

    // set states.activeTab to be our pre-defined DEFAULT_TAB_NAME
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
    let tabControls = this.availableTabs.map(tabName => {
      let classnames = classNames(`btn btn-tab`, {
        active: this.state.activeTab === tabName
      });

      let to = `/${tabName}`;

      if (this.props.keywordSearched) {
        to += `?keyword=` + encodeURIComponent(this.props.keywordSearched);
      }

      return (
        <Link key={tabName} className={classnames} to={to}>
          {tabName}
        </Link>
      );
    });

    let tabContainerClasses = classNames(`tab-control-container mb-4`, {
      "d-none": this.props.helpType
    });

    if (this.props.keywordSearched) {
      return <div className={tabContainerClasses}>{tabControls}</div>;
    }
  }

  renderTab() {
    // if activeTab isn't set, redirect to base search route and show the default tab
    if (!this.state.activeTab) {
      return (
        <Redirect
          to={{
            pathname: `/`,
            state: { activeTab: this.availableTabs[0] }
          }}
        />
      );
    }

    return SearchTab(
      this.state.activeTab === `projects` ? ProjectLoader : ProfileLoader,
      this.state.activeTab
    )({
      keywordSearched: this.props.keywordSearched,
      helpType: this.props.helpType
    });
  }

  render() {
    return (
      <div>
        {this.renderTabControls()}
        {this.renderTab()}
      </div>
    );
  }
}

SearchTabGroup.propTypes = {
  activeTab: PropTypes.string,
  keywordSearched: PropTypes.string,
  helpType: PropTypes.string
};

SearchTabGroup.defaultProps = {
  keywordSearched: ``
};

export default SearchTabGroup;
