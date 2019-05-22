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
      <a onClick={(event) => this.handleLogOutBtnClick(event)} href="">Sign out</a>
    );
  }
}

SignOutButton.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default SignOutButton;
