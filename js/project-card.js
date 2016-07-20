/* Project Card */

var ProjectCard = {
  getID: function(projectData) {
    var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
    var id = timestamp ? Date.parse(timestamp) : '0';
    return id; 
  },

  buildHTML: function(projectData) {
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
    var color = colors.getColor('name'); 

    // assemble html
    var html = 
      '<div id="p' + id + '" class="project ' + color + featured + '" data-created="' + id + '" data-favorites="' + favorites + '" ' + '>' +
        '<div class="projectSummary">' + title + creator + description + interest + links + '</div>' + 
        '<div class="star"></div>' + 
      '</div>';
    return html;
  },

  addPattern: function(projectData) {
    var color = colors.getColor('hex'); 
    var pattern = GeoPattern.generate(projectData.Title,{
      color : color,
      baseColor : '333333 '
    });
    pattern = pattern.toDataUrl();

    var id = 'p' + ProjectCard.getID(projectData);
    document.getElementById(id).style.backgroundImage = pattern;
  },

  render: function(projectData) {
    var id = ProjectCard.getID(projectData);
    var starStatus = starred.list.indexOf('p' + id);
    var featured = projectData.Featured;
    var html = ProjectCard.buildHTML(projectData);

    if (starStatus != -1) {
      $('#starredProjects').append(html);
    } else if (featured) {
      $('#featuredProjects').append(html);
    } else {
      $('#recentProjects').append(html);
    }

    if (FEATURE.patterns) { ProjectCard.addPattern(projectData); }
  },
  
  hideProject: function(element) {
    element.style.display = 'none';
    if (FEATURE.dismiss) { dismissed.addDismissed(element.id); }
  },

  shrinkProject: function(element) {
    element.classList.add = 'shrunken';
    setTimeout(function(){ 
      ProjectCard.hideProject(element);
    }, 500);
  },

  checkSwipe: function(element,deltaX) {
    var width = element.offsetWidth;
    var threshold = width / -3;
    var purgatory = (width * -1) - 50;
    if (deltaX < threshold ) { 
      element.style.left = purgatory + 'px'; // @todo optimize with a class and transforms
      setTimeout(function(){ 
        ProjectCard.shrinkProject(element);
      }, 500);
    } else {
      element.style.left = '0px';
    }
  },

  swipeProject: function(event) {
    var element = event.target;
    if ( !element.classList.contains('project') ) { element = element.parentElement; } // this is weird
    if ( !element.classList.contains('project') ) { element = element.parentElement; } // this is insane
    var deltaX = event.deltaX;
    element.style.left = deltaX + 'px';
    if (event.isFinal) { 
      ProjectCard.checkSwipe(element,deltaX);
    }
  }

};
