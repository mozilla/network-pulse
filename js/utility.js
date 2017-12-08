const ISSUE_MAPPING = {
  "online-privacy-and-security": `Online Privacy & Security`,
  "open-innovation": `Open Innovation`,
  "decentralization": `Decentralization`,
  "web-literacy": `Web Literacy`,
  "digital-inclusion": `Digital Inclusion`
};

const Utils = {
  // transform all snake_case keys in an object into camelCase format
  processEntryData(obj) {
    let out = {};

    Object.keys(obj).forEach(key => {
      let rekey = key.replace(/_(\w)/g, (a,b) => b.toUpperCase());

      out[rekey] = obj[key];
    });
    return out;
  },

  getCurrentURL() {
    if (typeof window !== `undefined`) {
      return window.location.toString();
    }
    return console.error(`No window available to get the current url!`);
  },

  getIssueNameFromUriPath(path) {
    return ISSUE_MAPPING[path] || ``;
  },

  getUriPathFromIssueName(issueName) {
    for(let key in ISSUE_MAPPING) {
      if (ISSUE_MAPPING[key] === issueName) return key;
    }

    return ``;
  }
};

export default Utils;
