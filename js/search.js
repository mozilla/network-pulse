var Search = {
  activated: false,
  inputBox: document.getElementById('search-box'),
  dismissButton: document.querySelector('#search .dismiss'),
  inputBoxKeyUpHandler: function(event) {
    var query = event.target.value;
    if (event.keyCode === 27) { // escape
      Search.deactivate();
    } else {
      Search.showSearchResult(query);
    }
  },
  inputBoxFocusHandler: function(event) {
    Search.activate();
  },
  dismissButtonClickHandler: function(event) {
    Search.deactivate();
  },
  activate: function() {
    if ( !this.activated ) {
      this.activated = true;
      this.inputBox.parentElement.classList.add('activated');
      $("nav").slideUp(function(){
        // we want to search through all projects, 
        // which is essentially like searching within the Latest Tab
        ViewsManager.showLatestView(true);
      });
    }
  },
  deactivate: function() {
    this.activated = false;
    this.inputBox.value = '';
    this.inputBox.blur();
    this.inputBox.parentElement.classList.remove('activated');
    ViewsManager.returnFromSearch();
    $("nav").slideDown();
  },
  showMatchingProjects: function(query) {
    query = query.toLowerCase();
    var matchingProjectsFound = false;
    var projectCards = document.querySelectorAll(".project");
    var matchingProjects = Array.prototype.filter.call(projectCards, function(projectCard) {
      if ( RegExp(query).test(projectCard.textContent.toLowerCase()) ) {
        $(projectCard).show();
        return true;
      } else {
        $(projectCard).hide();
        return false;
      }
    });
    if ( matchingProjects.length > 0 ) {
      matchingProjectsFound = true;
    }
    return matchingProjectsFound;
  },
  showSearchResult: function(query) {
    if (query.length > 0) {
      var matchingProjectsFound = this.showMatchingProjects(query);
      if ( !matchingProjectsFound ) {
        ViewsManager.MessageView.show("Nothing found", "Try another search or submit something new!");
      } else {
        ViewsManager.MessageView.hide();
      }
    }
  },
  init: function() {
    this.inputBox.onkeyup = this.inputBoxKeyUpHandler;
    this.inputBox.onfocus = this.inputBoxFocusHandler;
    this.dismissButton.onclick = this.dismissButtonClickHandler;
    this.inputBox.value = '';
  },
};
