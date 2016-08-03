/* Detailer View Manager */

var DetailViewManager = {
  buildDetailModal: function(id) {
    var $clone = $("#"+id).clone(true).removeAttr("id").addClass(id).removeClass("thumbnail-view"); // pass in `true` to .clone() as we want event handlers to be copied along with the elements
    $("#detail-view").append($clone);
  },
  
  showDetailModal: function(id) {
    this.buildDetailModal(id);
    this.toggleOverlay('on');
    // FIXME: just a quick solution to add id query param to URL
    window.history.pushState(id, "", window.location.href.split("?")[0] + "?id=" + id);
  },

  toggleOverlay: function(onOrOff) {
    var $overlay = $("#lightbox-overlay");
    var $detailViewWrapper = $("#detail-view-wrapper");
    if ( onOrOff === 'on' ) {
      $overlay.show();
      $detailViewWrapper.show();
    }
    if ( onOrOff === 'off' ) {
      $overlay.hide();
      $detailViewWrapper.hide();
      window.history.pushState("Mozilla Network Pulse", "", window.location.href.split("?")[0]);
    }
  },

  shareBtnClickHandler: function(event) {
    event.preventDefault();
    $(event.target).parents(".project").find(".direct-link").css("visibility","visible").focus().select();
  },

  init: function() {
    var self = this;
    var projectId = utility.getProjectIdFromUrl(window.location.href);
    
    $("#close-control").on('click', function() {
      self.toggleOverlay('off');
    });

    if ( projectId ) {
      this.showDetailModal(projectId);
    }
  }
};
