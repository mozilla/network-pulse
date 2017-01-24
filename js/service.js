import env from "../config/env.generated.json";

let pulseAPI = env.PULSE_API;
let defaultParams = {
  ordering: `-created`,
  page_size: 6 * Math.floor(1000/6), // make sure this number is divisible by 2 AND 3 so rows display evenly for different screen sizes. Note that max_page_size on Pulse API is set to 1000.
  format: `json`,
};

/**
 * Serialize a POJO(Plain Old JavaScript Object. A set of key-value pairs.) as a URL query string fragment
 * @param  {Object} pojo A shallow object to serialize
 * @returns {String} Serialized string fragment (eg: ?foo=bar&cool=23
 */
function pojoToQuery(pojo) {
  return Object.keys(pojo).reduce((previousValue, currentValue, index) => {
    return `${previousValue}${index !== 0 ? `&` : ``}${currentValue}=${pojo[currentValue]}`;
  }, `?`);
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
  let combinedParams = Object.assign(defaultParams,params);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${combinedParams ? pojoToQuery(combinedParams) : ``}`, true);

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
  let combinedParams = Object.assign(params,defaultParams);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${combinedParams ? pojoToQuery(combinedParams) : ``}`, true);

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
