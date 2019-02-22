const ISSUE_MAPPING = {
  "privacy-and-security": `Privacy & Security`,
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

  getCurrentURLQuery() {
    if (typeof window !== `undefined`) {
      let map = {};
      window.location.search.replace('?','').split('&').forEach(pair => {
        let keyValue = pair.split('=');
        if (keyValue[1]) {
          let key = decodeURIComponent(keyValue[0]);
          let value = decodeURIComponent(keyValue[1]);
          map[key]=value;
        }
      });
      return map;
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
  },

  getSlugFromHelpTag(helpTag) {
    // turns help type into a prettier string so we can use it as slug
    // e.g., "Plan & organize" becomes "plan-and-organize"

    return helpTag.split(` `)
      .map(word => encodeURIComponent(word.replace(/&/g, `and`)).toLowerCase())
      .join(`-`);
  },

  getHelpTagFromSlug(slug) {
    // turns help type slug into a string Pulse API recognizes as helpType
    // e.g., "plan-and-organize" becomes "plan & organize"

    return slug.split(`-`)
      .map(word => decodeURIComponent(word.replace(/\band\b/g, `&`)))
      .join(` `);
  }
};

export default Utils;
