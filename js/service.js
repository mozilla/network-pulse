import env from "../config/env.generated.json";

let pulseAPI = env.PULSE_API;
let defaultParams = {
  ordering: `-created`,
  page_size: 6 * Math.floor(1000/6), // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes. Note that max_page_size on Pulse API is set to 1000.
  format: `json`,
};

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
 * @param  {Object} params A POJO to be serialized as a query string
 * @returns {Promise} A promise to resolve an XHR request
 */
function getDataFromURL(route, params = {}) {
  let request = new XMLHttpRequest();
  let clonedDefaultParams = Object.assign({}, defaultParams); // so we don't mutate defaultParams itself in the next line
  let combinedParams = Object.assign(clonedDefaultParams, params);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${combinedParams ? toQueryString(combinedParams) : ``}`, true);

    request.withCredentials = true;
    request.onload = (event) => {
      let result = event.currentTarget;

      if (result.status >= 200 && result.status < 400) {
        try {
          resolve(JSON.parse(result.response));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(`XHR request failed, status ${result.status}.`);
      }
    };

    request.onerror = () => {
      reject(`XHR request failed`);
    };

    request.send();
  });
}

/**
 * Make an GET XHR request and return a promise to resolve it.
 * Useful for making a call to an endpoint that doesn't return data.
 * @param  {String} route A route fragment
 * @param  {Object} params A POJO to be serialized as a query string
 * @returns {Promise} A promise to resolve an XHR request
 */
function callURL(route, params = {}) {
  let request = new XMLHttpRequest();
  let clonedDefaultParams = Object.assign({}, defaultParams); // so we don't mutate defaultParams itself in the next line
  let combinedParams = Object.assign(clonedDefaultParams, params);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${combinedParams ? toQueryString(combinedParams) : ``}`, true);

    request.withCredentials = true;
    request.onload = (event) => {
      let result = event.currentTarget;

      if ( result.status == 200 ) {
        resolve();
      } else {
        reject(`XHR request failed. Status ${result.status}.`);
      }
    };

    request.onerror = () => {
      reject(`XHR request failed`);
    };

    request.send();
  });
}

export default {
  entries: {
    get: function(params) {
      return getDataFromURL(`${pulseAPI}/entries/`, params);
    }
  },
  entry: {
    get: function(entryId) {
      console.log(`${pulseAPI}/entries/${entryId}`);
      return getDataFromURL(`${pulseAPI}/entries/${entryId}`);
    }
  },
  logout: function() {
    return callURL(`${pulseAPI}/logout/`);
  },
  userstatus: function() {
    return getDataFromURL(`${pulseAPI}/userstatus/`);
  }
  // ... and more Pulse API endpoints to come
};
