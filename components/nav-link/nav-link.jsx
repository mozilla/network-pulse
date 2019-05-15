import React from "react";
import { NavLink as ReactRouterNavLink } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";

class NavLink extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    let classes = classNames(`open-sans`, this.props.className);

    return (
      <ReactRouterNavLink
        {...this.props}
        className={classes}
        activeClassName="active"
        onClick={() => this.handleClick()}
      />
    );
  }
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default NavLink;
