var RoutesManager = {
  showSingleProjectView: function(projectId) {
    this.resetView();
    $("#project-container h4").hide();
    $(".project[data-id!="+projectId+"]").hide();
    // FIXME: just a quick solution to add id query param to URL
    window.history.pushState(projectId, "", window.location.href.split("?")[0] + "?id=" + projectId);
  },
  resetView: function() {
    $("#project-container h4").show();
    $(".project").show();
  },
  init: function() {
    var projectId = utility.getProjectIdFromUrl(window.location.href);

    if ( projectId ) {
      this.showSingleProjectView(projectId);
    }
  }
};
