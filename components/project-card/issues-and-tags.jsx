import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Utility from '../../js/utility.js';

const IssuesAndTags = (props) => {
  let issues = props.issues.map(issue => {
    return <Link to={`/issues/${Utility.getUriPathFromIssueName(issue)}`} className="btn btn-xs btn-tag" key={issue}>{issue}</Link>;
  });

  let tags = props.tags.map(tag => {
    return <Link to={`/tags/${encodeURIComponent(tag)}`} className="btn btn-xs btn-tag" key={tag}>{tag}</Link>;
  });

  let classnames = classNames(`issues-and-tags`, props.className);

  return <div className={classnames}>{issues}{tags}</div>;
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
