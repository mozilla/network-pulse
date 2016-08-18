/* favorite stars */

var FavouritesManager = {
  _list: [],
  LOCALSTORAGE_KEY: 'pulse-favourites',
  getFavedProjects: function() {
    return this._list;
  },
  isProjectFavourited: function(projectId) {
    return this._list.indexOf(projectId) > -1;
  },
  getListFromLocalStorage: function() {
    if ( localStorage.removeItem("pulse") ) { // old key we no longer use
      localStorage.removeItem("pulse");
    }
    if ( localStorage.removeItem("favourites") ) { // old key we no longer use
      localStorage.removeItem("favourites");
    }
    return localStorage.getItem(this.LOCALSTORAGE_KEY);
  },
  saveListToLocalStorage: function() {
    localStorage.setItem(this.LOCALSTORAGE_KEY, this._list.toString());
  },
  favProject: function(projectId,projectTitle) {
    console.log(projectTitle);

    this._list.push(projectId);
    this.saveListToLocalStorage();
    $("#"+projectId).addClass("starred");
    ga('send', {
      hitType: 'event',
      eventCategory: "Fav Button",
      eventAction: 'fav',
      eventLabel: projectTitle
    });
  },
  unfavProject: function(projectId,projectTitle) {
    var index = this._list.indexOf(projectId);
    if (index != -1) {
      this._list.splice(index, 1);
    }
    this.saveListToLocalStorage();
    $("#"+projectId).removeClass("starred");

    ga('send', {
      hitType: 'event',
      eventCategory: "Fav Button",
      eventAction: 'unfav',
      eventLabel: projectTitle
    });
  },
  toggleProjectFavState: function(projectId,projectTitle) {
    if ( this.isProjectFavourited(projectId) ) {
      this.unfavProject(projectId,projectTitle);
    } else {
      this.favProject(projectId,projectTitle);
    }
  },
  init: function() {
    var starIDs = this.getListFromLocalStorage();
    if (starIDs) {
      this._list = starIDs.split(',');
    }
  }
};
