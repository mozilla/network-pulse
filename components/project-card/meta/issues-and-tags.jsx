import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "../../../js/utility.js";

const IssuesAndTags = props => {
  let issues = props.issues.map(issue => {
    return (
      <Link
        to={`/issues/${Utility.getUriPathFromIssueName(issue)}`}
        key={issue}
      >
        {issue}
      </Link>
    );
  });

  let tags = props.tags.map(tag => {
    return (
      <Link
        to={`/tags/${encodeURIComponent(tag)}`}
        key={tag}
      >
        #{tag}
      </Link>
    );
  });

  let classnames = classNames(`issues-and-tags mb-4`, props.className);

  return (
    <div className={classnames}>
      {issues}
      {tags}
    </div>
  );
};

IssuesAndTags.propTypes = {
  issues: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired
};

IssuesAndTags.defaultProps = {
  issues: [],
  tags: []
};

export default IssuesAndTags;
