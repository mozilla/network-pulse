import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Creators = (props) => {
  if (props.creators.length === 0) return null;

  let classnames = classNames(`creator d-block open-sans`, props.className);
  let labelText = props.showLabelText ? `Created by ` : ``;
  let joinedCreators;

  if (typeof props.creators[0] === `string` ) {
    joinedCreators = props.creators.join(`, `);
  } else {
    let creators = [];
    for (let creator of props.creators){
      creators.push(<a href={creator.profile_id}>{creator.name}</a>);
    }
    // Because react doesn't like to render comma separated JSX objects easily
    joinedCreators = creators.slice(1).reduce(function(prev, current) {
      return prev.concat([`, `, current]);
    }, [creators[0]]);

  }
  return <p className="my-2"><small className={classnames}>{labelText}{joinedCreators}</small></p>;
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
