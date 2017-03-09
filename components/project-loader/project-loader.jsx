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
      params: {},
      existingPromise: null
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
    // We want keep existingPromise on record for fetchData
    // to handle it accoringly.
    let existingPromise = this.state.existingPromise;
    let newState = Object.assign(this.getInitialState(), {existingPromise: existingPromise});

    this.setState(newState, () => {
      this.fetchData(nextProps.params);
    });
  },
  fetchData(params = this.props.params) {
    // Since we are making asynchronous calls to fetch data,
    // we want to make sure exisiting fetch call is cancelled before we start a new one.
    // This prevents any unfinished request to incorrectly update the component state
    // when it returns.
    if (this.state.existingPromise && this.state.existingPromise.cancel) {
      this.state.existingPromise.cancel();
    }

    // We are about to make a new request, set loadingData to true.
    this.setState({ loadingData: true });

    let combinedParams = Object.assign({}, params, { page: this.state.apiPageIndex });
    let promise = Service.entries
                      .get(combinedParams)
                      .then((data) => {
                        this.updateStateWithNewData(data);
                      })
                      .catch((reason) => {
                        console.error(reason);
                      });

    // regardless of the promise's fate, we want component to know about this promise
    this.setState({ existingPromise: promise });
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
