import React from 'react';
import ReactGA from 'react-ga';
import { IndexLink } from 'react-router';
import classNames from 'classnames';
import NavLink from '../nav-link/nav-link.jsx';
import user from '../../js/app-user';
import utility from '../../js/utility';

class NavListItem extends React.Component {
  render() {
    return (
      <li className={classNames(`d-inline-block mb-0 mr-4`, this.props.className)}>{this.props.children}</li>
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user };
  }

  componentDidMount() {
    user.addListener(this);
    user.verify();
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified` ) {
      this.setState({ user });
    }
  }

  renderModeratorLink() {
    if (!user.moderator) return null;

    return <NavListItem><NavLink to="/moderation">Moderation</NavLink></NavListItem>;
  }

  renderName() {
    // don't show anything until we verify this user's loggedin status
    if (user.loggedin === undefined) return null;

    let link = <a href={user.getLoginURL(utility.getCurrentURL())} onClick={(event) => this.handleSignInBtnClick(event)}>Signup / Signin</a>;

    if (user.loggedin) {
      link = <NavLink to="/profile/me">Hi, {user.name}</NavLink>;
    }

    return <NavListItem className="signupin-user">{link}</NavListItem>;
  }

  handleSignInBtnClick(event) {
    event.preventDefault();

    ReactGA.event({
      category: `Account`,
      action: `Login`,
      label: `Login ${window.location.pathname}`,
      transport: `beacon`
    });

    user.login(utility.getCurrentURL());
  }

  render() {
    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // That's why a link like <NavLink to="/favs" className="text-nav-link bookmarks">Favs</NavLink> is seen here.
    // For more info see: https://github.com/mozilla/network-pulse/issues/326

    return (
      <div className="navbar">
        <div className="container">
          <div className="row open-sans">
            <div className="col-md-12 col-lg-3">
              <IndexLink to="/" className="d-inline-block"><img src="/assets/svg/pulse-wordmark.svg" alt="Mozilla Pulse" className="img-fluid logo" /></IndexLink>
            </div>
            <ul className="nav-link-list col-md-12 col-lg-9 mt-3 mt-lg-0 mb-0">
              <NavListItem><NavLink to="/featured">Featured</NavLink></NavListItem>
              <NavListItem><NavLink to="/latest">Latest</NavLink></NavListItem>
              <NavListItem><NavLink to="/issues">Issues</NavLink></NavListItem>
              <NavListItem><NavLink to="/favs" className="bookmarks">Favs</NavLink></NavListItem>
              <NavListItem><NavLink to="/search" className="btn-search"><i className="fa fa-search"/><span className="sr-only">Search</span></NavLink></NavListItem>
              { this.renderModeratorLink() }
              { this.renderName() }
              <NavListItem><NavLink to="/add" className="btn-add"><img src="/assets/svg/icon-plus.svg" /></NavLink></NavListItem>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default NavBar;
