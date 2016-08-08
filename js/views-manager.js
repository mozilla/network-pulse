// TODO:FIXME: 
// search result layout
// auto refresh?
// issues view: coming soon

var IssueBtnClickHandler = function(event) {
  var issue = $(this).data("issue");
};

var ViewsManager = {
  projects: [],
  $controlsContainer: $("#project-container .controls"),
  $projectsContainer: $("#project-container .projects"),
  renderProjectsIntoView: function(projects) {
    this.$projectsContainer.hide();
    $.each(projects, function(index, project) {
      ProjectCard.render(project);
    });
    this.$projectsContainer.fadeIn();
  },
  renderAllProjectsIntoView: function() {
    this.renderProjectsIntoView(this.projects);
  },
  showSingleProjectView: function(projectId) {
    this.resetView();
    this.renderAllProjectsIntoView();
    $(".project").hide();
    $(".project[data-id="+projectId+"]").addClass("single").show();
  },
  showFeaturedView: function() {
    this.resetView();

    var featuredProjects = this.projects.filter(function(project) {
      return project["Featured"] === 'TRUE';
    });
    this.renderProjectsIntoView(featuredProjects);
    $("#featured-view-link").addClass("active");
    // TODO:FIXME: update url
    window.history.pushState("Network Pulse", "", window.location.href.split("?")[0]);
  },
  showLatestView: function() {
    this.resetView();
    this.renderAllProjectsIntoView();
    $("#latest-view-link").addClass("active");
    window.history.pushState("Network Pulse", "", window.location.href.split("?")[0]);
  },
  showFavsView: function() {
    this.resetView();

    var favedProjects = FavouritesManager.getFavedProjects();
    if ( favedProjects.length > 0 ) {
      var sortedFavedProjects = [];
      this.projects.forEach(function(project) {
        var index = FavouritesManager.getFavedProjects().indexOf( ProjectCard.getProjectCardId(project) );
        if (index > -1) { 
          sortedFavedProjects[index] = project;
        }
      });
      sortedFavedProjects.reverse(); // start from most recently favourited project
      this.renderProjectsIntoView(sortedFavedProjects);
      $("#fav-not-found").hide();
    } else {
      $("#fav-not-found").show();
    }
    
    $("#favs-view-link").addClass("active");
    // TODO:FIXME: update url
    window.history.pushState("Network Pulse", "", window.location.href.split("?")[0]);
  },
  showIssuesView: function() {
    // TODO:FIXME: issue view hasn't been not implemented yet
    this.resetView();
    // this.renderAllProjectsIntoView();
    // this.$controlsContainer.show();
    // $(".issue-btn").on("click",IssueBtnClickHandler);
    this.$projectsContainer.append("<h3 style='text-align: center; width: 100%; margin-bottom: 200px;'>Coming soon...</h3>");
    $("#issues-view-link").addClass("active");
  },
  resetView: function() {
    $("#fav-not-found").hide();
    this.$controlsContainer.hide();
    this.$projectsContainer.children().remove();
    $(".nav-item").removeClass("active");
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
