import { browserHistory } from 'react-router';
import env from "../config/env.generated.json";
import Service from './service.js';

// shim localStorage for server-side generation
let storage;
if (typeof localStorage !== `undefined`) {
  storage = localStorage;
} else {
  let data = {};
  storage =  {
    data: data,
    setItem(key, val) { data[key] = val; },
    getItem(key) { return data[key] || null; },
    removeItem(key) { delete data[key]; }
  };
}

/**
 * A set of helper functions for fascilitating login and logout
 * for users. This object should never be used directly, it should
 * only be used by User objects.
 */
const Login = {
  /**
   * Generates the oauth url for logging a user in, with a redirect-when-finished URL
   */
  getLoginURL(redirectUrl = env.ORIGIN) {
    if (typeof window !== `undefined`) {
      redirectUrl = window.location.toString();
    }
    return `${env.PULSE_API}/login?original_url=${encodeURIComponent(redirectUrl)}`;
  },

  /**
   * Check to see whether a user is logged in, with a callback
   * setUserData(error, username). If the user is not logged in
   * the username will be falsey.
   */
  isLoggedIn(location, setUserData) {
    if (location) {
      // Make sure that oauth loggedin=True/False query parameters are
      // removed from the current URL, as they should not end up in
      // bookmarks etc.
      const query = location.query;
      if (query.loggedin) {
        delete location.query.loggedin;
        browserHistory.replace({
          pathname: location.pathname,
          query: query
        });
      }
    }

    // verify user's logged in status with Pulse API
    Service.userstatus()
      .then(response => {
        setUserData(false, response.username);
      })
      .catch(reason => {
        console.error(reason);
        setUserData(reason);
      });
  },

  /**
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
    this.reset();
  }

  reset() {
    this.username = undefined;
    this.loggedin = false;
    this.failedLogin = false;
    // We do not touch the "attemptingLogin" value in localStorage.
    // It is up to the login/verify/logout/update functions to
    // manipulate that value.
  }

  login(redirectUrl) {
    // we record that the user started a login in localStorage,
    // then the app gets closed and oauth happens. Once the
    // oauth callback drops the user back at a URL that loads
    // the app again, pages can run `user.verify` to finalise
    // the login process.
    localStorage.setItem(`pulse:user:attemptingLogin`, `True`);
    window.location = Login.getLoginURL(redirectUrl);
  }

  verify(location,onVerified) {
    Login.isLoggedIn(location, (error, username) => {
      this.update(error, username, onVerified);
    });
  }

  logout() {
    this.reset();
    Login.logout(error => {
      console.log(`logout error:`, error);
    });
  }

  update(error, username=false, onUpdated) {
    if (error) {
      console.log(`login error:`, error);
    }

    // Is this a failed login attempt?
    let attemptingLogin = !!localStorage[`pulse:user:attemptingLogin`];

    if (attemptingLogin && !username) {
      this.failedLogin = true;
    }
    localStorage.removeItem(`pulse:user:attemptingLogin`);

    // bind the user values
    this.loggedin = !!username;
    this.username = username;

    // Callback with this user as argument, if
    // a callback is necessary.
    if (onUpdated) { onUpdated(this); }
  }

  getLoginURL() {
    return Login.getLoginURL();
  }
}

// An app will only ever have a single user, so we
// create a single one and use this as our export.
const user = new User();

export default user;
