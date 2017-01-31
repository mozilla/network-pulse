var ViewsManager = {
  VIEWS_NAMES: {
    featured: "featured-view",
    latest: "latest-view",
    favs: "favs-view",
    issues: "issues-view"
  },
  _currentViewMeta: {
    viewName: "",
    projectId: "",
    issue: ""
  },
  _projects: [],
  $controlsContainer: $("#project-container .controls"),
  $projectsContainer: $("#project-container .projects"),
  $issueBtns: $(".issue-btn"),
  MessageView: {
    _$container: $("#message-view"),
    show: function(header,bodyText) {
      this._$container.find("h2").html(header || "");
      this._$container.find("p").html(bodyText || "");
      this._$container.show();
    },
    hide: function() {
      this._$container.hide();
    }
  },
  issueBtnClickHandler: function(event) {
    var btnWasActive = $(this).hasClass("active");
    if ( btnWasActive ) {
      // user chose to unselect an issue filter
      ViewsManager.showIssuesView();
    } else {
      // user chose to toggle on an issue filter
      ViewsManager.showIssuesView( $(this).data("issue") );
    }
  },
  updateCurrentViewMeta: function(meta) {
    this._currentViewMeta.viewName = meta.viewName;
    this._currentViewMeta.issue = meta.issue || "";
  },
  returnToPrevious: function() {
    var viewsNames = this.VIEWS_NAMES;
    switch(this._currentViewMeta.viewName) {
      case viewsNames.featured:
        this.showFeaturedView();
        break;
      case viewsNames.latest:
        this.showLatestView();
        break;
      case viewsNames.favs:
        this.showFavsView();
        break;
      case viewsNames.issues:
        this.showIssuesView(this._currentViewMeta.issue);
        break;
      default:
        this.showFeaturedView();
    }
  },
  returnFromSearch: function() {
    this.returnToPrevious();
  },
  returnFromSingleView: function() {
    if ( !Search.activated ) {
      this.returnToPrevious();
    } else {
      Search.activate(Search.currentSearchTerm,true);
    }
  },
  renderProjectsIntoView: function(projects) {
    $.each(projects, function(index, project) {
      ProjectCard.render(project);
    });
  },
  renderfavProjectsIntoView: function(projects) {
    $.each(projects, function(index, project) {
      ProjectListItem.render(project);
    });
  },
  renderAllProjectsIntoView: function() {
    var numProjectCards = $(".project").length;
    if ( this._projects.length != numProjectCards ) {
      // this happens when user nagivates away from the Favs Tab
      this.$projectsContainer.children().remove();
      this.renderProjectsIntoView(this._projects);
    }
    // else, do nothing, since we already have all Project Cards in DOM
  },
  makeProjectsVisible: function(projects) {
    projects.forEach(function(project) {
      $("#"+project.id).show();
    });
  },
  showSingleProjectView: function(projectId) {
    this.resetView();
    var $matchedProject = $("#"+projectId);
    if ( $matchedProject.length > 0 ) {
      $("body").addClass("single-project-view");
      $matchedProject.show();
    } else {
      this.MessageView.show("Something's wrong", "Check your URL or try a new search. Still no luck? <a href='https://github.com/mozilla/network-pulse/issues/new'>Let us know</a>.");
    }

    // came to this view from search result
    if (Search.activated) {
      $("nav").show();
    }
  },
  showFeaturedView: function() {
    this.resetView();
    var featuredProjects = this._projects.filter(function(project) {
      return project["Featured"] === 'TRUE';
    });
    this.makeProjectsVisible(featuredProjects);
    $("#featured-view-link").addClass("active");
    this.updateCurrentViewMeta({
      viewName: ViewsManager.VIEWS_NAMES.featured
    });
    utility.updateUrlWithoutReload();
  },
  showLatestView: function(onSearchMode) {
    var showAllProjects = onSearchMode ? false : true;
    this.resetView({
      showAllProjects: showAllProjects
    });
    $("#latest-view-link").addClass("active");
    if (!onSearchMode) {
      this.updateCurrentViewMeta({
        viewName: ViewsManager.VIEWS_NAMES.latest
      });
    }
    utility.updateUrlWithoutReload();
  },
  showFavsView: function() {
    this.resetView({
      clearAllProjectsFromDom: true // faved projects are displayed in a different order, therefore hide/show tricks won't work
    });

    var favedProjects = FavouritesManager.getFavedProjects();
    if ( favedProjects.length > 0 ) {
      var sortedFavedProjects = [];
      this._projects.forEach(function(project) {
        var index = favedProjects.indexOf( project.id );
        if (index > -1) { 
          sortedFavedProjects[index] = project;
        }
      });
      sortedFavedProjects.reverse(); // start from most recently favourited project
      // create a new div that shows count of favs
      var favsCount = _.size(sortedFavedProjects);
      $("<div id='fav-count-text'><img class='star'></img>You have <span id='fav-count'>"+favsCount+"</span> favs</div>").insertBefore(".projects");
      this.renderfavProjectsIntoView(sortedFavedProjects);
      this.MessageView.hide();
    } else {
      this.MessageView.show("Save your Favs", "Tap the heart on any project to save it here.");
    }
    
    $("#favs-view-link").addClass("active");
    this.updateCurrentViewMeta({
      viewName: ViewsManager.VIEWS_NAMES.favs
    });
    utility.updateUrlWithoutReload();
  },
  showIssuesView: function(selectedIssue) {
    this.resetView({
      showAllProjects: false
    });
    this.$controlsContainer.show();

    if ( !selectedIssue ) {
      this.MessageView.show("", "Mozilla has identified five issues critical to a healthy and open internet. Tap above to browse by issue.");
    } else {
      this.MessageView.hide();
      $(".issue-btn[data-issue="+ selectedIssue + "]").addClass("active");
      $(".project[data-issue-"+ selectedIssue +"=true]").show();
    }

    this.updateCurrentViewMeta({
      viewName: ViewsManager.VIEWS_NAMES.issues,
      issue: selectedIssue
    });
    $("#issues-view-link").addClass("active");
    utility.updateUrlWithoutReload();
  },
  resetView: function(resetOptions) {
    // remove fav-count div on reset
    $("#fav-count-text").remove();
    this.updateProjectData();

    var options = {
      clearAllProjectsFromDom: resetOptions ? resetOptions.clearAllProjectsFromDom : false,
      showAllProjects: resetOptions ? resetOptions.showAllProjects : false
    };
    this.MessageView.hide();
    this.$controlsContainer.hide();
    this.$issueBtns.removeClass("active");
    $(".nav-item").removeClass("active");
    $("body").removeClass("single-project-view");
    if (options.clearAllProjectsFromDom === true) {
      this.$projectsContainer.children().remove();
    } else {
      this.renderAllProjectsIntoView();
      this.$projectsContainer.children('.project').hide();
    }

    if ( options.showAllProjects === true ) {
      this.$projectsContainer.children(".project").show();
    }

    window.scrollTo(0,0);
  },
  updateProjectData: function() {
    var updatedProjects = PulseMaker.getProjectsUpdated();
    if (!updatedProjects) {
      return;
    }
    this._projects = updatedProjects;
    PulseMaker.setProjectsUpdated(false);
  },
  init: function(allProjects) {
    this._projects = allProjects;
    this.$issueBtns.on("click",this.issueBtnClickHandler);

    var projectId = utility.getQueryValueFromUrl("id");
    var searchTerm = utility.getQueryValueFromUrl("keyword");

    if ( projectId ) {
      this.showSingleProjectView(projectId);
    } else if ( searchTerm ) {
      Search.activate(searchTerm);
      // escaping from search mode will bring users to Featured Tab
      this.updateCurrentViewMeta({
        viewName: ViewsManager.VIEWS_NAMES.featured
      });
    } else {
      // Featured view the default view
      this.showFeaturedView();
    }
  }
};