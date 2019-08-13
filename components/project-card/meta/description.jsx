import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Description = props => {
  let paragraphs = props.description.split(`\n`).map(paragraph => {
    if (!paragraph) return null;

    return <p key={paragraph} className="body-large">{paragraph}</p>;
  });

  if (paragraphs.length < 1) return null;

  return (
    <div className={classNames(`description`, props.className)}>
      {paragraphs}
    </div>
  );
};

Description.propTypes = {
  Description: PropTypes.string
};

Description.defaultProps = {
  Description: ``
};

export default Description;
