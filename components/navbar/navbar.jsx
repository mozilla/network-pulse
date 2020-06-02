import React from "react";
import ReactGA from "react-ga";
import { NavLink as ReactRouterNavLink } from "react-router-dom";
import classNames from "classnames";
import NavLink from "../nav-link/nav-link.jsx";
import user from "../../js/app-user";
import utility from "../../js/utility";
import SignOutButton from "../sign-out-button.jsx";

class NavListItem extends React.Component {
  render() {
    return (
      <li className="dark-theme mb-4 ml-3 ml-sm-4 pl-md-2">
        {this.props.children}
      </li>
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user,
      burgerActive: false,
      verified: false
    };
  }

  componentDidMount() {
    user.addListener(this);
    user.verify(this.props.location, this.props.history);
  }

  componentWillUnmount() {
    user.removeListener(this);
  }

  updateUser(event) {
    // this updateUser method is called by "user" after changes in the user state happened
    if (event === `verified`) {
      this.setState({
        user,
        verified: true
      });
    }
  }

  renderName() {
    if (user.loggedin === undefined) {
      // If the user is not logged in, there is no name to render.
      return null;
    }

    let classes = "signupin-glyph d-none d-md-flex align-items-md-center";

    let link = (
      <a
        href={user.getLoginURL(utility.getCurrentURL())}
        onClick={event => this.handleSignInBtnClick(event)}
        className={classes}
      >
        Signin / Signup
      </a>
    );

    if (user.loggedin) {
      link = (
        <NavLink
          to={`/profile/${user.profileid}`}
          onClick={() => this.handleMobileNavLinkClick()}
          className={classes}
        >
          {user.name}
        </NavLink>
      );
    }

    return (
      <li className="signupin-user d-inline-block mb-0 mr-md-4">{link}</li>
    );
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

  handleBurgerClick() {
    this.setState({ burgerActive: !this.state.burgerActive }, () => {
      // prevent the layer underneath the nav menu overlay from scrolling
      let body = document.querySelector(`body`);

      body.setAttribute(`aria-hidden`, !this.state.burgerActive);
      body.style.overflow = this.state.burgerActive ? `hidden` : `auto`;
    });
  }

  handleMobileNavLinkClick() {
    // FIXME? Probably not the best way to do this but we currently rely on
    // this.state.burgerActive to tell if mobile nav menu is active or not
    // (this.state.burgerActive is toggled by clicking on the "burger" icon.
    // This icon is visible on mobile devices only.)
    if (this.state.burgerActive) {
      // make sure the full screen nav menu is hidden after a nav link has been selected
      this.handleBurgerClick();
    }
  }

  renderNavContent() {
    let classes = classNames(`nav-link-list px-3 hidden-lg-up dark-theme`, {
      show: this.state.burgerActive
    });

    let content = null;

    if (this.state.verified) {
      content = user.loggedin
        ? this.renderNavLinks()
        : this.renderSignInRequest();
    }

    return <div className={classes}>{content}</div>;
  }

  renderNavLinks() {
    let MainNavLink = props => (
      <NavLink {...props} onClick={() => this.handleMobileNavLinkClick()}>
        {props.children}
      </NavLink>
    );

    let moderatorLink = user.moderator ? (
      <NavListItem>
        <MainNavLink to="/moderation">Moderation</MainNavLink>
      </NavListItem>
    ) : null;

    return (
      <div className="row">
        <div className="col">
          <ul className="nav-link-list-container pt-4">
            <NavListItem className="dark-theme">
              <MainNavLink to={`/profile/${user.profileid}`}>
                Profile
              </MainNavLink>
            </NavListItem>
            <NavListItem className="dark-theme">
              <MainNavLink to="/myprofile">Edit Profile</MainNavLink>
            </NavListItem>
            <NavListItem className="dark-theme">
              <MainNavLink to="/favs">Favs</MainNavLink>
            </NavListItem>
            <NavListItem>
              <SignOutButton
                user={this.state.user}
                history={this.props.history}
                className="link"
              />
            </NavListItem>
            {moderatorLink}
          </ul>
        </div>
      </div>
    );
  }

  renderSignInRequest() {
    return (
      <div className="signupin-request text-center">
        <h3>Signup or Signin to your Pulse Account</h3>
        <p>Share your projects or help out on other projects in our Network.</p>
        <a
          href={user.getLoginURL(utility.getCurrentURL())}
          onClick={event => this.handleSignInBtnClick(event)}
          className="btn btn-secondary"
        >
          Signin / Signup
        </a>
      </div>
    );
  }

  renderBurger() {
    let classes = classNames(`burger d-md-none ml-md-0`, {
      "menu-open": this.state.burgerActive
    });
    return (
      <button className={classes} onClick={() => this.handleBurgerClick()}>
        <div className="burger-bar burger-bar-top" />
        <div className="burger-bar burger-bar-middle" />
        <div className="burger-bar burger-bar-bottom" />
      </button>
    );
  }

  render() {
    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // That's why a link like <NavLink to="/favs">Favs</NavLink> is seen here.
    // For more info see: https://github.com/mozilla/network-pulse/issues/326

    return (
      <div className="navbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6" id="main-nav-wrapper">
              <div className="d-flex align-items-center">
                {this.renderBurger()}
                <ReactRouterNavLink to="/" className="d-inline-block">
                  <img
                    src="/assets/svg/pulse-logo-mobile.svg"
                    alt="Mozilla Pulse"
                    className="logo-mobile d-md-none"
                    width="40"
                  />
                  <img
                    src="/assets/svg/pulse-logo.svg"
                    alt="Mozilla Pulse"
                    className="logo d-none d-md-block"
                    width="187"
                  />
                </ReactRouterNavLink>
              </div>
              {this.renderNavContent()}
            </div>
            <div className="col-6">
              <ul className="list-unstyled d-flex justify-content-end align-items-center mb-0">
                {this.renderName()}
                <li className="d-inline-block mb-0">
                  <NavLink to="/add" className="btn btn-secondary">
                    Add new
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default NavBar;
