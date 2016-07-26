/* Project Card */

var ProjectCard = {
  ID_PREFIX: "p",
  template: _.template($("script#project-card-template").html()),
  getProjectCardId: function(projectData) {
    var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
    var projectId = timestamp ? Date.parse(timestamp) : '0';

    return this.ID_PREFIX + projectId;
  },
  buildHTML: function(projectData,color) {
    var id = this.getProjectCardId(projectData);
    var dataForTemplate = {
      id: id,
      colorName: color.name,
      featured: projectData.Featured,
      starred: FavouritesManager.isProjectFavourited(id),
      title: projectData.Title ? projectData.Title : "",
      creator: projectData.Creator ? projectData.Creator : "",
      description: projectData.Description ? projectData.Description : "",
      interest: projectData.Interest ? projectData.Interest : "",
      link: projectData.URL ? projectData.URL : "",
      getInvolvedLink: projectData['Get involved URL'] ? projectData['Get involved URL'] : "",
      detailViewLink: utility.getProjectDirectLink(id)
    };

    return this.template(dataForTemplate);
  },
  addPattern: function(projectData,color) {
    var pattern = GeoPattern.generate(projectData.Title,{
      color : color.hex,
      baseColor : '333333 '
    });
    pattern = pattern.toDataUrl();

    var id = ProjectCard.getProjectCardId(projectData);
    document.getElementById(id).style.backgroundImage = pattern;
  },
  render: function(projectData,color) {
    var id = ProjectCard.getProjectCardId(projectData);
    var isStarred = FavouritesManager.isProjectFavourited(id);
    var featured = projectData.Featured;
    var html = ProjectCard.buildHTML(projectData,color);
    var $card = $(html);

    $card.find(".star").on("click", function(event) {
      FavouritesManager.toggleProjectFavState(id);
    });

    $card.find(".share-btn").on("click", DetailViewManager.shareBtnClickHandler);

    if (isStarred) {
      $('#starredProjects').append($card);
    } else if (featured) {
      $('#featuredProjects').append($card);
    } else {
      $('#recentProjects').append($card);
    }

    if (FEATURE.patterns) { ProjectCard.addPattern(projectData,color); }
  }

};
