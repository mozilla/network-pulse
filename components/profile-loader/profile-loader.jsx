import React from 'react';
import PropTypes from 'prop-types';
import Service from '../../js/service.js';
// import ProfileList from '../project-list/project-list.jsx';
import pageSettings from '../../js/app-page-settings';
// import env from '../../js/env-client';

import SearchResultCounter from '../../components/search-result-counter.jsx';
import LoadingNotice from '../../components/loading-notice.jsx';

// const PROFILE_BATCH_SIZE = env.PROFILE_BATCH_SIZE;

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
    let sorter;

    let nextBatchIndex = moreItemsToFetch ? this.state.nextBatchIndex+1 : this.state.nextBatchIndex;

    // [TODO] FIXME when pagination on Pulse API profile search is working
    // let newItems = sorter ? data.results.sort(sorter) : data.results;
    let newItems = sorter ? data.sort(sorter) : data;

    let currentListInfo = {
      items: this.state.items.concat(newItems),
      nextBatchIndex: nextBatchIndex,
      moreItemsToFetch: moreItemsToFetch,
      // totalMatched: data.count
      totalMatched: data.length
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

  renderThumbnail(thumbnail = ``) {
    let style = {};

    if (thumbnail) {
      style = {
        backgroundImage: `url(${thumbnail})`
      };
    }

    return <div className="thumbnail mx-auto" style={style}></div>;
  }

  renderProfileBlurb(bio = ``) {
    let paragraphs = bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    if (paragraphs.length < 1) return null;

    return <div className="blurb">{paragraphs}</div>;
  }

  renderProfileCards() {
    // [TODO] FIXME when pagination on Pulse API profile search is working
    return this.state.items.map(item => {
      console.log(item);
      return <div className="profile-card bio col-md-8 my-5" key={item.profile_id}>
        <div className="row">
          <div className="col-6 offset-3 col-md-3 offset-md-0 mb-4 mb-md-0">
            { this.renderThumbnail(item.thumbnail) }
          </div>
          <div className="col-md-9">
            <h4 className="name">({item.profile_id}) {item.custom_name}</h4>
            { this.renderProfileBlurb(item.user_bio) }
          </div>
        </div>
      </div>
    });
  }

  renderLoadingNotice() {
    if (!this.state.loadingData ) return null;

    return <LoadingNotice />;
  }

  render() {
    console.log(`this.state.items`, this.state.items);

    return (
      <div>
        { this.props.showCounter && this.renderCounter() }
        { this.state.items &&
            <div className="row">{this.renderProfileCards()}</div>
        }
        { this.renderLoadingNotice() }
      </div>
    );
  }
}

ProfileLoader.propTypes = {
  showCounter: PropTypes.bool,
};

export default ProfileLoader;
