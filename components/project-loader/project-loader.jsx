import React from "react";
import PropTypes from "prop-types";
import Service from "../../js/service.js";
import ItemList from "../item-list/item-list.jsx";
import SearchResultCounter from "../search-result-counter.jsx";
import pageSettings from "../../js/app-page-settings";
import env from "../../js/env-client";

const PROJECT_BATCH_SIZE = env.PROJECT_BATCH_SIZE;

class ProjectLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      loadingData: false,
      nextBatchIndex: 1,
      entries: [],
      moreEntriesToFetch: false,
      totalMatched: null
    };
  }

  componentDidMount() {
    if (pageSettings.shouldRestore) {
      // restore state back to what is stored in pageSettings
      this.setState(pageSettings.currentList);
    } else {
      this.fetchData();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Reset state before fetching data for the new params.
    // We want to keep existingPromise on record for fetchData
    // to handle it accoringly.

    this.setState(this.getInitialState(), () => {
      this.fetchData(this.props.bookmarkedOnly, nextProps);
    });
  }

  createQueryParams(params) {
    let combinedParams = Object.assign({}, params);

    if (combinedParams.ids) {
      // The `ids` query param is only used on the bookmarks(favs) page
      // We want to display bookmarked projects by the time they were bookmarked.
      // There are a few steps to make this happen:
      // 1) first we fetch projects from Pulse API in a batch of size PROJECT_BATCH_SIZE.
      //    (See next few lines.)
      // 2) we sort projects based on the order they were stored in localStorage
      //    and pass the sorted array to <ItemList> to render projects onto the page.
      //    (See updateStateWithNewData(data) method.)
      let begin = (this.state.nextBatchIndex - 1) * PROJECT_BATCH_SIZE;
      let end = this.state.nextBatchIndex * PROJECT_BATCH_SIZE;
      let idsInCurrentBatch = combinedParams.ids.slice(begin, end);

      combinedParams.ids = idsInCurrentBatch.join(`,`);

      return Object.assign(combinedParams, { page: 1 });
    }

    if (combinedParams.moderationState) {
      // "moderationstate" is the query param the API understands (case sensitive)
      // and its value should just be the name of the moderation state
      combinedParams.moderationstate = combinedParams.moderationState.label;
      delete combinedParams.moderationState;
    }

    if (combinedParams.bookmarkedOnly) {
      // bookmarkedOnly is not a query param the API supports
      delete combinedParams.bookmarkedOnly;
    }

    return Object.assign(combinedParams, { page: this.state.nextBatchIndex });
  }

  fetchData(bookmarkedOnly = !!this.props.bookmarkedOnly, params = this.props) {
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
      .get(bookmarkedOnly, combinedParams, this.promiseToken)
      .then(data => {
        this.updateStateWithNewData(data);
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  updateStateWithNewData(data) {
    let moreEntriesToFetch = !!data.next;
    let sorter;

    if (this.props.ids) {
      // sort entries by the time they were bookmarked, from most recently bookmarked
      let ids = this.props.ids.slice();
      sorter = (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
      moreEntriesToFetch =
        this.state.nextBatchIndex * PROJECT_BATCH_SIZE < this.props.ids.length;
    }

    let nextBatchIndex = moreEntriesToFetch
      ? this.state.nextBatchIndex + 1
      : this.state.nextBatchIndex;
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

    // show bookmark prompt when needed
    if (this.props.bookmarkedOnly && currentListInfo.entries.length === 0) {
      this.props.showBookmarkPrompt();
    }
  }

  renderEntryCounter() {
    return <SearchResultCounter
      searchKeyword={this.props.search}
      helpFilter={this.props.help_type}
      totalMatched={this.state.totalMatched}
    />;
  }

  render() {
    return (
      <div>
        {this.props.showCounter && this.renderEntryCounter()}
        <ItemList
          items={this.state.entries}
          loadingData={this.state.loadingData}
          moreItemsToFetch={this.state.moreEntriesToFetch}
          fetchData={() => this.fetchData()}
          onModerationMode={!!this.props.moderationState}
        />
      </div>
    );
  }
}

ProjectLoader.propTypes = {
  featured: PropTypes.string,
  showCounter: PropTypes.bool,
  moderationState: PropTypes.object,
  bookmarkedOnly: PropTypes.bool,
  ids: PropTypes.array
};

export default ProjectLoader;
