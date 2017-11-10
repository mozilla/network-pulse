import React from 'react';
import { Link } from 'react-router';
import ReactGA from 'react-ga';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class NavLink extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    this.handleInternalPageLinkClick();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  handleInternalPageLinkClick() {
    ReactGA.event({
      category: `Nav Link`,
      action: `Clicked`,
      label: this.props.to
    });
  }

  render() {
    let classes = classNames(`open-sans`, this.props.className);

    return (
      <Link {...this.props}
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
