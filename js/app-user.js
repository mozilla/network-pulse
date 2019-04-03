import qs from "qs";
import env from './env-client';
import localstorage from './localstorage.js';
import Service from './service.js';

const loginUrl = env.PULSE_LOGIN_URL;

/**
 * A set of helper functions for fascilitating login and logout
 * for users. This object should never be used directly, it should
 * only be used by User objects.
 */
const Login = {
  /*
   * Generates the oauth url for logging a user in, with a redirect-when-finished URL
   */
  getLoginURL(redirectUrl) {
    return `${loginUrl}?next=${encodeURIComponent(redirectUrl)}`;
  },

  /*
   * Check to see whether a user is logged in, with a callback
   * setUserData(error, username). If the user is not logged in
   * the username will be falsey.
   */
  isLoggedIn(location, history, setUserData) {
    if (location) {
      // Make sure that oauth loggedin=True/False query parameters are
      // removed from the current URL, as they should not end up in
      // bookmarks etc.
      let query = qs.parse(location.search.substring(1));

      if (query.loggedin) {
        delete query.loggedin;
        location.search = `?${qs.stringify(query)}`;
        history.replace(location);
      }
    }

    // verify user's logged in status with Pulse API
    Service.userstatus()
      .then(response => {
        setUserData(false, response);
      })
      .catch(reason => {
        console.error(reason);
        setUserData(reason);
      });
  },

  /*
   * Log a user out, with a callback onLogout(error).
   *
   * Note that callers should *immediately* treat users
   * as logged out when this gets called. They should not
   * wait for a callback. The callback is only for dealing
   * with network errors that might occur during logout.
   */
  logout(onError) {
    Service.logout()
      .then(() => {
        // nothing happens here, the caller will already
        // be treating the user as logged out, and no
        // callback is necessary or expected.
      })
      .catch(reason => {
        console.error(reason);
        onError(reason);
      });
  }
};

/**
 * A user class for our application - an app running in the browser or in a webview
 * only ever has one user, never multiple concurrent users, so we can defined its
 * class here, and then export a singleton user for shared use in all pages.
 */
class User {
  constructor() {
    this.listeners = [];
    this.resetUser();
  }

  resetUser(justLoggedOut) {
    this.name = undefined;
    this.email = undefined;
    this.profileid = undefined;
    this.loggedin = justLoggedOut ? false : undefined;
    this.moderator = false;
    this.failedLogin = false;
    // We do not touch the "attemptingLogin" value in localStorage.
    // It is up to the login/verify/logout/update functions to
    // manipulate that value.
  }

  // register listeners
  addListener(o) {
    this.listeners.push(o);
  }

  // unregister listeners
  removeListener(o) {
    this.listeners.splice(this.listeners.indexOf(o),1);
  }

  // notify all listeners of a change for this user
  notifyListeners(evtName) {
    this.listeners.forEach( listener => {
      if (listener.updateUser) {
        listener.updateUser(evtName, this);
      }
    });
  }

  login(redirectUrl) {
    // we record that the user started a login in localStorage,
    // then the app gets closed and oauth happens. Once the
    // oauth callback drops the user back at a URL that loads
    // the app again, pages can run `user.verify` to finalise
    // the login process.
    localstorage.setItem(`pulse:user:attemptingLogin`, `True`);
    window.location = Login.getLoginURL(redirectUrl);
  }

  verify(location, history) {
    Login.isLoggedIn(location, history, (error, userData) => {
      this.update(error, userData);
    });
  }

  logout() {
    this.resetUser(true);

    // notify listeners that this user has been logged out
    this.notifyListeners(`logged out`);

    Login.logout(error => {
      alert(`Sorry, we encountered an error while logging you out!`);
      console.log(`logout error:`, error);
    });
  }

  update(error, userData = {}) {
    if (error) {
      console.log(`login error:`, error);
    }

    // Is this a failed login attempt?
    let attemptingLogin = !!localStorage[`pulse:user:attemptingLogin`];

    if (attemptingLogin && !userData.username) {
      this.failedLogin = true;
    }
    localstorage.removeItem(`pulse:user:attemptingLogin`);

    // bind the user values
    this.loggedin = !!userData.loggedin;
    this.moderator = !!userData.moderator;
    this.name = userData.customname || userData.username; // use user's custom name if it exists. otherwise fall back to user's user name
    this.email = userData.email;
    this.profileid = userData.profileid;

    // notify listeners that this user logged in state has been verified
    this.notifyListeners(`verified`);
  }

  getLoginURL(redirectUrl) {
    return Login.getLoginURL(redirectUrl);
  }
}

// An app will only ever have a single user, so we
// create a single one and use this as our export.
const user = new User();

export default user;
