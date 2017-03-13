import React from 'react';
import Service from '../../js/service.js';
import ProjectList from '../project-list/project-list.jsx';

export default React.createClass({
  getInitialState() {
    return {
      loadingData: false,
      apiPageIndex: 1,
      entries: [],
      moreEntriesToFetch: false,
      totalMatched: 0,
      tokenOfExistingPromise: null
    };
  },
  getDefaultProps() {
    return {
      params: {}
    };
  },
  componentDidMount() {
    this.fetchData();
  },
  componentWillReceiveProps(nextProps) {
    // Reset state before fetching data for the new params.
    // We want to keep existingPromise on record for fetchData
    // to handle it accoringly.
    let tokenOfExistingPromise = this.state.tokenOfExistingPromise;
    let newState = Object.assign(this.getInitialState(), {tokenOfExistingPromise: tokenOfExistingPromise});

    this.setState(newState, () => {
      this.fetchData(nextProps.params);
    });
  },
  fetchData(params = this.props.params) {
    // Since we are making asynchronous calls to fetch data,
    // we want to make sure exisiting fetch call is cancelled before we start a new one.
    // This prevents any unfinished request to incorrectly update the component state
    // when it returns.
    if (this.state.tokenOfExistingPromise) {
      this.state.tokenOfExistingPromise.cancel();
    }

    let combinedParams = Object.assign({}, params, { page: this.state.apiPageIndex });
    let token = {};

    this.setState({
      // we are about to make a new request, set loadingData to true.
      loadingData: true,
      // we want component to know about the promise returned from the to-be-called Service.entries.get()
      tokenOfExistingPromise: token
    });

    Service.entries
      .get(combinedParams,token)
      .then((data) => {
        this.updateStateWithNewData(data);
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  updateStateWithNewData(data) {
    this.setState({
      loadingData: false,
      entries: this.state.entries.concat(data.results),
      apiPageIndex: data.next ? this.state.apiPageIndex+1 : this.state.apiPageIndex,
      moreEntriesToFetch: !!data.next,
      totalMatched: data.count
    });
  },
  renderSearchResult() {
    return (this.props.params.search && !this.state.loadingData ) ?
      (<p>{this.state.totalMatched} result{this.state.totalMatched > 1 ? `s` : ``} found for ‘{this.props.params.search}’</p>) : null;
  },
  render() {
    return (
      <div>
        { this.renderSearchResult() }
        <ProjectList entries={this.state.entries}
                    loadingData={this.state.loadingData}
                    moreEntriesToFetch={this.state.moreEntriesToFetch}
                    fetchData={this.fetchData} />
      </div>
    );
  }
});
