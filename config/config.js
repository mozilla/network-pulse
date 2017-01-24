import env from "../config/env.generated.json";

let config = {
  userLoggedInStatus: false,
  username: ``
};

export default {
  logInUrl: {
    get: function(redirectUrl = env.ORIGIN) {
      return `${env.PULSE_API}/login?original_url=${encodeURIComponent(redirectUrl)}`;
    }
  },
  userLoggedInStatus: {
    get: function () {
      return config.userLoggedInStatus;
    },
    set: function (status) {
      config.userLoggedInStatus = ( status === `True` || status === true);
    }
  },
  username: {
    get: function () {
      return config.username;
    },
    set: function (username) {
      config.username = username;
    }
  }
};
