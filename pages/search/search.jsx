import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import Select from 'react-select';
import ReactGA from 'react-ga';
import Service from '../../js/service.js';
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

const DEFALUT_MODERATION_FILTER = `Pending`;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getSearchCriteria(props);
  }

  componentWillReceiveProps(nextProps) {
    // when window.history.back() or windows.history.forward() is triggered
    // (e.g., clicking on browser's back / forward button)
    // we want to make sure search result gets updated accordingly
    this.setState(this.getSearchCriteria(nextProps));
  }

  componentDidMount() {
    // The focus() function of <input /> isn't exposed by <DebounceInput />
    // Ticket filed on the 'react-debounce-input' repo https://github.com/nkbt/react-debounce-input/issues/65
    // In the meanwhile, we have to rely on document.querySelector(`#search-box`) to trigger input's focus() function
    document.querySelector(`#search-box`).focus();
  }

  getSearchCriteria(theProps) {
    return {
      keywordSearched: theProps.location.query.keyword,
      moderationState: { value: ``, label: theProps.location.query.moderationstate || DEFALUT_MODERATION_FILTER }
    };
  }

  updateBrowserHistory() {
    let keywordSearched = this.state.keywordSearched;
    let moderationState = this.state.moderationState;
    let location = { pathname: this.props.router.location.pathname };
    let query = {};


    if ( keywordSearched ) {
      query.keyword = keywordSearched;
    }

    if ( moderationState ) {
      query.moderationstate = moderationState.label;
    }

    location.query = query;
    browserHistory.push(location);
  }

  handleInputChange(event) {
    let keywordsEntered = event.target.value;

    ReactGA.event({
      category: `Search input box`,
      action: `Keywords entered`,
      label: `${keywordsEntered}`
    });

    this.setState({ keywordSearched: keywordsEntered }, () => {
      this.updateBrowserHistory();
    });
  }

  handleDismissBtnClick() {
    this.setState({ keywordSearched: `` }, () => {
      this.updateBrowserHistory();
      // The focus() function of <input /> isn't exposed by <DebounceInput />
      // Ticket filed on the 'react-debounce-input' repo https://github.com/nkbt/react-debounce-input/issues/65
      // In the meanwhile, we have to rely on document.querySelector(`#search-box`) to trigger input's focus() function
      document.querySelector(`#search-box`).focus();
    });
  }

  renderSearchBar() {
    let classnames = classNames({activated: true, 'search-bar': true, 'w-100': true, 'mb-0': this.props.moderation});
    let label;

    if (this.props.moderation) {
      label = <div className="mr-2">Keywords:</div>;
    }

    return <div className="d-flex align-items-center">
            {label}
            <div className={classnames}>
              <DebounceInput id="search-box"
                              value={this.state.keywordSearched}
                              debounceTimeout={300}
                              type="search"
                              onChange={(event) => this.handleInputChange(event)}
                              placeholder="Search keywords, people, tags..." />
              <button className="btn dismiss" onClick={() => this.handleDismissBtnClick()}>&times;</button>
            </div>
          </div>;
  }

  getModerationStates(input, callback) {
    Service.moderationStates
      .get()
      .then((mStates) => {
        let options = mStates.map((mState) => {
          return { value: mState.id, label: mState.name };
        });

        callback(null, {options});
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  handleFilterChange(selected) {
    this.setState({ moderationState: selected }, () => {
      this.updateBrowserHistory();
    });
  }

  renderStateFilter() {
    return <div className="d-flex align-items-center mb-3">
              <div className="mr-2">Filter by moderation state:</div>
              <Select.Async
                name="form-field-name"
                value={this.state.moderationState}
                className="state-filter d-inline-block text-left"
                searchable={false}
                clearable={false}
                cache={false}
                placeholder="Moderation state"
                loadOptions={(input, callback) => this.getModerationStates(input, callback)}
                onChange={(selected) => this.handleFilterChange(selected)}
              />
            </div>;
  }

  renderSearchControls() {
    if (this.props.moderation) {
      return <div className="moderation-search-controls mb-4 pb-4">
              <h2>Moderation</h2>
              <div>
                { this.renderStateFilter() }
                { this.renderSearchBar() }
              </div>
             </div>;
    }

    return <div>{ this.renderSearchBar() }</div>;
  }

  renderProjects() {
    if (!this.state.keywordSearched && !this.props.moderation) return null;

    if (this.props.moderation) {
      return <ProjectLoader search={this.state.keywordSearched} moderationState={this.state.moderationState} showCounter={true} />;
    }

    if (this.state.keywordSearched) {
      return <ProjectLoader search={this.state.keywordSearched} showCounter={true} />;
    }
  }

  render() {
    return (
      <div className="search-page">
        <Helmet><title>{this.state.keywordSearched}</title></Helmet>
        { this.renderSearchControls() }
        { this.renderProjects() }
      </div>
    );
  }
}

export default Search;
