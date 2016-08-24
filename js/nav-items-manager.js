var NavItemsManager = {
  backLinkHandler: function(event) {
    event.preventDefault();
    ViewsManager.returnFromSingleView();
  },
  showFeaturedViewLinkHandler: function(event) {
    event.preventDefault();
    ViewsManager.showFeaturedView();
  },
  showLatestViewLinkHandler: function(event) {
    event.preventDefault();
    ViewsManager.showLatestView();
  },
  showFavsViewLinkHandler: function(event) {
    event.preventDefault();
    ViewsManager.showFavsView();
  },
  showIssuesViewLinkHandler: function(event) {
    event.preventDefault();
    ViewsManager.showIssuesView();
  },
  init: function() {
    var self = this;
    $("#back-link").on("click",self.backLinkHandler);
    $("#featured-view-link").on("click",self.showFeaturedViewLinkHandler);
    $("#latest-view-link").on("click",self.showLatestViewLinkHandler);
    $("#favs-view-link").on("click",self.showFavsViewLinkHandler);
    $("#issues-view-link").on("click",self.showIssuesViewLinkHandler);
  }
};
