import React from 'react';
import { Helmet } from "react-helmet";

export default (Loader, type) => (props) => {
  const { keywordSearched } = props;
  type = type.toLowerCase();

  return (
    <div className={`search-${type}-tab`}>
      <Helmet><title>{type.charAt(0).toUpperCase()+type.slice(1)} search</title></Helmet>
      <Loader search={keywordSearched} showCounter={true}/>
    </div>
  );
};
