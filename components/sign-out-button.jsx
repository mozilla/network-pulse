import React from "react";
import PropTypes from "prop-types";
import Analytics from "../js/analytics.js";

class SignOutButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogOutBtnClick(event) {
    event.preventDefault();

    Analytics.ReactGA.event({
      category: `Account`,
      action: `Logout`,
      label: `Logout ${window.location.pathname}`,
    });

    this.props.user.logout();
    this.props.history.push({
      pathname: `/featured`,
    });
  }

  render() {
    return (
      <button
        className={`btn btn-link inline-link ${this.props.className}`}
        onClick={(event) => this.handleLogOutBtnClick(event)}
      >
        Sign out
      </button>
    );
  }
}

SignOutButton.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default SignOutButton;
