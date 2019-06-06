import React from "react";
import PropTypes from "prop-types";

const WhyInteresting = props => {
  if (!props.interest) return null;

  return <p className="interest">{props.interest}</p>;
};

WhyInteresting.propTypes = {
  interest: PropTypes.string.isRequired
};

WhyInteresting.defaultProps = {
  interest: ``
};

export default WhyInteresting;
