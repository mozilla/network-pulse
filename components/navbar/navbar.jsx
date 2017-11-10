import React from 'react';
import ReactGA from 'react-ga';
import { IndexLink } from 'react-router';
import classNames from 'classnames';
import NavLink from '../nav-link/nav-link.jsx';
import user from '../../js/app-user';
import utility from '../../js/utility';

class NavListItem extends React.Component {
  render() {
    let classes = classNames(`d-inline-block my-md-0`, this.props.className, {
      "my-2 my-md-0 mr-md-4": !this.props.noMargin
    });

    return (
      <li className={classes}>{this.props.children}</li>
    );
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

  renderName(classes) {
    // don't show anything until we verify this user's loggedin status
    if (user.loggedin === undefined) return null;

    let link = <a href={user.getLoginURL(utility.getCurrentURL())} onClick={(event) => this.handleSignInBtnClick(event)}>Signup / Signin</a>;

    if (user.loggedin) {
      link = <NavLink to="/profile/me">Hi {user.name}</NavLink>;
    }

    return <NavListItem className={classNames(`signupin-user`, classes)}>{link}</NavListItem>;
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

  renderNavList() {
    let classes = classNames(`nav-link-list list-unstyled ml-lg-4 mt-md-3 mt-lg-0 mb-0`, {
      "d-flex": this.state.burgerActive,
      "flex-column": this.state.burgerActive
    });

    return <ul className={classes}>
      <div className="d-flex justify-content-end mb-2 hidden-md-up">
        <button className="btn btn-link" id="btn-dismiss" onClick={() => this.handleBurgerClick()}><img src="/assets/svg/x.svg" width="23" /></button>
      </div>
      { this.renderName(`hidden-md-up`) }
      <NavListItem><NavLink to="/featured">Featured</NavLink></NavListItem>
      <NavListItem><NavLink to="/latest">Latest</NavLink></NavListItem>
      <NavListItem><NavLink to="/issues">Issues</NavLink></NavListItem>
      <NavListItem><NavLink to="/favs" className="bookmarks">Favs</NavLink></NavListItem>
      <NavListItem><NavLink to="/search" className="btn-search"><i className="fa fa-search"/><span className="sr-only">Search</span></NavLink></NavListItem>
      { this.renderModeratorLink() }
    </ul>;
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
          <div className="row open-sans align-items-center">
            <div className="col-12 col-lg-9 d-flex flex-column flex-lg-row" id="main-nav-wrapper">
              <IndexLink to="/" className="d-inline-block">
                <img src="/assets/svg/pulse-logo-mobile.svg" alt="Mozilla Pulse" className="logo hidden-md-up" width="40" />
                <img src="/assets/svg/pulse-logo.svg" alt="Mozilla Pulse" className="logo hidden-sm-down" width="187" />
              </IndexLink>
              { this.renderNavList() }
            </div>
            <div className="pinned col-12 col-lg-3">
              <ul className="list-unstyled d-flex justify-content-end align-items-center mb-0">
                { this.renderName(`hidden-sm-down`) }
                <NavListItem noMargin={true}><NavLink to="/add" className="btn-add d-inline-block"><span className="sr-only">Add</span></NavLink></NavListItem>
                <NavListItem noMargin={true}><button className={classNames(`hidden-md-up`, { active: this.state.burgerActive})} id="burger" onClick={() => this.handleBurgerClick()}></button></NavListItem>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <hr className="hr-gradient"></hr>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default NavBar;
