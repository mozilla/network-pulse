import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import Select from 'react-select';
import ReactGA from 'react-ga';
import Service from '../../js/service.js';
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

const DEFAULT_MODERATION_FILTER = `Pending`;

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

  getSearchCriteria(props) {
    return {
      keywordSearched: props.location.query.keyword,
      moderationState: { value: ``, label: props.location.query.moderationstate || DEFAULT_MODERATION_FILTER },
      featured: props.location.query.featured || ``
    };
  }

  updateBrowserHistory() {
    let keywordSearched = this.state.keywordSearched;
    let moderationState = this.state.moderationState;
    let featured = this.state.featured;
    let location = { pathname: this.props.router.location.pathname };
    let query = {};


    if ( keywordSearched ) {
      query.keyword = keywordSearched;
    }

    if ( moderationState ) {
      // we want moderationState.label (name of the state) here and not moderationState.value (id of the state)
      query.moderationstate = moderationState.label;
    }

    if ( featured === `True` ) {
      query.featured = featured;
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
    let classnames = classNames(`activated search-bar w-100`, {
      'mb-0': this.props.moderation
    });

    return <div className="d-flex align-items-center">
            <div className={classnames}>
              <DebounceInput id="search-box"
                              value={this.state.keywordSearched}
                              debounceTimeout={300}
                              type="search"
                              onChange={(event) => this.handleInputChange(event)}
                              placeholder="Search keywords, people, tags..."
                              className="form-control"
              />
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

  handleStateFilterChange(selected) {
    this.setState({ moderationState: selected }, () => {
      this.updateBrowserHistory();
    });
  }

  handleFeaturedFilterChange(event) {
    let featured = event.target.checked ? `True`: `False`;
    this.setState({ featured: featured }, () => {
      this.updateBrowserHistory();
    });
  }

  renderStateFilter() {
    return <Select.Async
            name="state-filter"
            value={this.state.moderationState}
            className="state-filter text-left"
            searchable={false}
            clearable={false}
            cache={false}
            placeholder="Moderation state"
            loadOptions={(input, callback) => this.getModerationStates(input, callback)}
            onChange={(selected) => this.handleStateFilterChange(selected)}
          />;
  }

  renderFeaturedFilter() {
    return <label className="featured-filter d-flex align-items-center mb-0">
              <input type="checkbox"
                     className="d-inline-block mr-2"
                     onChange={(event) => this.handleFeaturedFilterChange(event)}
                     checked={this.state.featured === `True`} />
              Featured only
            </label>;
  }

  renderSearchControls() {
    if (this.props.moderation) {
      return <div className="moderation-search-controls mb-4 pb-4">
              <h2>Moderation</h2>
              <div className="row">
                <div className="col-sm-6 col-md-3 mb-2 mb-sm-0">{ this.renderStateFilter() }</div>
                <div className="col-sm-12 col-md-6 mb-2 mb-sm-0">{ this.renderSearchBar() }</div>
                <div className="col-sm-6 col-md-3 mb-2 mb-sm-0">{ this.renderFeaturedFilter() }</div>
              </div>
             </div>;
    }

    return <div>{ this.renderSearchBar() }</div>;
  }

  renderProjects() {
    if (!this.state.keywordSearched && !this.props.moderation) return null;

    if (this.props.moderation) {
      return <ProjectLoader search={this.state.keywordSearched}
                            moderationState={this.state.moderationState}
                            featured={this.state.featured}
                            showCounter={true} />;
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
