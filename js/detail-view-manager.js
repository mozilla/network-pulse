/* Detailer View Manager */

var DetailViewManager = {
  buildDetailModal: function(id) {
    // jQuery's .html() returns an element's *inner* HTML, not the element itself.
    // However, we can achieve our goal by wrapping the clone with a temporary <div> and
    // call .html() on the temporary wrapper <div>
    var tempWrapperId = "temp-wrapper-" + id;
    var $clone = $("#"+id).removeAttr("id").addClass(id).clone();
    $clone.wrapAll("<div class='"+tempWrapperId+"'></div>");
    var $projectDetail = $clone.parent("."+tempWrapperId);
    $projectDetail.find(".share-btn").on("click", this.shareBtnClickHandler);

    $("#detail-view").append( $projectDetail );
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
    $(event.target).parents(".project").find(".direct-link").show().focus().select();
  },

  init: function() {
    var self = this;
    var projectId = utility.getProjectIdFromUrl(window.location.href);

    $(".project .share-btn").on('click', function(event) {
      self.shareBtnClickHandler(event);
    });
    
    $("#close-control").on('click', function() {
      self.toggleOverlay('off');
    });

    if ( projectId ) {
      this.showDetailModal(projectId);
    }
  }
};
