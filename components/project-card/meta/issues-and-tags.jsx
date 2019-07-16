import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "../../../js/utility.js";

const IssuesAndTags = props => {
  //TODO: clean this up if possible
  let issues = [];
  let tags = [];

  props.issues.map(issue => {

    if (issue) {
      issue = (
        <Link
          to={`/issues/${Utility.getUriPathFromIssueName(issue)}`}
          key={issue}
        >
          {issue}
        </Link>
      );
    }

    issues.push(issue);
    issues.push(`, `);
  });

  if (issues.length) {
    issues.pop();
  }

  props.tags.map(tag => {
    if (tag) {
      tag = (
        <Link
        to={`/tags/${encodeURIComponent(tag)}`}
        key={tag}
      >
        #{tag}
      </Link>
      );
    }
    
    tags.push(`, `);
    tags.push(tag);
  });

  return (
    <div className="issues-and-tags mb-4 mb-lg-5">
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
