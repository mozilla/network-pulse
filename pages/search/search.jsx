import React from 'react';
import { Helmet } from "react-helmet";
import qs from "qs";
import DebounceInput from 'react-debounce-input';
import ReactGA from 'react-ga';
import SearchTabGroup from '../../components/search-tab-group/search-tab-group.jsx';
import Service from '../../js/service';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getSearchCriteria(props);
    this.state.helpOptions = [];
    this.state.helpType = '';

    this.handleHelpChange = this.handleHelpChange.bind(this);
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

    Service.helpTypes.get().then(options => {
      this.setState({ 
        helpOptions: options.map(option => option.name), 
        helpType: '' 
      });
    });
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

  updateBrowserHistory() {
    let keywordSearched = this.state.keywordSearched;
    let location = { pathname: this.props.location.pathname };
    let query = {
      helpType: this.state.helpType
    };
   
    if ( keywordSearched ) {
      query.keyword = keywordSearched;
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

  handleHelpChange(event) {
    this.setState({ helpType: event.target.value}, () => {
      this.updateBrowserHistory();
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
          placeholder="Search name, keyword, location..."
          className="form-control"
        />
        <button className="btn dismiss" onClick={() => this.handleDismissBtnClick()}>&times;</button>
      </div>
    </div>;
  }

  renderHelpFilter() {
    let renderedHelpTypes = this.state.helpOptions.map(type => {
      return <option key={type} value={type}>{type}</option>;
    });

    return <select id="help-dropdown" className="body-large p-3" value={ this.state.helpType } onChange={  (event) => this.handleHelpChange(event) }>
      <option value="">Help</option>
      {renderedHelpTypes}
    </select>;
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

  renderSearchControls() {
    return <div className="row mt-4 mb-5 pb-5">
      <div className="col-8">{ this.renderSearchBar() }</div>
      <div className="col-4">{ this.renderHelpFilter() }</div>
    </div>;
  }

  render() {
    return (
      <div className="search-page">
        <Helmet><title>{this.state.keywordSearched}</title></Helmet>
        { this.renderSearchControls() }
        <SearchTabGroup
          activeTab={this.state.activeTab}
          keywordSearched={this.state.keywordSearched}
          helpType={this.state.helpType}
        />
      </div>
    );
  }
}

export default Search;
