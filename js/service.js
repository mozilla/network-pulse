import env from "../config/env.generated.json";

let pulseAPI = env.PULSE_API;
let defaultParams = {
  format: `json`
};

/**
 * Serialize a POJO as a URL query string fragment
 * @param  {Object} pojo A shallow object to serialize
 * @returns {String} Serialized string fragment (eg: ?foo=bar&cool=23
 */
function pojoToQuery(pojo) {
  return Object.keys(pojo).reduce((previousValue, currentValue, index) => {
    return `${previousValue}${index !== 0 ? `&` : ``}${currentValue}=${pojo[currentValue]}`;
  }, `?`);
}

/**
 * Make an XHR request and return a promise to resolve it.
 * @param  {String} route A route fragment
 * @param  {Object} params A POJO to be serialized as a query string
 * @returns {Promise} A promise to resolve an XHR request
 */
function doXHR(route, params = {}) {
  let request = new XMLHttpRequest();
  let combinedParams = Object.assign(params,defaultParams);

  return new Promise((resolve, reject) => {
    request.open(`GET`, `${route}${combinedParams ? pojoToQuery(combinedParams) : ``}`, true);

    request.onload = (event) => {
      let result = event.currentTarget;

      if (result.status >= 200 && result.status < 400) {
        resolve(JSON.parse(result.response));
      } else {
        reject(`XHR request failed.`);
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
    get: function (params) {
      return doXHR(`${pulseAPI}/entries/`, params);
    }
  }
  // ... and more Pulse API endpoints to come
};
