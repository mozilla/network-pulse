/* utility */

var utility = {
  getQueryValueFromUrl: function(queryParam) {
    var value = false;
    queryParam += "=";
    if ( window.location.href.indexOf(queryParam) > -1 ) {
      var queryParams = window.location.search.substring(1).split("&");
      queryParams.some(function(param) {
        if ( param.substr(0,queryParam.length) === queryParam ) {
          value = decodeURIComponent(param.substr(queryParam.length));
          return true;
        }
        return false;
      });
    }
    return value;
  },
  getProjectDirectLink: function(projectId) {
    // we don't want to change values in window.location here
    // all we want to do is to generate a direct link to a project
    // create an anchor element so that we can make use of the Location API
    var tempAnchor = document.createElement("a");
    tempAnchor.href = "https://mzl.la/pulse";
    tempAnchor.search = "id="+projectId;
      
    return tempAnchor.href;
  },
  updateUrlWithoutReload: function(queryParam, value) { 
    // parameters of this method indicate that 
    // we don't currently allow more than 1 query param in the URL
    var rootUrl = window.location.href.split("?")[0];
    var newUrl = rootUrl;
    if ( queryParam && value ) {
      newUrl = rootUrl + "?" + queryParam + "=" + encodeURIComponent(value);
    }
    window.history.pushState("Network Pulse", "", newUrl);
  }
};
