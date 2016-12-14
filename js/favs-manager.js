export const getFavs = function() {
  try {
    let favs = localStorage.getItem(`favs`);

    if (!favs) {
      return [];
    }
    return JSON.parse(favs);
  } catch (err) {
    return [];
  }
};

export const saveFavs = function(favsArray) {
  try {
    let favs = JSON.stringify(favsArray);

    localStorage.setItem(`favs`, favs);
  } catch (err) {
    console.log(err);
  }
};
