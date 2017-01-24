import env from "../config/env.generated.json";

let userData = {
  loggedInStatus: false,
  username: ``
};

export default {
  logInUrl: {
    get: function(redirectUrl = env.ORIGIN) {
      if (typeof window !== `undefined`) {
        redirectUrl = window.location.toString();
      }
      return `${env.PULSE_API}/login?original_url=${encodeURIComponent(redirectUrl)}`;
    }
  },
  userLoggedInStatus: {
    get: function () {
      return userData.loggedInStatus;
    },
    set: function (status) {
      userData.loggedInStatus = status.toString().toLowerCase() === `true`;
    }
  },
  username: {
    get: function () {
      return userData.username;
    },
    set: function (username) {
      userData.username = username;
    }
  }
};
