/* Project Card */

var ProjectCard = {
  getID: function(projectData) {
    var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
    var id = timestamp ? Date.parse(timestamp) : '0';
    return id; 
  },

  buildHTML: function(projectData,color) {
    // format available data
    var helpURL = projectData['Get involved URL'];
    helpURL = !helpURL ? '' : '<a href="' + helpURL + '">Get Involved &#8599;</a>';
    var projectURL = !projectData.URL ? '' : '<a href="' + projectData.URL + '">Open &#8599;</a>';
    var links = '<p class="projectLinks">' + projectURL + helpURL +  '</p>';
    var title = projectData.Title ? '<h2>' + projectData.Title + '</h2>' : '';
    var creator = projectData.Creator ? '<h3>' + projectData.Creator + '</h3>' : '';
    var description = projectData.Description ? '<p class="description">' + projectData.Description + '</p>' : '';
    var interest = projectData.Interest ? '<p class="interest">' + projectData.Interest + '</p>' : '';
    var favorites = projectData.Favorites ? projectData.Favorites : 0;
    var featured = projectData.Featured ? ' featured' : '';

    var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
    var id = ProjectCard.getID(projectData);
    var colorName = color.name;

    // assemble html
    var html = 
      '<div id="p' + id + '" class="project ' + colorName + featured + '" data-created="' + id + '" data-favorites="' + favorites + '" ' + '>' +
        '<div class="projectSummary">' + title + creator + description + interest + links + '</div>' + 
        '<div class="star"></div>' + 
      '</div>';
    return html;
  },

  addPattern: function(projectData,color) {
    var pattern = GeoPattern.generate(projectData.Title,{
      color : color.hex,
      baseColor : '333333 '
    });
    pattern = pattern.toDataUrl();

    var id = 'p' + ProjectCard.getID(projectData);
    document.getElementById(id).style.backgroundImage = pattern;
  },

  render: function(projectData,color) {
    var id = ProjectCard.getID(projectData);
    var starStatus = starred.list.indexOf('p' + id);
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
