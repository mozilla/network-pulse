/* utility */

var utility = {
  getProjectIdFromUrl: function() {
    var projectId = false;
    if ( window.location.href.indexOf("id=") > -1 ) {
      var queryParams = window.location.search.substring(1).split("&");
      queryParams.some(function(param) {
        if ( param.substr(0,3) === 'id=' ) {
          projectId = param.substr(3);
          return true;
        }
        return false;
      });
    }

    return projectId;
  },
  getProjectDirectLink: function(projectId) {
    // we don't want to change values in window.location here
    // all we want to do is to generate a direct link to a project
    // create an anchor element so that we can make use of the Location API
    var tempAnchor = document.createElement("a");
    tempAnchor.href = "https://mzl.la/pulse";
    tempAnchor.search = "id="+projectId;
      
    return tempAnchor.href;
  }
};
