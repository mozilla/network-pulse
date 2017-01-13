/* Project List Item */

var ProjectListItem = {
  template: _.template($("script#project-list-item-template").html()),
  buildHTML: function(projectData) {
    var id = projectData.id;
    var timestamp = new Date(projectData.Timestamp);
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][timestamp.getMonth()];
    var dataForTemplate = {
      id: id,
      starred: FavouritesManager.isProjectFavourited(id),
      title: projectData.Title ? projectData.Title : "",
      creators: projectData.Creators ? projectData.Creators : "",
      timestamp: month + " " + timestamp.getDate() + ", " + timestamp.getFullYear(),
      detailViewLink: utility.getProjectDirectLink(id),
    };
    return this.template(dataForTemplate);
  },
  viewProjectLinkClickHandler: function(event) {
    event.preventDefault();
    var $projectListItem = $(this).parents(".project-list-item");
    var projectId = $projectListItem.attr("id");
    ga('send', {
      hitType: 'event',
      eventCategory: "Project Title",
      eventAction: 'click',
      eventLabel: $projectListItem.data("title")
    });
    utility.updateUrlWithoutReload("id",projectId);
    ViewsManager.showSingleProjectView(projectId);
  },
  render: function(projectData) {
    var id = projectData.id;
    var isStarred = FavouritesManager.isProjectFavourited(id);
    var featured = projectData.Featured;
    var html = ProjectListItem.buildHTML(projectData);
    var $list = $(html);
    var title = $($list).find("h2");
    $(title).click(this.viewProjectLinkClickHandler);
    $("#project-container .projects").append($list);
  }
};