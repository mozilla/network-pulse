import React from 'react';
import { Helmet } from "react-helmet";
import env from "../../js/env-client";
import qs from "qs";
import DebounceInput from 'react-debounce-input';
import ReactGA from 'react-ga';
import SearchTabGroup from '../../components/search-tab-group/search-tab-group.jsx';
import HelpDropdown from '../../components/help-dropdown/help-dropdown.jsx';

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
    document.querySelector(`.search-submit`).classList.add(`search-focus`);
    this.inputFocusEvent();
  }

  getSearchCriteria(props) {
    let query = qs.parse(props.location.search.substring(1));
    let criteria = {
      keywordSearched: query.keyword,
      activeTab: props.match.params.tab,
      helpType: query.helpType
    };

    return criteria;
  }

  setSearchCriteria(key, value) {
	// Current UX dictates that either search or help filter can be used, but not both at the same time, so we reset things every time this function gets called
    let criteria = {
      keywordSearched: ``,
      helpType: ``
    };

    criteria[key] = value;

    this.setState(criteria, () => {
      this.updateBrowserHistory();
    });
  }

  updateBrowserHistory() {
    let keywordSearched = this.state.keywordSearched;
    let helpType = this.state.helpType;
    let location = { pathname: "/search" };
    let query = {};
   
    if ( keywordSearched ) {
      query.keyword = keywordSearched;
    }

    if ( helpType ) {
      query.helpType = helpType;
    }
    
    location.search = `?${qs.stringify(query)}`;
    this.props.history.push(location);
  }

  handleHelpChange(event) {
    let helpType = event.target.value;

    ReactGA.event({
      category: `Search`,
      action: `Help filtered`,
      label: helpType
    });

    this.setSearchCriteria(`helpType`, helpType);
  }

  handleInputChange(event) {
    let keywordsEntered = event.target.value;

    ReactGA.event({
      category: `Search`,
      action: `Keywords entered`,
      label: keywordsEntered
    });

    this.setSearchCriteria(`keywordSearched`, keywordsEntered);
  }

  inputFocusEvent() {
    let input = document.querySelector(`#search-box`);
    let button = document.querySelector(`.search-submit`);

    document.addEventListener("click", (event) => {
        if (event.target === input) {
          button.classList.add('search-focus');
        }
        if (event.target !== input && button.classList.contains('search-focus')) {
          button.classList.remove('search-focus');
        }
    });
  }

  renderSearchBar() {
    return <div className="d-flex align-items-center">
      <div className="activated search-bar w-100">
        <DebounceInput id="search-box"
          value={this.state.keywordSearched}
          debounceTimeout={300}
          type="search"
          onChange={ event => this.handleInputChange(event) }
          inputRef={ ref => this.setDebounceInput(ref) }
          placeholder="Search keywords, people, tags..."
          className="form-control"
        />
        <button className="btn search-submit search small"></button>
      </div>
    </div>;
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

  renderLearnMore() {
    let handleOnClick = function() {
      ReactGA.event({
        category: `Browse`,
        action: `About learn more tap`,
        label: `Tagline learn more link`
      });
    };
  
    let learnMore = env.LEARN_MORE_LINK ? (
      <span>
        <a
          href={env.LEARN_MORE_LINK}
          id="learn-more"
          onClick={() => handleOnClick()}
        >
          Learn more
        </a>.
      </span>
    ) : null;
  
    return (
        <div className="row">
          <h2 className="mb-4 h2-heading col-12 col-md-10 col-lg-8">
            Discover & collaborate on projects for a healthy internet. {learnMore}
          </h2>
        </div>
    );
  };

  renderSearchControls() {
    return <div className="row mt-4 mb-5">
      <div className="col-12 col-lg-8 mb-4">{ this.renderSearchBar() }</div>
      <div className="col-12 col-lg-4">
        <HelpDropdown 
          value={  this.state.helpType } 
          helpType={ (event) => this.handleHelpChange(event)} 
        />
      </div>
    </div>;
  }

  render() {
    return (
      <div className="search-page">
        <Helmet><title>{this.state.keywordSearched}</title></Helmet>
        { this.renderLearnMore() }
        { this.renderSearchControls() }
        <SearchTabGroup
          activeTab={this.state.helpType ? `projects` : this.state.activeTab}
          keywordSearched={this.state.keywordSearched}
          helpType={this.state.helpType}
        />
      </div>
    );
  }
}

export default Search;
