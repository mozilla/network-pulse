/* Project Card */

var ProjectCard = {
  ID_PREFIX: "p",
  template: _.template($("script#project-card-template").html()),
  getProjectCardId: function(projectData) {
    var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
    var projectId = timestamp ? Date.parse(timestamp) : '0';

    return this.ID_PREFIX + projectId;
  },
  buildHTML: function(projectData) {
    var id = this.getProjectCardId(projectData);
    var timestamp = new Date(projectData.Timestamp);
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][timestamp.getMonth()];
    var dataForTemplate = {
      id: id,
      rawTimestamp: Date.parse(projectData.Timestamp),
      featured: projectData.Featured,
      starred: FavouritesManager.isProjectFavourited(id),
      title: projectData.Title ? projectData.Title : "",
      creator: projectData.Creator ? projectData.Creator : "",
      timestamp: month + " " + timestamp.getDate() + ", " + timestamp.getFullYear(),
      description: projectData.Description ? projectData.Description : "",
      thumbnail: projectData['Thumbnail URL'] ? projectData['Thumbnail URL'] : "",
      interest: projectData.Interest ? projectData.Interest : "",
      link: projectData.URL ? projectData.URL : "",
      getInvolvedLink: projectData['Get involved URL'] ? projectData['Get involved URL'] : "",
      detailViewLink: utility.getProjectDirectLink(id),
      thumbnailView: false
    };

    return this.template(dataForTemplate);
  },
  shareBtnClickHandler: function(event) {
    event.preventDefault();
    $(event.target).parents(".project").find(".direct-link").css("visibility","visible").focus().select();
  },
  render: function(projectData) {
    var id = ProjectCard.getProjectCardId(projectData);
    var isStarred = FavouritesManager.isProjectFavourited(id);
    var featured = projectData.Featured;
    var html = ProjectCard.buildHTML(projectData);
    var $card = $(html);

    $card.find(".star").on("click", function(event) {
      event.preventDefault();
      FavouritesManager.toggleProjectFavState(id);
    });

    $card.find(".share-btn").on("click", ProjectCard.shareBtnClickHandler);

    $("#project-container .projects").append($card);
  }

};
