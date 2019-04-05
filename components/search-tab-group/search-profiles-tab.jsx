import React from 'react';
import ProfileLoader from '../profile-loader/profile-loader.jsx';

class SearchProfilesTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="search-profiles-tab">
      <ProfileLoader
        search={this.props.keywordSearched}
        showCounter={true}
      />
    </div>;
  }
}

export default SearchProfilesTab;
