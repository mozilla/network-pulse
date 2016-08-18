/* Project Card */

var ProjectCard = {
  template: _.template($("script#project-card-template").html()),
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
      getInvolvedLink: projectData['Get involved URL'] ? projectData['Get involved URL'] : "",
      detailViewLink: utility.getProjectDirectLink(id),
      thumbnailView: false
    };

    return this.template(dataForTemplate);
  },
  shareBtnClickHandler: function(event) {
    event.preventDefault();

    var $projectCard = $(this).parents(".project");
    $projectCard.find(".direct-link").css("visibility","visible").focus().select();

    ga('send', {
      hitType: 'event',
      eventCategory: "Share Link Button",
      eventAction: 'click',
      eventLabel: $projectCard.data("title")
    });
  },
  visitBtnClickHandler: function(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: "Visit Button",
      eventAction: 'click',
      eventLabel: $(this).parents(".project").data("title"),
      transport: "beacon"
    });
  },
  getInvolvedBtnClickHandler: function(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: "Get Involved Button",
      eventAction: 'click',
      eventLabel: $(this).parents(".project").data("title"),
      transport: "beacon"
    });
  },
  render: function(projectData) {
    var id = projectData.id;
    var isStarred = FavouritesManager.isProjectFavourited(id);
    var featured = projectData.Featured;
    var html = ProjectCard.buildHTML(projectData);
    var $card = $(html);

    $card.find(".star").on("click", function(event) {
      event.preventDefault();
      FavouritesManager.toggleProjectFavState(id,projectData.Title);
    });

    $card.find(".share-btn").on("click", ProjectCard.shareBtnClickHandler);
    $card.find(".visit-btn").on("click", ProjectCard.visitBtnClickHandler);
    $card.find(".get-involved-btn").on("click", ProjectCard.getInvolvedBtnClickHandler);

    $("#project-container .projects").append($card);
  }

};
