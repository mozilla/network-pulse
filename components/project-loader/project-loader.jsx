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
      totalMatched: 0
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

    this.setState(this.getInitialState(), () => {
      this.fetchData(nextProps);
    });
  },
  fetchData(params = this.props) {
    let combinedParams = Object.assign({}, params, { page: this.state.apiPageIndex });

    if (this.promiseToken) {
      // Since we are making asynchronous calls to fetch data,
      // we want to make sure exisiting fetch call is cancelled before we start a new one.
      // This prevents any unfinished request to incorrectly update the component state
      // when it returns.
      this.promiseToken.cancel();
    }

    // "refresh" token before passing it to Service.entries.get()
    this.promiseToken = {};

    // we are about to make a new request, set loadingData to true.
    this.setState({ loadingData: true });

    Service.entries
      .get(combinedParams,this.promiseToken)
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
    if (!this.props.search || this.state.loadingData) return null;

    let total = this.state.totalMatched,
      plural = (total === 0 || total > 1), // because "0 results"
      term = this.props.search,
      searchResultNotice = `${total} result${plural ? `s` : ``} found for ‘${term}’`;

    return <p>{searchResultNotice}</p>;
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
