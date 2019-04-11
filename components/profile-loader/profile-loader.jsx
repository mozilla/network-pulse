import React from 'react';
import PropTypes from 'prop-types';
import Service from '../../js/service.js';
import ItemList from '../item-list/item-list.jsx';
import SearchResultCounter from '../../components/search-result-counter.jsx';
import pageSettings from '../../js/app-page-settings';

class ProfileLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      loadingData: false,
      nextBatchIndex: 1,
      items: [],
      moreItemsToFetch: false,
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
      this.fetchData(nextProps);
    });
  }

  createQueryParams(params) {
    return Object.assign({}, params, { page: this.state.nextBatchIndex });
  }

  fetchData(params = this.props) {
    let combinedParams = this.createQueryParams(params);

    if (this.promiseToken) {
      // Since we are making asynchronous calls to fetch data,
      // we want to make sure exisiting fetch call is cancelled before we start a new one.
      // This prevents any unfinished request to incorrectly update the component state
      // when it returns.
      this.promiseToken.cancel();
    }

    // "refresh" token before passing it to Service.profiles.get()
    this.promiseToken = {};

    // we are about to make a new request, set loadingData to true.
    this.setState({ loadingData: true });

    Service.profiles
      .get(combinedParams, this.promiseToken)
      .then((data) => {
        this.updateStateWithNewData(data);
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  updateStateWithNewData(data) {
    let moreItemsToFetch = !!data.next;

    let nextBatchIndex = moreItemsToFetch ? this.state.nextBatchIndex+1 : this.state.nextBatchIndex;

    let currentListInfo = {
      items: this.state.items.concat(data.results),
      nextBatchIndex: nextBatchIndex,
      moreItemsToFetch: moreItemsToFetch,
      totalMatched: data.count
    };

    // store current project list's info in pageSettings
    pageSettings.setCurrentList(currentListInfo);

    // update component's state
    currentListInfo.loadingData = false;
    this.setState(currentListInfo);
  }

  renderCounter() {
    return <SearchResultCounter
      searchKeyword={this.props.search}
      totalMatched={this.state.totalMatched}
    />;
  }

  render() {
    return (
      <div>
        { this.props.showCounter && this.renderCounter() }
        <ItemList
          type="profile"
          items={this.state.items}
          loadingData={this.state.loadingData}
          moreItemsToFetch={this.state.moreItemsToFetch}
          fetchData={() => this.fetchData()}
        />
      </div>
    );
  }
}

ProfileLoader.propTypes = {
  showCounter: PropTypes.bool,
};

export default ProfileLoader;
