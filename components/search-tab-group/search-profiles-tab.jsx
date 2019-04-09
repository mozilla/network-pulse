import React from 'react';
import { Helmet } from "react-helmet";
import ProfileLoader from '../profile-loader/profile-loader.jsx';

export default (props) => {
  return (
    <div className="search-profiles-tab">
      <Helmet><title>Profile search</title></Helmet>
      { props.keywordSearched && <ProfileLoader search={props.keywordSearched} showCounter={true} /> }
    </div>
  );
};
