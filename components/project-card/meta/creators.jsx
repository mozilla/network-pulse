import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Creators = (props) => {
  if (props.creators.length === 0) return null;

  let classnames = classNames(`creator d-block open-sans`, props.className);
  let labelText = props.showLabelText ? `Created by ` : ``;
  let creators = [];

  props.creators.forEach((creator)=>{
    // Link to creators with a profile, plain text name if without.
    let url = null;
    if(typeof creator.profile_id === `number` && props.makeLink) {
      url = `/profile/${creator.profile_id}`;
    }
    creators.push( <a key={creator.name} href={url}>{creator.name}</a> );
    creators.push( `, `);
  });

  if (creators.length) {
    creators.pop();
  }

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
