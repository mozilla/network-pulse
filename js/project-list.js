3/* Project List */

var ProjectList = {
  template: _.template($("script#project-list-template").html()),
  buildHTML: function(projectData) {
    var id = projectData.id;
    var timestamp = new Date(projectData.Timestamp);
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][timestamp.getMonth()];
    var issues = projectData.Issues ? projectData.Issues : "";
    var issuesAsArray = issues.split(", ");
    var dataForTemplate = {
      id: id,
      rawTimestamp: Date.parse(projectData.Timestamp),
      featured: projectData.Featured,
      starred: FavouritesManager.isProjectFavourited(id),
      title: projectData.Title ? projectData.Title : "",
      creators: projectData.Creators ? projectData.Creators : "",
      timestamp: month + " " + timestamp.getDate() + ", " + timestamp.getFullYear(),
      interest: projectData.Interest ? projectData.Interest : "",
      networkConnection: projectData['Network connection'] ? projectData['Network connection'] : "",
      origin: projectData.Origin ? projectData.Origin : "",
      detailViewLink: utility.getProjectDirectLink(id),
    };
    return this.template(dataForTemplate);
  },
  readMoreLinkClickHandler: function(event) {
    event.preventDefault();
    var $projectList = $(this).parents(".project-list");
    var projectId = $projectCard.attr("id");
    ga('send', {
      hitType: 'event',
      eventCategory: "Read More Link",
      eventAction: 'click',
      eventLabel: $projectList.data("title")
    });
    utility.updateUrlWithoutReload("id",projectId);
    ViewsManager.showSingleProjectView(projectId);
  },
  render: function(projectData) {
    var id = projectData.id;
    var isStarred = FavouritesManager.isProjectFavourited(id);
    var featured = projectData.Featured;
    var html = ProjectList.buildHTML(projectData);
    var $list = $(html);

    $list.find(".star").on("click", function(event) {
      event.preventDefault();
      FavouritesManager.toggleProjectFavState(id,projectData.Title);

      var favedProjects = FavouritesManager.getFavedProjects();
      favs_count = _.size(favedProjects);
      $("#fav-count-text").html("You have "+favs_count+" favs");
    });

    $("#project-container .projects").append($list);
  }
};