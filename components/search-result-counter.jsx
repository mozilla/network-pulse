import React from "react";

export default (props) => {
  if (props.totalMatched === null) return null;

  let counterText = `${props.totalMatched} result${
    props.totalMatched > 1 ? `s` : ``
  } found`;
  let searchKeyword = props.searchKeyword;
  let helpType = props.helpFilter;
  let counterTextWQuery = `${counterText} for `;

  if (searchKeyword) {
    counterText = counterTextWQuery + searchKeyword;
    return <p className="query-text">{counterText}</p>;
  }

  if (helpType) {
    return (
      <p className="query-text">
        {counterTextWQuery}
        <span className="help-query">{helpType}</span>
      </p>
    );
  }
  return null;
};
