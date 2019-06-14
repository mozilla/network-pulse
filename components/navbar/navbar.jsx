import React from "react";
import ReactGA from "react-ga";
import { NavLink as ReactRouterNavLink } from "react-router-dom";
import classNames from "classnames";
import NavLink from "../nav-link/nav-link.jsx";
import user from "../../js/app-user";
import utility from "../../js/utility";
import SignOutButton from "../sign-out-button.jsx"

class NavListItem extends React.Component {
  render() {
    let classes = classNames(`d-inline-block`, this.props.className, {
      "my-2 my-md-0 mr-md-4": !this.props.noMargin
    });

    return <li className={classes}>{this.props.children}</li>;
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user,
      burgerActive: false
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
      this.setState({ user });
    }
  }

  renderName(classes) {
    // don't show anything until we verify this user's loggedin status
    if (user.loggedin === undefined) return null;

    let link = (
      <a
        href={user.getLoginURL(utility.getCurrentURL())}
        onClick={event => this.handleSignInBtnClick(event)}
      >
      Signin / Signup
      </a>
    );

    if (user.loggedin) {
      link = (
        <NavLink
          to={`/profile/${user.profileid}`}
          onClick={() => this.handleMobileNavLinkClick()}
          className="signupin d-flex align-items-center"
        >
          {user.name}
        </NavLink>
      );
    }

    return (
      <NavListItem className={classNames(`signupin-user`, classes)}>
        {link}
      </NavListItem>
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

  renderNavList() {
    let classes = classNames(
      `nav-link-list list-unstyled ml-lg-4 mt-md-3 mt-lg-0 mb-0 hidden-md-up`,
      {
        "d-flex": this.state.burgerActive,
        "flex-column": this.state.burgerActive
      }
    );

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
      <ul className={classes}>
        {/* <div className="d-flex justify-content-end mb-2 hidden-md-up">
          <button id="btn-dismiss" className="burger hidden-lg-up ml-md-0" onClick={() => this.handleBurgerClick()}>    
            <div className="burger-bar burger-bar-top"></div>
            <div className="burger-bar burger-bar-middle"></div>
            <div className="burger-bar burger-bar-bottom"></div>
          </button>
        </div> */}
        <NavListItem className="dark-theme">
          <MainNavLink to={`/profile/${user.profileid}`}>Profile</MainNavLink>
        </NavListItem>
        <NavListItem className="dark-theme">
          <MainNavLink to="/myprofile">Edit Profile</MainNavLink>
        </NavListItem>
        <NavListItem className="dark-theme">
          <MainNavLink to="/favs">Favs</MainNavLink>
        </NavListItem>
        <NavListItem className="dark-theme">
          <SignOutButton user={this.props.user} history={this.props.history}/>
        </NavListItem>
        {moderatorLink}
      </ul>
    );
  }

  render() {
    // We have renamed all non user facing "favorites" related variables and text (e.g., favs, faved, etc) to "bookmarks".
    // This is because we want client side code to match what Pulse API uses (i.e., bookmarks)
    // For user facing bits like UI labels and URL path we want them to stay as "favorites".
    // That's why a link like <NavLink to="/favs" className="text-nav-link bookmarks">Favs</NavLink> is seen here.
    // For more info see: https://github.com/mozilla/network-pulse/issues/326

    return (
      <div className="navbar mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-6"
              id="main-nav-wrapper"
            >
              <div className="d-flex align-items-center">
                <button id="btn-dismiss" className="burger hidden-lg-up mr-3 ml-md-0" onClick={() => this.handleBurgerClick()}>    
                  <div className="burger-bar burger-bar-top"></div>
                  <div className="burger-bar burger-bar-middle"></div>
                  <div className="burger-bar burger-bar-bottom"></div>
                </button>
                <ReactRouterNavLink to="/" className="d-inline-block">
                  <img
                    src="/assets/svg/pulse-logo-mobile.svg"
                    alt="Mozilla Pulse"
                    className="logo-mobile hidden-md-up"
                    width="40"
                  />
                  <img
                    src="/assets/svg/pulse-logo.svg"
                    alt="Mozilla Pulse"
                    className="logo hidden-sm-down"
                    width="187"
                  />
                </ReactRouterNavLink>
              </div>
              {this.renderNavList()}
            </div>
            <div className="col-6">
              <ul className="list-unstyled d-flex justify-content-end align-items-center mb-0">
                {this.renderName(`hidden-sm-down`)}
                <NavListItem noMargin={true} className="my-0">
                  <NavLink to="/add" className="btn btn-secondary d-inline-block">Add New</NavLink>
                </NavListItem>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default NavBar;
