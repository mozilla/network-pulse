import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import Select from 'react-select';
import ReactGA from 'react-ga';
import Service from '../../js/service.js';
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywordSearched: ``,
      moderationState: { value: ``, label: `` } // in the format <Select> looks for
    };
  }

  componentWillReceiveProps(nextProps) {
    // when window.history.back() or windows.history.forward() is triggered
    // (e.g., clicking on browser's back / forward button)
    // we want to make sure search result gets updated accordingly
    this.setState({
      keywordSearched: nextProps.location.query.keyword,
      moderationState: { value: ``, label: nextProps.location.query.moderationstate }
    });
  }

  componentDidMount() {
    this.setState({
      keywordSearched: this.props.location.query.keyword,
      moderationState: { value: ``, label: this.props.location.query.moderationstate }
    });
    // The focus() function of <input /> isn't exposed by <DebounceInput />
    // Ticket filed on the 'react-debounce-input' repo https://github.com/nkbt/react-debounce-input/issues/65
    // In the meanwhile, we have to rely on document.querySelector(`#search-box`) to trigger input's focus() function
    document.querySelector(`#search-box`).focus();
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
    return <div className={classNames({activated: true, 'search-bar': true, 'mb-2': this.props.moderation})}>
            <DebounceInput id="search-box"
                            value={this.state.keywordSearched}
                            debounceTimeout={300}
                            type="search"
                            onChange={(event) => this.handleInputChange(event)}
                            placeholder="Search keywords, people, tags..." />
            <button className="btn dismiss" onClick={() => this.handleDismissBtnClick()}>&times;</button>
          </div>;
  }

  getModerationStates(input, callback) {
    Service.moderationStates
      .get()
      .then((data) => {
        let options = data.map((option) => {
          return { value: option.id, label: option.name };
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
              <div>Filter by moderation state: </div>
              <Select.Async
                name="form-field-name"
                value={this.state.moderationState}
                className="state-filter d-inline-block text-left ml-2"
                searchable={false}
                placeholder="Filter by moderation state"
                loadOptions={(input, callback) => this.getModerationStates(input, callback)}
                onChange={(selected) => this.handleFilterChange(selected)}
              />
            </div>;
  }

  renderSearchControls() {
    if (this.props.moderation) {
      return <div className="search-control mb-3">
              <h2>Moderation</h2>
              { this.renderSearchBar() }
              { this.renderStateFilter() }
             </div>;
    }

    return <div>{ this.renderSearchBar() }</div>;
  }

  render() {
    return (
      <div className="search-page">
        <Helmet><title>{this.state.keywordSearched}</title></Helmet>
        { this.renderSearchControls() }
        { this.state.keywordSearched ? <ProjectLoader search={this.state.keywordSearched} moderationState={this.state.moderationState} /> : null }
      </div>
    );
  }
}

export default Search;
