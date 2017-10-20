import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Creators = (props) => {
  if (props.creators.length === 0) return null;

  let classnames = classNames(`creator d-block open-sans`, props.className);
  let labelText = props.showLabelText ? `Created by ` : ``;

  let creators = props.creators.map((creator)=>{
      // So that creators which are without a profile aren't links
    let url = null;
    if(typeof creator.profile_id === `number` && props.makeLink) {
      url = `/profile/${creator.profile_id}`;
    }
    return <a key={creator.name} href={url}>{creator.name}</a>;
  }).reduce((prev, curr) => [prev, `, `, curr]);

  return <p className="my-2"><small className={classnames}>{labelText}{creators}</small></p>;
};

Creators.propTypes = {
  creators: PropTypes.arrayOf(PropTypes.object).isRequired,
  showLabelText: PropTypes.bool,
  makeLink: PropTypes.bool
};

Creators.defaultProps = {
  creators: [],
  showLabelText: false,
  makeLink: true
};

export default Creators;
