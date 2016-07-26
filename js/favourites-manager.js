/* favorite stars */

var starred = {
  'list' : [],
  'header' : document.getElementById('starredHeader'),
  'getStarred' : function () {
    var allStarred = document.querySelectorAll('.starred');
    return allStarred;
  },
  'saveStar' : function (id) {
    starred.list.push(id);
    var starIDs = starred.list.toString(); 
    localStorage.setItem("pulse",starIDs);
  },
  'deleteStar' : function (id) {
    var index = starred.list.indexOf(id);
    if (index != -1) {
        starred.list.splice(index, 1);
    }
    var starIDs = starred.list.toString(); 
    localStorage.setItem("pulse",starIDs);
  },
  'toggle' : function (event) {
    var star = event.target;
    var project = star.parentElement;
    var status = project.classList.contains('starred');
    if (status) {
      project.classList.remove('starred');
    } else {
      project.classList.add('starred');
    }
    if (!status) { 
      starred.saveStar(project.id);
    } else {
      starred.deleteStar(project.id);
    }
  },
  'loadStars' : function () {
    var starIDs = localStorage.getItem("pulse"); 
    if (!starIDs) { return false; }
    starred.list = starIDs.split(',');
    starred.header.classList.remove('hidden');
  },
  'showStars' : function () {
    Array.prototype.forEach.call(starred.list, function(el, i){
      var project = document.getElementById(el);
      if (project) { project.classList.add('starred'); }
    }); 
  },
  'addHandlers' : function () {
    var starButtons = document.querySelectorAll('.star');
    Array.prototype.forEach.call(starButtons, function(el, i){
      el.onclick = starred.toggle;
    }); 
  },
  'init' : function () {
    starred.addHandlers();
    starred.showStars();
  },
};
