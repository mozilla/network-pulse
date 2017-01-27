import env from "../config/env.generated.json";

let userData = {
  loggedInStatus: false,
  type: `unknown`, // three possible values: staff, nonstaff, unknown
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
  type: {
    get: function () {
      return userData.type;
    },
    set: function (type) {
      // userData.type can only be one of the following values: staff, nonstaff, or unknown
      switch(type) {
        case `staff`:
          userData.type = type;
          break;
        case `nonstaff`:
          userData.type = type;
          break;
        default:
          userData.type = `unknown`;
      }
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
