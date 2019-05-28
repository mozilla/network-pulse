const LS_BOOKMARKS_KEY = `bookmarks`;

export default {
  bookmarks: {
    get: function() {
      try {
        let bookmarks = localStorage.getItem(LS_BOOKMARKS_KEY);

        if (!bookmarks) {
          return [];
        }
        return JSON.parse(bookmarks);
      } catch (err) {
        return [];
      }
    },
    set: function(bookmarksArray) {
      try {
        let bookmarks = JSON.stringify(bookmarksArray);

        localStorage.setItem(LS_BOOKMARKS_KEY, bookmarks);
      } catch (err) {
        console.error(err);
      }
    },
    delete: function() {
      try {
        localStorage.removeItem(LS_BOOKMARKS_KEY);
      } catch (err) {
        console.error(err);
      }
    }
  }
};
