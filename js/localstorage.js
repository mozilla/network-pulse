// shim localStorage for server-side generation
let storage;

if (typeof localStorage !== `undefined`) {
  storage = localStorage;
} else {
  let data = {};

  storage = {
    data: data,
    setItem(key, val) {
      data[key] = val;
    },
    getItem(key) {
      return data[key] || null;
    },
    removeItem(key) {
      delete data[key];
    },
  };
}

export default storage;
