import React from 'react';
import Service from '../../js/service.js';
import ProjectList from '../project-list/project-list.jsx';
import pageSettings from '../../js/app-page-settings';
import env from "../../config/env.generated.json";

const PROJECT_BATCH_SIZE = env.PROJECT_BATCH_SIZE;

export default React.createClass({
  getInitialState() {
    return {
      loadingData: false,
      nextBatchIndex: 1,
      entries: [],
      moreEntriesToFetch: false,
      totalMatched: 0
    };
  },
  componentDidMount() {
    if (pageSettings.shouldRestore) {
      // restore state back to what is stored in pageSettings
      this.setState(pageSettings.currentList);
    } else {
      this.fetchData();
    }
  },
  componentWillReceiveProps(nextProps) {
    // Reset state before fetching data for the new params.
    // We want to keep existingPromise on record for fetchData
    // to handle it accoringly.

    this.setState(this.getInitialState(), () => {
      this.fetchData(nextProps);
    });
  },
  createQueryParams(params) {
    let combinedParams = Object.assign({},params);

    if (combinedParams.ids) {
      // We want to display bookmarked projects by the time they were bookmarked.
      // There are a few steps to make this happen:
      // 1) first we fetch projects from Pulse API in a batch of size PROJECT_BATCH_SIZE.
      //    (See next few lines.)
      // 2) we sort projects based on the order they were stored in localStorage
      //    and pass the sorted array to <ProjectList> to render projects onto the page.
      //    (See updateStateWithNewData(data) method.)

      let begin = (this.state.nextBatchIndex-1)*PROJECT_BATCH_SIZE;
      let end = this.state.nextBatchIndex*PROJECT_BATCH_SIZE;
      let idsInCurrentBatch = combinedParams.ids.slice(begin,end);

      combinedParams.ids = idsInCurrentBatch.join(`,`);

      return Object.assign(combinedParams, { page: 1 });
    }

    return Object.assign(combinedParams, { page: this.state.nextBatchIndex });
  },
  fetchData(params = this.props) {
    let combinedParams = this.createQueryParams(params);

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
    let moreEntriesToFetch = !!data.next;
    let sorter;

    if (this.props.ids) {
      // sort entries by the time they were bookmarked, from most recently bookmarked
      let ids = this.props.ids.slice();
      sorter = (a,b) => ids.indexOf(a.id) - ids.indexOf(b.id);
      moreEntriesToFetch = (this.state.nextBatchIndex * PROJECT_BATCH_SIZE) < this.props.ids.length;
    }

    let nextBatchIndex = moreEntriesToFetch ? this.state.nextBatchIndex+1 : this.state.nextBatchIndex;
    let newEntries = sorter ? data.results.sort(sorter) : data.results;

    let currentListInfo = {
      entries: this.state.entries.concat(newEntries),
      nextBatchIndex: nextBatchIndex,
      moreEntriesToFetch: moreEntriesToFetch,
      totalMatched: data.count
    };

    // store current project list's info in pageSettings
    pageSettings.setCurrentList(currentListInfo);

    // update component's state
    currentListInfo.loadingData = false;
    this.setState(currentListInfo);
  },
  renderTagHeader() {
    if (!this.props.tag) return null;

    return <h2>{`Tag: ${this.props.tag}`}</h2>;
  },
  renderLearnMoreNotice() {
    if(!this.props.featured) return null;
  
    return <div><p>Discover & collaborate on projects for a healthy internet. <a href="https://www.mozillapulse.org/entry/120">Learn more</a>.</p></div>;
  },
  renderSearchResult() {
    if (!this.props.search || this.state.loadingData) return null;

    let total = this.state.totalMatched,
      plural = (total === 0 || total > 1), // because "0 results"
      term = this.props.search,
      searchResultNotice = `${total} result${plural ? `s` : ``} found for ‘${term}’`;

    return <p>{searchResultNotice}</p>;
  },
  renderEntryCounter() {
    if (this.state.loadingData) return null;
    if (!this.props.issue && !this.props.tag) return null;
    
    return <p>{this.state.totalMatched} result{this.state.totalMatched > 0 ? `s` : ``} found</p>;
  },
  render() {
    return (
      <div>
        { this.renderTagHeader() }
        { this.renderLearnMoreNotice()}
        { this.renderSearchResult() }
        { this.renderEntryCounter() }
        <ProjectList entries={this.state.entries}
                    loadingData={this.state.loadingData}
                    moreEntriesToFetch={this.state.moreEntriesToFetch}
                    fetchData={this.fetchData}
                    restoreScrollPosition={pageSettings.shouldRestore} />
      </div>
    );
  }
});
