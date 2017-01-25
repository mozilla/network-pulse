export const getBookmarks = function() {
  try {
    let bookmarks = localStorage.getItem(`bookmarks`);

    if (!bookmarks) {
      return [];
    }
    return JSON.parse(bookmarks);
  } catch (err) {
    return [];
  }
};

export const saveBookmarks = function(bookmarksArray) {
  try {
    let bookmarks = JSON.stringify(bookmarksArray);

    localStorage.setItem(`bookmarks`, bookmarks );
  } catch (err) {
    console.log(err);
  }
};
