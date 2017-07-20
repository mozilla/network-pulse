import env from "../config/env.generated.json";

let pulseAPI = env.PULSE_API;

/**
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

  let type = typeof val;

  switch(type) {
    case `object`: return false;
    case `function`: return false;
    default: return `${key}=${val.toString()}`;
  }
}

/**
 * Create query string from an object that contains key-value pairs.
 * @param  {Object} data Object that contains key-value pairs.
 * @returns {String} Query string
 */
function toQueryString(data) {
  const pairs = Object.keys(data).map( key => toQueryPair(key, data)).filter(e => !!e);
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
    "format": `json`
  };

  Object.assign(params, defaultParams);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${params ? toQueryString(params) : ``}`, true);

    request.withCredentials = true;
    request.onload = (event) => {
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
    request.onload = (event) => {
      let result = event.currentTarget;

      if ( result.status === 200 ) {
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
 * @param  {Object} params A key-value object to be posted
 * @returns {Promise} A promise to resolve an XHR request
 */
function updateEntry(requestType = ``, endpointRoute, entryData) {
  let dataToSend = requestType === `POST` ? JSON.stringify(entryData) : ``;
  let request = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    request.open(requestType, endpointRoute, true);

    request.withCredentials = true;
    request.onload = (event) => {
      let result = event.currentTarget;

      if (result.status >= 200 && result.status < 400) {
        if (result.response.length === 0) resolve();

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

    request.onerror = () => {
      reject(`XHR request failed.`);
    };

    request.setRequestHeader(`X-CSRFToken`, entryData.csrfmiddlewaretoken);
    request.setRequestHeader(`Content-Type`,`application/json`);
    request.send(dataToSend);
  });
}


let Service = {
  entries: {
    get: function(bookmarkedOnly, params, token) {
      let defaultParams = {
        "ordering": `-created`,
        "page_size": env.PROJECT_BATCH_SIZE
      };

      if (bookmarkedOnly) return Service.bookmarks.get(params,token);

      return getDataFromURL(`${pulseAPI}/entries/`, Object.assign(params, defaultParams), token);
    },
    post: function(entryData) {
      return updateEntry(`POST`,`${pulseAPI}/entries/`, entryData);
    }
  },
  entry: {
    get: function(entryId) {
      return getDataFromURL(`${pulseAPI}/entries/${entryId}/`);
    },
    put: {
      moderationState: function(entryId, stateId, nonce) {
        return updateEntry(`PUT`,`${pulseAPI}/entries/${entryId}/moderate/${stateId}`, nonce);
      },
      bookmark: function(entryId, nonce) {
        return updateEntry(`PUT`,`${pulseAPI}/entries/${entryId}/bookmark/`, nonce);
      }
    }
  },
  bookmarks: {
    get: function(params,token) {
      let defaultParams = {
        "page_size": env.PROJECT_BATCH_SIZE
      };
      return getDataFromURL(`${pulseAPI}/entries/bookmarks/`, Object.assign(params, defaultParams), token);
    },
    post: function(entryIds = [], nonce) {
      return updateEntry(`POST`,`${pulseAPI}/entries/bookmarks/?ids=${entryIds.join(`,`)}`, nonce);
    }
  },
  moderationStates: {
    get: function() {
      return getDataFromURL(`${pulseAPI}/entries/moderation-states/`);
    }
  },
  issues: {
    get: function() {
      return getDataFromURL(`${pulseAPI}/issues/`);
    }
  },
  tags: {
    get: function() {
      return getDataFromURL(`${pulseAPI}/tags/`);
    },
  },
  logout: function() {
    return callURL(`${pulseAPI}/logout/`);
  },
  userstatus: function() {
    return getDataFromURL(`${pulseAPI}/userstatus/`);
  },
  nonce: function() {
    return getDataFromURL(`${pulseAPI}/nonce/`);
  }
  // ... and more Pulse API endpoints to come
};


export default Service;
