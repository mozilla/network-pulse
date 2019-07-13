import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

const Creators = props => {
  if (props.creators.length === 0) return null;

  let labelText = props.showLabelText ? `Created by ` : ``;
  let creators = [];

  props.creators.forEach(creator => {
    // Link to creators with a profile, plain text name if without.
    let name = creator.name;
    let creatorLabel = name;

    if (
      typeof creator.profile_id === `number` &&
      creator.is_active &&
      props.makeLink
    ) {
      creatorLabel = (
        <Link
          key={name}
          to={`/profile/${creator.profile_id}`}
          onClick={event => props.creatorClickHandler(event, name)}
        >
          {name}
        </Link>
      );
    }
    creators.push(creatorLabel);
    creators.push(`, `);
  });

  if (creators.length) {
    creators.pop();
  }

  return (
    <p>
      {labelText}
      {creators}
    </p>
  );
};

Creators.propTypes = {
  creators: PropTypes.arrayOf(PropTypes.object).isRequired,
  showLabelText: PropTypes.bool,
  makeLink: PropTypes.bool,
  creatorClickHandler: PropTypes.func.isRequired
};

Creators.defaultProps = {
  creators: [],
  showLabelText: false,
  makeLink: true
};

export default Creators;
