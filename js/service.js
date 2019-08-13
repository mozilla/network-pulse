import env from "./env-client";
import user from "./app-user";
import basketSignup from "./basket-signup";

const PULSE_API_HOST = env.PULSE_API_HOST;
const PULSE_API = env.PULSE_API;
const PULSE_API_LOGOUT = env.PULSE_LOGOUT_URL;

/*
 * A helper function to process value in a key-value pair into a valid query param value
 * @param  {String} key The key of the key-value pair we are going to process
 * @param  {Object} data Object that contains all keys and unprocessed values
 * @returns {Boolean or String} Processed value of the key
 */
function toQueryPair(key, data) {
  let val = data[key];

  if (val === undefined || val === null) {
    return false;
  }

  if (Array.isArray(val)) {
    return `${key}=${encodeURIComponent(val)}`;
  }

  let type = typeof val;

  switch (type) {
    case `object`:
      return false;
    case `function`:
      return false;
    default:
      return `${key}=${encodeURIComponent(val.toString())}`;
  }
}

/**
 * Create query string from an object that contains key-value pairs.
 * @param  {Object} data Object that contains key-value pairs.
 * @returns {String} Query string
 */
function toQueryString(data) {
  const pairs = Object.keys(data)
    .map(key => toQueryPair(key, data))
    .filter(e => !!e);
  const queryArguments = pairs.join(`&`);

  return `?${queryArguments}`;
}

/**
 * Make an GET XHR request and return a promise to resolve it.
 * Useful for making a call to an endpoint that does return data.
 * @param  {String} route A route fragment
 * @param  {Object} params A key-value object to be serialized as a query string
 * @param  {Object} token A token object to be used to trigger abortion of the XHR request
 * @returns {Promise} A promise to resolve an XHR request
 */
function getDataFromURL(route, params = {}, token = {}) {
  let request = new XMLHttpRequest();
  let defaultParams = {
    format: `json`
  };

  Object.assign(params, defaultParams);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${params ? toQueryString(params) : ``}`, true);

    request.withCredentials = true;
    request.onload = event => {
      let result = event.currentTarget;

      if (result.status >= 200 && result.status < 400) {
        let data;

        try {
          data = JSON.parse(result.response);
        } catch (error) {
          // this error can only have come from JSON parsing
          reject(error);
        }

        resolve(data);
      } else {
        reject(`XHR request failed, status ${result.status}.`);
      }
    };

    token.cancel = function() {
      request.abort();
      reject(`XHR request cancelled.`);
    };

    request.onerror = () => {
      reject(`XHR request failed.`);
    };

    request.send();
  });
}

/**
 * Make an GET XHR request and return a promise to resolve it.
 * Useful for making a call to an endpoint that doesn't return data.
 * @param  {String} route A route fragment
 * @param  {Object} params A key-value object to be serialized as a query string
 * @returns {Promise} A promise to resolve an XHR request
 */
function callURL(route) {
  let request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.open(`GET`, route, true);

    request.withCredentials = true;
    request.onload = event => {
      let result = event.currentTarget;

      if (result.status === 200) {
        resolve();
      } else {
        reject(`XHR request failed. Status ${result.status}.`);
      }
    };

    request.onerror = () => {
      reject(`XHR request failed.`);
    };

    request.send();
  });
}

/**
 * Make a POST or PUT XHR request and return a promise to resolve it.
 * @param {String} requestType An HTTP Request type string, defaults to `POST`
 * @param {String} endpointRoute A route fragment
 * @param  {Object} data A key-value object to be posted
 * @returns {Promise} A promise to resolve an XHR request
 */
function updateStoredData(requestType = `POST`, endpointRoute, data = {}) {
  return new Promise((resolve, reject) => {
    getDataFromURL(`${PULSE_API}/v2/nonce/`)
      .then(nonce => {
        (data.nonce = nonce.nonce),
          (data.csrfmiddlewaretoken = nonce.csrf_token);

        let dataToSend = JSON.stringify(data);
        let request = new XMLHttpRequest();

        request.open(requestType, endpointRoute, true);

        request.withCredentials = true;
        request.onload = event => {
          let result = event.currentTarget;

          if (result.status >= 200 && result.status < 400) {
            if (result.response.length === 0) resolve();

            let response;

            try {
              response = JSON.parse(result.response);
            } catch (error) {
              // this error can only have come from JSON parsing
              reject(error);
            }

            resolve(response);
          } else {
            reject(`XHR request failed, status ${result.status}.`);
          }
        };

        request.onerror = () => {
          reject(`XHR request failed.`);
        };

        request.setRequestHeader(`X-CSRFToken`, data.csrfmiddlewaretoken);
        request.setRequestHeader(`Content-Type`, `application/json`);
        request.send(dataToSend);
      })
      .catch(reason => {
        console.error(
          new Error(`Could not retrieve data from /nonce. Reason: ${reason}`)
        );
      });
  });
}

let Service = {
  entries: {
    get: function(bookmarkedOnly, params, token) {
      let defaultParams = {
        ordering: `-created`,
        page_size: env.PROJECT_BATCH_SIZE
      };

      if (bookmarkedOnly) return Service.bookmarks.get(params, token);

      return getDataFromURL(
        `${PULSE_API}/v2/entries/`,
        Object.assign(params, defaultParams),
        token
      );
    },
    post: function(entryData) {
      return updateStoredData(`POST`, `${PULSE_API}/v2/entries/`, entryData);
    }
  },
  entry: {
    get: function(entryId) {
      return getDataFromURL(`${PULSE_API}/v2/entries/${entryId}/`);
    },
    put: {
      moderationState: function(entryId, stateId) {
        return updateStoredData(
          `PUT`,
          `${PULSE_API}/v2/entries/${entryId}/moderate/${stateId}`
        );
      },
      feature: function(entryId) {
        return updateStoredData(
          `PUT`,
          `${PULSE_API}/v2/entries/${entryId}/feature/`
        );
      },
      bookmark: function(entryId) {
        return updateStoredData(
          `PUT`,
          `${PULSE_API}/v2/entries/${entryId}/bookmark/`
        );
      }
    }
  },
  bookmarks: {
    get: function(params, token) {
      let defaultParams = {
        page_size: env.PROJECT_BATCH_SIZE
      };
      return getDataFromURL(
        `${PULSE_API}/v2/entries/bookmarks/`,
        Object.assign(params, defaultParams),
        token
      );
    },
    post: function(entryIds = []) {
      return updateStoredData(
        `POST`,
        `${PULSE_API}/v2/entries/bookmarks/?ids=${entryIds.join(`,`)}`
      );
    }
  },
  moderationStates: {
    get: function() {
      return getDataFromURL(`${PULSE_API}/v2/entries/moderation-states/`);
    }
  },
  issues: {
    get: function() {
      return getDataFromURL(`${PULSE_API}/v2/issues/`);
    }
  },
  helpTypes: {
    get: function() {
      return getDataFromURL(`${PULSE_API}/v2/helptypes/`);
    }
  },
  tags: {
    get: function() {
      return getDataFromURL(`${PULSE_API}/v2/tags/`);
    }
  },
  creators: {
    get: function(fragment) {
      return getDataFromURL(`${PULSE_API}/v2/profiles/`, {
        name: fragment,
        basic: true
      });
    }
  },
  logout: function() {
    return callURL(PULSE_API_LOGOUT);
  },
  userstatus: function() {
    return getDataFromURL(`${PULSE_API}/v2/userstatus/`);
  },
  profileMe: function() {
    return getDataFromURL(`${PULSE_API}/v2/profiles/me/`);
  },
  profile: function(id) {
    return getDataFromURL(`${PULSE_API}/v2/profiles/${id}/`);
  },
  profileEntries: function(id, params) {
    return getDataFromURL(`${PULSE_API}/v2/profiles/${id}/entries/`, params);
  },
  profiles: {
    get: function(params, token) {
      let defaultParams = {
        ordering: `id`,
        page_size: env.PROFILE_BATCH_SIZE
      };

      return getDataFromURL(
        `${PULSE_API}/v3/profiles/`,
        Object.assign(params, defaultParams),
        token
      );
    }
  },
  nonce: function() {
    return getDataFromURL(`${PULSE_API}/v2/nonce/`);
  },
  myProfile: {
    get: function() {
      return getDataFromURL(`${PULSE_API}/v2/myprofile/`);
    },
    put: function(updatedProfile) {
      if (updatedProfile.newsletter) {
        basketSignup(
          {
            email: user.email,
            privacy: true
          },
          () => {},
          e => {
            console.error(e);
          }
        );
      }

      return updateStoredData(
        `PUT`,
        `${PULSE_API}/v2/myprofile/`,
        updatedProfile
      );
    }
  },
  signUp: function(email, source) {
    return updateStoredData(`POST`, `${PULSE_API_HOST}/signup/`, {
      email: email,
      source: source
    });
  }
  // ... and more Pulse API endpoints to come
};

export default Service;
