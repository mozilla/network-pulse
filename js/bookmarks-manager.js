const LS_BOOKMARKS_KEY = `bookmarks`;

export default {
  bookmarks: {
    get: function() {
      console.log(`getBookmarks`);
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
      console.log(`saveBookmarks`);
      try {
        let bookmarks = JSON.stringify(bookmarksArray);

        localStorage.setItem(LS_BOOKMARKS_KEY, bookmarks);
      } catch (err) {
        console.log(err);
      }
    },
    delete: function() {
      console.log(`deleteBookmarks`);
      try {
        localStorage.removeItem(LS_BOOKMARKS_KEY);
      } catch (err) {
        console.log(err);
      }
    }
  }
};

