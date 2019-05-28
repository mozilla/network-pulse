import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";
import qs from "qs";
import DebounceInput from "react-debounce-input";
import Select from "react-select";
import ReactGA from "react-ga";
import Service from "../../js/service.js";
import ProjectLoader from "../../components/project-loader/project-loader.jsx";

const DEFAULT_MODERATION_FILTER = `Pending`;
const TRENDING_TERMS = [
  { label: `mozsprint`, link: `/tags/mozsprint` },
  { label: `artists open web`, link: `/tags/Artists%20Open%20Web` },
  { label: `inclusion`, link: `/issues/digital-inclusion` },
  { label: `help code`, link: `/help/code` },
  { label: `help with feedback`, link: `/help/test-and-feedback` }
];

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
    let query = qs.parse(props.location.search.substring(1));
    let criteria = {
      keywordSearched: query.keyword
    };

    if (this.props.moderation) {
      // the following states are only useful on moderation mode
      if (query.featured === `True`) {
        criteria.featured = query.featured;
      }
      criteria.moderationState = {
        value: ``,
        label: query.moderationstate || DEFAULT_MODERATION_FILTER
      };
    }

    return criteria;
  }

  updateBrowserHistory() {
    let keywordSearched = this.state.keywordSearched;
    let moderationState = this.state.moderationState;
    let featured = this.state.featured;
    let location = { pathname: this.props.location.pathname };
    let query = {};

    if (keywordSearched) {
      query.keyword = keywordSearched;
    }

    if (this.props.moderation) {
      // the following params are only useful on moderation mode
      if (featured === `True`) {
        query.featured = featured;
      }
      // we want moderationState.label (name of the state) here and not moderationState.value (id of the state)
      query.moderationstate = moderationState.label;
    }

    location.search = `?${qs.stringify(query)}`;
    this.props.history.push(location);
  }

  handleInputChange(event) {
    let keywordsEntered = event.target.value;

    ReactGA.event({
      category: `Search`,
      action: `Keywords entered`,
      label: keywordsEntered
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
      "mb-0": this.props.moderation
    });

    return (
      <div className="d-flex align-items-center">
        <div className={classnames}>
          <DebounceInput
            id="search-box"
            value={this.state.keywordSearched}
            debounceTimeout={300}
            type="search"
            onChange={event => this.handleInputChange(event)}
            inputRef={ref => this.setDebounceInput(ref)}
            placeholder="Search keywords, people, tags..."
            className="form-control"
          />
          <button
            className="btn dismiss"
            onClick={() => this.handleDismissBtnClick()}
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  setDebounceInput(ref) {
    if (this.debounceInputElement || !ref) {
      return;
    }
    this.debounceInputElement = ref;
    // Set up bindings so that when this input
    // receives an "enter", we remove focus.
    this.debounceInputElement.addEventListener(`keyup`, evt => {
      if (evt.key === `Enter`) {
        this.debounceInputElement.blur();
      }
    });
  }

  getModerationStates(input, callback) {
    Service.moderationStates
      .get()
      .then(mStates => {
        let options = mStates.map(mState => {
          return { value: mState.id, label: mState.name };
        });

        callback(null, { options });
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  handleStateFilterChange(selected) {
    this.setState({ moderationState: selected }, () => {
      this.updateBrowserHistory();
    });
  }

  handleFeaturedFilterChange(event) {
    let featured = event.target.checked ? `True` : `False`;
    this.setState({ featured: featured }, () => {
      this.updateBrowserHistory();
    });
  }

  renderStateFilter() {
    return (
      <Select.Async
        name="state-filter"
        value={this.state.moderationState}
        className="state-filter text-left"
        searchable={false}
        clearable={false}
        cache={false}
        placeholder="Moderation state"
        loadOptions={(input, callback) =>
          this.getModerationStates(input, callback)
        }
        onChange={selected => this.handleStateFilterChange(selected)}
      />
    );
  }

  renderFeaturedFilter() {
    return (
      <label className="featured-filter d-flex align-items-center mb-0">
        <input
          type="checkbox"
          className="d-inline-block mr-2"
          onChange={event => this.handleFeaturedFilterChange(event)}
          checked={this.state.featured === `True`}
        />
        Featured only
      </label>
    );
  }

  renderSearchControls() {
    if (this.props.moderation) {
      return (
        <div className="moderation-search-controls mb-4 pb-4">
          <h2>Moderation</h2>
          <div className="row">
            <div className="col-sm-6 col-md-3 mb-2 mb-sm-0">
              {this.renderStateFilter()}
            </div>
            <div className="col-sm-12 col-md-6 mb-2 mb-sm-0">
              {this.renderSearchBar()}
            </div>
            <div className="col-sm-6 col-md-3 mb-2 mb-sm-0">
              {this.renderFeaturedFilter()}
            </div>
          </div>
        </div>
      );
    }

    return <div>{this.renderSearchBar()}</div>;
  }

  renderTrendingTerms() {
    if (this.props.moderation || this.state.keywordSearched) return null;

    let links = TRENDING_TERMS.map(term => (
      <a href={term.link} className="btn btn-link inline-link" key={term.label}>
        {term.label}
      </a>
    )).reduce((prev, curr) => [prev, `, `, curr]);

    return (
      <div className="trending">
        <div className="d-inline-block mr-1">Trending:</div>
        {links}
      </div>
    );
  }

  renderProjects() {
    if (!this.state.keywordSearched && !this.props.moderation) return null;

    if (this.props.moderation) {
      return (
        <ProjectLoader
          search={this.state.keywordSearched}
          moderationState={this.state.moderationState}
          featured={this.state.featured}
          showCounter={true}
        />
      );
    }

    if (this.state.keywordSearched) {
      return (
        <ProjectLoader search={this.state.keywordSearched} showCounter={true} />
      );
    }
  }

  render() {
    return (
      <div className="search-page">
        <Helmet>
          <title>{this.state.keywordSearched}</title>
        </Helmet>
        {this.renderSearchControls()}
        {this.renderTrendingTerms()}
        {this.renderProjects()}
      </div>
    );
  }
}

export default Search;
