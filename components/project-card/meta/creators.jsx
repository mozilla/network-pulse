import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Creators = (props) => {
  if (!props.creators) return null;

  let classnames = classNames(`creator d-block`, props.className);
  let labelText = props.showLabelText ? `Created by ` : ``;

  return <p className="my-2"><small className={classnames}>{labelText}{props.creators.join(`, `)}</small></p>;
};

Creators.propTypes = {
  creators: PropTypes.array.isRequired,
  showLabelText: PropTypes.bool
};

Creators.defaultProps = {
  creators: [],
  showLabelText: false
};

export default Creators;
