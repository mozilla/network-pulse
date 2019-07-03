import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';

class SignOutButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogOutBtnClick(event) {
    event.preventDefault();

    ReactGA.event({
      category: `Account`,
      action: `Logout`,
      label: `Logout ${window.location.pathname}`,
    });

    this.props.user.logout();
    this.props.history.push({
      pathname: `/featured`
    });
  }

  render() {
    return (
      <button className={`btn btn-link inline-link ${this.props.className}`} onClick={(event) => this.handleLogOutBtnClick(event)}>Sign out</button>
    );
  }
}

SignOutButton.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default SignOutButton;
