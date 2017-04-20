import React from 'react';
import { browserHistory } from 'react-router';
import { Helmet } from "react-helmet";
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import ReactGA from 'react-ga';
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

export default React.createClass({
  getInitialState() {
    return {
      keywordSearched: ``
    };
  },
  componentWillReceiveProps(nextProps) {
    // when window.history.back() or windows.history.forward() is triggered
    // (e.g., clicking on browser's back / forward button)
    // we want to make sure search result gets updated accordingly
    this.setState({ keywordSearched: nextProps.location.query.keyword });
  },
  componentDidMount() {
    this.setState({ keywordSearched: this.props.location.query.keyword });
    // The focus() function of <input /> isn't exposed by <DebounceInput />
    // Ticket filed on the 'react-debounce-input' repo https://github.com/nkbt/react-debounce-input/issues/65
    // In the meanwhile, we have to rely on document.querySelector(`#search-box`) to trigger input's focus() function
    document.querySelector(`#search-box`).focus();
  },
  updateBrowserHistory() {
    let keywordSearched = this.state.keywordSearched;
    let location = {
      pathname: this.props.router.location.pathname
    };

    if ( keywordSearched ) {
      location[`query`] = { keyword: keywordSearched };
    }

    browserHistory.push(location);
  },
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
  },
  handleDismissBtnClick() {
    this.setState({ keywordSearched: `` }, () => {
      this.updateBrowserHistory();
      // The focus() function of <input /> isn't exposed by <DebounceInput />
      // Ticket filed on the 'react-debounce-input' repo https://github.com/nkbt/react-debounce-input/issues/65
      // In the meanwhile, we have to rely on document.querySelector(`#search-box`) to trigger input's focus() function
      document.querySelector(`#search-box`).focus();
    });
  },
  render() {
    return (
      <div className="search-page">
        <Helmet><title>{this.state.keywordSearched}</title></Helmet>
        <div className={classNames({activated: true, 'search-bar': true})}>
          <DebounceInput id="search-box"
                          value={this.state.keywordSearched}
                          debounceTimeout={300}
                          type="search"
                          onChange={this.handleInputChange}
                          placeholder="Search keywords, people, tags..." />
          <button className="btn dismiss" onClick={this.handleDismissBtnClick}>&times;</button>
        </div>
        { this.state.keywordSearched ? <ProjectLoader search={this.state.keywordSearched} /> : null }
      </div>
    );
  }
});
