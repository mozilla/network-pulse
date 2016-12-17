import React from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import ProjectList from '../../components/project-list/project-list.jsx';

export default React.createClass({
  getInitialState() {
    return {
      searchQuery: ``
    };
  },
  componentWillReceiveProps(nextProps) {
    // this makes sure searchQuery is updated accordingly when
    // browser's back / forward button is triggered
    this.setSearchQuery(nextProps.location.query.keyword);
  },
  componentDidMount() {
    this.setSearchQuery(this.props.location.query.keyword);
  },
  setSearchQuery(searchQuery) {
    this.searchInput.focus();
    this.searchInput.value = searchQuery ? decodeURIComponent(searchQuery) : ``;
    this.setState({searchQuery: searchQuery});
  },
  clearSearch() {
    this.searchInput.value = ``;
    this.searchInput.blur();
  },
  updateSearchQuery(event) {
    if (!event.keyCode || event.keyCode === 27) { // escape
      this.clearSearch();
    }

    let location = {
      pathname: this.props.router.location.pathname
    };
    let query = this.searchInput.value;

    if ( event.keyCode === 13 ) { // enter
      location[`query`] = { keyword: query };
    }

    if (!event.keyCode || event.keyCode === 27 || event.keyCode === 13) {
      browserHistory.push(location);
    }

    this.setState({
      searchQuery: query
    });
  },
  render() {
    return (
      <div className="search-page">
        <div className={classNames({activated: true, 'search-bar': true})}>
          <div className="container">
            <input id="search-box"
                    placeholder="Search keywords, people, tags..."
                    onKeyUp={this.updateSearchQuery}
                    ref={(searchInput) => { this.searchInput = searchInput; }} />
            <a className="btn dismiss" onClick={this.updateSearchQuery}>&times;</a>
          </div>
        </div>
        <div className="container">
          <ProjectList filter={{key: `search`, value: this.state.searchQuery}} onSearch={true} />
        </div>
      </div>
    );
  }
});
