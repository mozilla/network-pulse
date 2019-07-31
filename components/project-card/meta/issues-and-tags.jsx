import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "../../../js/utility.js";

const IssuesAndTags = props => {
  let issues = [];
  let tags = [];

  props.issues.map(issue => {

    // Creates individual issue
    issue = (
      <Link
      to={`/issues/${Utility.getUriPathFromIssueName(issue)}`}
      key={issue}
    >
      {issue}
    </Link>
    );

    // Pushes individual issue followed by comma
    issues.push(issue);
    issues.push(`, `);
  });

  // If issues array full length, remove last comma
  if (issues.length) {
    issues.pop();
  }

  props.tags.map(tag => {

    // Creates individual tag
    tag = (
      <Link
        to={`/tags/${encodeURIComponent(tag)}`}
        key={tag}
      >
        #{tag}
      </Link>
    );
    
    // Adds comma before tag since issues.arr will never end in a comma
    tags.push(`, `);
    tags.push(tag);
  });

  // However, if issues is empty, remove the first comma in tags.arr
  if (issues.length == 0) {
    tags.shift();
  }

  let classnames = classNames(`issues-and-tags`, props.className);

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
