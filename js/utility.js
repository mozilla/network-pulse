/* utility */

var utility = {
  findContainer : function(elem, containerClass){
      while ((elem = elem.parentElement) && !elem.classList.contains(containerClass));
      return elem;
  },
  getProjectIdFromUrl: function(url) {
    if ( url.indexOf("id=") > -1 ) {
      var queryParams = window.location.href.split("?")[1].split("&");
      var projectId;
      queryParams.forEach(function(param) {
        if ( !projectId && param.substr(0,3) === 'id=' ) {
          projectId = param.substr(3);
        }
      });
      return projectId;
    }
    return false;
  },
  getProjectDirectLink: function(projectId) {
    var repoName = "network-pulse";
    var location = window.location.href;
    var fileUrlPrefix = "file://"; 
    var projectDirectLink;
    if ( location.substr(0,fileUrlPrefix.length) === fileUrlPrefix ) {
    // if it's on local file system
      var rootUrlWithProtocol = location.substr(0,location.indexOf(repoName)+repoName.length);
      projectDirectLink = rootUrlWithProtocol + "/index.html?id=" + projectId;
    } else {
      // otherwise it's on the Webbbb
      var protocol = location.indexOf("https://") > -1 ? "https://" : "http://";
      var rootUrl = location.replace("http://","").replace("https://","").split("/")[0];
      var path = ( rootUrl.indexOf("mozilla.github.io") > -1 ) ? "/"+repoName : "";
      projectDirectLink = protocol + rootUrl + path + "/?id=" + projectId;
    }

    return projectDirectLink;
  }
};
