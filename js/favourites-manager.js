/* favorite stars */

var FavouritesManager = {
  list: [],
  LOCALSTORAGE_KEY: 'pulse-favourites',
  isProjectFavourited: function(projectId) {
    return this.list.indexOf(projectId) > -1;
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
    localStorage.setItem(this.LOCALSTORAGE_KEY, this.list.toString());
  },
  favProject: function(projectId) {
    this.list.push(projectId);
    this.saveListToLocalStorage();

    $(".project[data-id="+projectId+"]").addClass("starred");
  },
  unfavProject: function(projectId) {
    var index = this.list.indexOf(projectId);
    if (index != -1) {
      this.list.splice(index, 1);
    }
    this.saveListToLocalStorage();

    $(".project[data-id="+projectId+"]").removeClass("starred");
  },
  toggleProjectFavState: function(projectId) {
    if ( this.isProjectFavourited(projectId) ) {
      this.unfavProject(projectId);
    } else {
      this.favProject(projectId);
    }
  },
  init: function() {
    var starIDs = this.getListFromLocalStorage();
    if (starIDs) {
      this.list = starIDs.split(',');
      document.getElementById('starred-header').classList.remove('hidden');
    }
  }
};
