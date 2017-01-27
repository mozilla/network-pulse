import { browserHistory } from 'react-router';
import Service from './service.js';
import UserData from './user-data.js';

export default {
  clearLoggedInParam(locationObj) {
    let query = locationObj.query;

    delete query.loggedin;

    browserHistory.replace({
      pathname: locationObj.pathname,
      query: query
    });
  },
  verifyLoggedInStatus(currentLocation, callback) {
    let loggedInParam = currentLocation.query.loggedin;

    if (loggedInParam) {
      // After the login process user will be redirected back to Pulse.
      // There will be a query argument "loggedin" presented in the URL
      // which is something we don't want it to stay at all times.
      this.clearLoggedInParam(currentLocation);
    }

    // verify user's logged in status with Pulse API
    Service.userstatus()
      .then(response => {
        let type = `unknown`;

        // TODO:FIXME: the following condition checks can be removed if response returns "type" of
        // the current user session.
        // Ticket has been filed: https://github.com/mozilla/network-pulse-api/issues/61
        if (!response.loggedin) {
          if (loggedInParam && loggedInParam.toLowerCase() === `false`) {
            type = `nonstaff`;
          }
        } else {
          type = `staff`;
        }
        this.updateUserInfo(type, response.username);
        callback();
      })
      .catch(reason => {
        console.error(reason);
        this.updateUserInfo(`unknown`);
        callback(reason);
      });
  },
  updateUserInfo(type, username = ``) {
    UserData.type.set(type);
    UserData.username.set(username);
  },
  logoutUser(callback) {
    Service.logout()
      .then(() => {
        // we have successfully logged user out
        this.updateUserInfo(`unknown`);
        callback();
      })
      .catch(reason => {
        console.error(reason);
        // log out process did not go through successfully
        // no need to update user info
        callback(reason);
      });
  }
};
