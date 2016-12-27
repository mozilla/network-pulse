/* Project Card */

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
      description: projectData.Description ? projectData.Description : "",
      thumbnail: projectData['Thumbnail URL'] ? projectData['Thumbnail URL'] : "",
      interest: projectData.Interest ? projectData.Interest : "",
      networkConnection: projectData['Network connection'] ? projectData['Network connection'] : "",
      origin: projectData.Origin ? projectData.Origin : "",
      tags: projectData.Tags,
      issues: issues,
      belongsToOnlinePrivacyAndSecurityIssue: issuesAsArray.indexOf("Online Privacy & Security") > -1,
      belongsToOpenInnovationIssue: issuesAsArray.indexOf("Open Innovation") > -1,
      belongsToDecentralizationIssue: issuesAsArray.indexOf("Decentralization") > -1,
      belongsToWebLiteracyIssue: issuesAsArray.indexOf("Web Literacy") > -1,
      belongsToDigitalInclusionIssue: issuesAsArray.indexOf("Digital Inclusion") > -1,
      program: projectData.Program,
      type: projectData.Type,
      link: projectData.URL ? projectData.URL : "",
      getInvolvedText: projectData['Get involved'] ? projectData['Get involved'] : "",
      getInvolvedLink: projectData['Get involved URL'] ? projectData['Get involved URL'] : "",
      detailViewLink: utility.getProjectDirectLink(id),
      thumbnailView: false
    };
    return this.template(dataForTemplate);
  },
  visitBtnClickHandler: function(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: "Visit Button",
      eventAction: 'click',
      eventLabel: $(this).parents(".project-list").data("title"),
      transport: "beacon"
    });
  },
  render: function(projectData) {
    var id = projectData.id;
    var isStarred = FavouritesManager.isProjectFavourited(id);
    var featured = projectData.Featured;
    var html = ProjectList.buildHTML(projectData);
    var $card = $(html);
    $("#project-container .projects").append($card);
  }
};