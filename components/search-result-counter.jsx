import React from 'react';

export default (props) => {
  if (props.totalMatched === null) return null;

  let counterText = `${props.totalMatched} result${props.totalMatched > 1 ? `s` : ``} found`;
  let searchKeyword = props.searchKeyword;
  let counterTextWQuery = `${counterText} for `
  
  return (
    <p> 
      { searchKeyword ? counterTextWQuery : counterText }
      <span className={ searchKeyword ? `query` : `d-none`}>
        { searchKeyword ? searchKeyword : null }
      </span>
    </p>
  );
};
