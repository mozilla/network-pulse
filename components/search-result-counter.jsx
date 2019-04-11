import React from 'react';

export default (props) => {
  if (props.totalMatched === null) return null;

  let counterText = `${props.totalMatched} result${props.totalMatched > 1 ? `s` : ``} found`;
  let searchKeyword = props.searchKeyword;

  if (searchKeyword) {
    counterText = `${counterText} for ${searchKeyword}`;
  }

  return <p>{counterText}</p>;
};
