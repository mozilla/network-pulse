/* Project Card */

var ProjectCard = {
  ID_PREFIX: "p",
  template: _.template($("script#project-card").html()),
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
      favorites: projectData.Favorites ? projectData.Favorites : 0,
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
    var starStatus = starred.list.indexOf(id);
    var featured = projectData.Featured;
    var html = ProjectCard.buildHTML(projectData,color);

    if (starStatus != -1) {
      $('#starredProjects').append(html);
    } else if (featured) {
      $('#featuredProjects').append(html);
    } else {
      $('#recentProjects').append(html);
    }

    if (FEATURE.patterns) { ProjectCard.addPattern(projectData,color); }
  }

};
