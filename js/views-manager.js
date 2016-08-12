var IssueBtnClickHandler = function(event) {
  var issue = $(this).data("issue");
};

var ViewsManager = {
  VIEWS_NAMES: {
    single: "single-project-view",
    featured: "featured-view",
    latest: "latest-view",
    favs: "favs-view",
    issues: "issues-view"
  },
  projects: [],
  $controlsContainer: $("#project-container .controls"),
  $projectsContainer: $("#project-container .projects"),
  MessageView: {
    _$container: $("#message-view"),
    setMessages: function(header,bodyText) {
      this._$container.find("h2").html(header);
      this._$container.find("p").html(bodyText);
    },
    show: function() {
      this._$container.show();
    },
    hide: function() {
      this._$container.hide();
    }
  },
  updateStoredViewName: function(viewName,projectId) {
    document.querySelector("body").dataset.view = viewName;
    if (projectId) document.querySelector("body").dataset.projectId = projectId;
  },
  getStoredViewName: function() {
    return {
      viewName: document.querySelector("body").dataset.view,
      projectId: document.querySelector("body").dataset.projectId
    }
  },
  returnFromSearch: function() {
    var viewsNames = this.VIEWS_NAMES;
    switch(this.getStoredViewName().viewName) {
      case viewsNames.single:
        this.showSingleProjectView(this.getStoredViewName().projectId);
        break;
      case viewsNames.featured:
        this.showFeaturedView();
        break;
      case viewsNames.lastest:
        this.showLatestView();
        break;
      case viewsNames.favs:
        this.showFavsView();
        break;
      case viewsNames.issues:
        this.showIssuesView();
        break;
      default:
        this.showLatestView();
    }
  },
  renderProjectsIntoView: function(projects) {
    $.each(projects, function(index, project) {
      ProjectCard.render(project);
    });
  },
  renderAllProjectsIntoView: function() {
    var numProjectCards = $(".project").length;
    if ( this.projects.length != numProjectCards ) {
      // this happens when user nagivates away from the Favs Tab
      this.$projectsContainer.children().remove();
      this.renderProjectsIntoView(this.projects);
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
      $matchedProject.addClass("single").show();
    } else {
      this.MessageView.setMessages("Something's wrong", "Check your URL or try a new search. Still no luck? <a href='https://github.com/mozilla/network-pulse/issues/new'>Let us know</a>.");
      this.MessageView.show();
    }
    this.updateStoredViewName(ViewsManager.VIEWS_NAMES.single,projectId);
  },
  showFeaturedView: function() {
    this.resetView();
    var featuredProjects = this.projects.filter(function(project) {
      return project["Featured"] === 'TRUE';
    });
    this.makeProjectsVisible(featuredProjects);
    $("#featured-view-link").addClass("active");
    this.updateStoredViewName(ViewsManager.VIEWS_NAMES.featured);
    window.history.pushState("Network Pulse", "", window.location.href.split("?")[0]);
  },
  showLatestView: function(onSearchMode) {
    this.resetView({
      showAllProjects: true
    });
    $("#latest-view-link").addClass("active");
    if (!onSearchMode) {
      this.updateStoredViewName(ViewsManager.VIEWS_NAMES.latest);
    }
    window.history.pushState("Network Pulse", "", window.location.href.split("?")[0]);
  },
  showFavsView: function() {
    this.resetView({
      clearAllProjectsFromDom: true // faved projects are displayed in a different order, therefore hide/show tricks won't work
    });

    var favedProjects = FavouritesManager.getFavedProjects();
    if ( favedProjects.length > 0 ) {
      var sortedFavedProjects = [];
      this.projects.forEach(function(project) {
        var index = favedProjects.indexOf( project.id );
        if (index > -1) { 
          sortedFavedProjects[index] = project;
        }
      });
      sortedFavedProjects.reverse(); // start from most recently favourited project
      this.renderProjectsIntoView(sortedFavedProjects);
      this.MessageView.hide();
    } else {
      this.MessageView.setMessages("Save your Favs", "Tap the heart on any project to save it here.");
      this.MessageView.show();
    }
    
    $("#favs-view-link").addClass("active");
    this.updateStoredViewName(ViewsManager.VIEWS_NAMES.favs);
    window.history.pushState("Network Pulse", "", window.location.href.split("?")[0]);
  },
  showIssuesView: function() {
    // TODO:FIXME: issue view hasn't been not implemented yet
    this.resetView({
      clearAllProjectsFromDom: true
    });
    // this.$controlsContainer.show();
    // $(".issue-btn").on("click",IssueBtnClickHandler);
    this.$projectsContainer.append("<h3 id='temp-coming-soon' style='text-align: center; width: 100%; margin-bottom: 200px;'>Coming soon...</h3>");
    this.updateStoredViewName(ViewsManager.VIEWS_NAMES.issues);
    $("#issues-view-link").addClass("active");
  },
  resetView: function(resetOptions) {
    var options = {
      clearAllProjectsFromDom: resetOptions ? resetOptions.clearAllProjectsFromDom : false,
      showAllProjects: resetOptions ? resetOptions.showAllProjects : false
    };
    this.MessageView.hide();
    this.$controlsContainer.hide();
    $("#temp-coming-soon").remove();
    $(".nav-item").removeClass("active");
    if (options.clearAllProjectsFromDom === true) {
      this.$projectsContainer.children().remove();
    } else {
      this.renderAllProjectsIntoView();
      this.$projectsContainer.children('.project').hide();
    }

    if ( options.showAllProjects === true ) {
      this.$projectsContainer.children(".project").show();
    }
  },
  init: function(allProjects) {
    this.projects = allProjects;
    var projectId = utility.getProjectIdFromUrl(window.location.href);
    if ( projectId ) {
      this.showSingleProjectView(projectId);
    } else {
      // Featured view the default view
      this.showFeaturedView();
    }
  }
};
