import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "../../../js/utility.js";

const IssuesAndTags = props => {
  if (props.issues.length + props.tags.length === 0) return null;

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

  let classnames = classNames(`issues-and-tags`, props.className);
  let issues_and_tags = issues.concat(tags);

  issues_and_tags = issues_and_tags.reduce((accu, curr) => [accu, ", ", curr]);

  return (
    <section className={classnames}>
      <div className="container">
        <div className="offset-lg-2">
          {issues_and_tags}
        </div>
      </div>
    </section>
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
