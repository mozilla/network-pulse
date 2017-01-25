// transform all snake_case keys in an object into camelCase format
let snakeToCamel = function(obj) {
  let out = {};

  Object.keys(obj).forEach(key => {
    let rekey = key.replace(/_(\w)/g, (a,b) => b.toUpperCase());

    out[rekey] = obj[key];
  });
  return out;
};

export default {
  processEntryData: snakeToCamel
};
