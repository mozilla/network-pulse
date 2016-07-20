// Your Google Drive Spreadsheet URL
var GOOGLE_SHEET_ID = "1vmYQjQ9f6CR8Hs5JH3GGJ6F9fqWfLSW0S4dz-t2KTF4";

var FEATURE = {
  'orphans' : false,// @todo screwing things for notifications??!
  'patterns' : true,
  'notify' : true
};

/* color project cards */

var colors = {
  'names' : ['nightlyblue','developerblue','mobileblue','summitteal','geckgreen','flameyellow','marketorange','firefoxorange','dinored','bikeshedmagenta','aurorapurple'],
  'hexes' : ['#2D457E','#1EC198','#F19B2D','#DF5B74','#135E9F','#7CC260','#E66C32','#793876','#20A5D9','#F9D12F','#C95142'],
  'id' : 0,
  'getColor' : function (type){
    var color = type === 'hex' ? colors.hexes[colors.id] : colors.names[colors.id];
    colors.id += 1;
    if ( colors.id === colors.names.length ) { colors.id = 0; }
    return color;
  },
};


/* better typography */

var typography = {
  preventTextOrphans : function () {
    var textElements = document.querySelectorAll('h1,h3,li,p');
    Array.prototype.forEach.call(textElements, function(el, i){
      el.innerHTML = el.innerHTML.replace(/\s([^\s<]{0,10})\s*$/,'&nbsp;$1');
    }); 
  },
};



/* UI effects */

var fadeUpdate = {
  'projects' : document.getElementById('projectContainer'),
  'fadeOut' : function () {
    fadeUpdate.projects.classList.add('fadeUpdate');
  },
  'fadeIn' : function () {
    fadeUpdate.projects.classList.remove('fadeUpdate');
  },
  'fadeOutIn' : function () {
    fadeUpdate.fadeOut();
    setTimeout( function () {
      fadeUpdate.fadeIn();
    }, 100);
  },
};


/* search */

var search = {
  'input' : document.getElementById('searchBox'),
  'dismissButton' : document.querySelector('#search .dismiss'),
  'projectContainer' : document.getElementById('projectContainer'),
  'checkContents' : function (selector, text) {
    text = text.toLowerCase();
    var elements = document.querySelectorAll(selector);
    var results = Array.prototype.filter.call(elements, function(element){
      return RegExp(text).test(element.textContent.toLowerCase());
    });
    return results;
  },
  'getInput' : function (evt) {
    if (evt.keyCode === 27) { // escape
      search.dismiss();
      search.input.blur();
    } else if (evt.keyCode === 13) { // enter
      search.input.blur();
    } else {
      search.filter();
    }
  },
  'filter' : function () {
    search.activate();
    var query = search.input.value;
    if (query.length > 2) {
      search.projectContainer.classList.add('searching');
      search.clearPrevious();
      var results = search.checkContents('.project', query);
      if (results.length > 0) {
        results.forEach(function(item, i){
          item.classList.add('found');
        });       
      } else {
        // nothing found
      }
    } else {
      search.deactivate();
    }
  },
  'activate' : function(){
    search.input.parentElement.classList.add('focus');
  },
  'deactivate' : function(){
    search.projectContainer.classList.remove('searching');
    search.input.parentElement.classList.remove('focus');
  },
  'dismiss' : function(){
    search.input.value = '';
    search.input.focus();
    search.filter();
  },
  'clearPrevious' : function () {
    var previouslyFound = document.querySelectorAll('.found');
    Array.prototype.forEach.call(previouslyFound, function(elem, i){
      elem.classList.remove('found');
    });
  },
  'init' : function () {
    search.input.onkeyup = search.getInput;
    search.dismissButton.onclick = search.dismiss;
    // @todo - add clear search icon
  },
};

/* add new project form */

var newProjectForm = {
  'formContainer' : document.getElementById('addProjectForm'),
  'projectContainer' : document.getElementById('projectContainer'),
  'toggleFormButton' : document.getElementById('toggleFormButton'),
  'getDisplayState' : function () {
    var state = newProjectForm.formContainer.style.display;
    return state;
  },
  'showForm' : function (){
    newProjectForm.formContainer.style.display = 'block';
    newProjectForm.projectContainer.style.display = 'none'; // @todo get elem within module
    newProjectForm.toggleFormButton.style.transform = 'rotate(45deg)';
  },
  'hideForm' : function (){
    newProjectForm.formContainer.style.display = 'none';
    newProjectForm.projectContainer.style.display = 'block';
    newProjectForm.toggleFormButton.style.transform = 'rotate(0deg)';
    setTimeout(function(){ PulseMaker.getData(); }, 250);
  },
  'toggleForm' : function () {  
    var displayState = newProjectForm.getDisplayState();
    if (displayState === 'block') { 
      newProjectForm.hideForm();
    } else { 
      newProjectForm.showForm(); 
    }    
  },
  'init' : function () {
    newProjectForm.toggleFormButton.onclick = newProjectForm.toggleForm;
  },
};

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


/* notifications */

var notify = {};

notify.interval = 1 * 60 * 1000;

notify.checkPermission = function() {
  var permission = false;
  if (Notification.permission === "granted") {
    console.log('permission granted');
    permission = true;
    return permission;
  } else if (Notification.permission !== 'denied') {
    console.log('permission unknown');
    // permission unknown
    permission = notify.requestPermission();
    return permission;
  } else {
    console.log('permission denied');
    return permission;
  }
};

notify.requestPermission = function() {
  var permission = false;
  Notification.requestPermission(function(result) {
      if (result === 'denied') {
        return false;
      } else if (result === 'default') {
        return false;
      } else { // accepted
        return true;
      }
  });
};

notify.create = function(notice) {
  if ("Notification" in window) {
    var permission = notify.checkPermission();
    if (permission) { 
      try {
        new window.Notification('');
      } catch (e) {
        if (e.name === 'TypeError') { // dang you ambivalent android
          return false;
        }
      }
      var notification = new Notification('Mozilla Pulse', { body: notice });
    }   
  }
};

notify.checkForUpdates = function(newestTimestamp,newestTitle){
  var updated = false;
  var lastProject = Number(localStorage.getItem("lastProject")); 
  if (lastProject && lastProject < newestTimestamp) { 
    var notification = 'Check out ' + newestTitle;
    notify.create(notification);
    updated = true;
  }
  localStorage.setItem("lastProject",newestTimestamp);
  return updated;
};

notify.init = function () {
  var getProjects = setInterval(PulseMaker.refresh, notify.interval);
};


/* utility */

var utility = {
  'findContainer' : function(elem, containerClass){
      while ((elem = elem.parentElement) && !elem.classList.contains(containerClass));
      return elem;
  },
};

/* Detailer View Handler */

function enableDetailView() {
  var showDetailsModal = function(id) {
    var $detailViewTitle = $("#detail-view-wrapper h3");
    var $detailViewContent = $("#detail-view-wrapper .content");
    var $projectSummary = $("#"+id).children(".projectSummary");
    var html = 
      "[ Project ID ] " + id + "<br><br>" +
      "[ Project Name ] " + $projectSummary.find("h2").html() + "<br><br>" +
      "[ Project Creator ] " + $projectSummary.find("h3").html() + "<br><br>" +
      "[ Project Description ] " + $projectSummary.find(".description").html() + "<br><br>" +
      "[ Project Interest ] " + $projectSummary.find(".interest").html() + "<br><br>" +
      "[ Project Links ] " + $projectSummary.find(".projectLinks").html().split("</a>").join("</a>&nbsp;&nbsp;");
    toggleOverlay('on');
    $detailViewTitle.html($projectSummary.find("h2").html());
    $detailViewContent.html(html);

    // FIXME: just a quick solution to add id query param to URL
    window.history.pushState(id, "", window.location.href.split("?")[0] + "?id=" + id);
  };

  var toggleOverlay = function(onOrOff) {
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
  };

  $(".project").on('click', function() {
    showDetailsModal($(this).attr('id'));
  });
  $("#close-control").on('click', function() {
    toggleOverlay('off');
  });

  if ( window.location.href.indexOf("id=") > -1 ) {
    var queryParams = window.location.href.split("?")[1].split("&");
    var currentProjectId;
    queryParams.forEach(function(param) {
      if ( param.substr(0,3) === 'id=' ) {
        currentProjectId = param.substr(3);
      }
    });
    showDetailsModal(currentProjectId);
  }
};

/* pulse maker */

var PulseMaker = {
  'url' : "https://spreadsheets.google.com/feeds/cells/"+GOOGLE_SHEET_ID+"/1/public/values?alt=json",
  'projects' : [],
  'init': function() {
    newProjectForm.init();
    starred.loadStars();
    PulseMaker.getData(true);
    search.init();
    if (FEATURE.notify) { notify.init(); }
  },
  'getData' : function (firstRun) {
    console.log('Getting data from Google Spreadsheet.');
    $.getJSON( PulseMaker.url, function( data ) {
      // succeeded!
      PulseMaker.projects = PulseMaker.parseGoogleSheetData(data);
      console.log(PulseMaker.projects);
      PulseMaker.renderApp(firstRun);
    }).error(function() {
      console.log("Failed to fetch data from Google Spreadsheet.");
    }).complete( function() {
      // AJAX call is done (whether it was successful or failed)
      console.log("Ajax call to Google Spreadsheet has finished.");
    });   
  },
  'renderApp': function(firstRun) {
    var sortedProjects = PulseMaker.sortByTimestamp(PulseMaker.projects);
    var newestTimestamp = Date.parse(sortedProjects[0].Timestamp);
    var newestTitle = sortedProjects[0].Title;
    if (FEATURE.notify) { 
      var updated = notify.checkForUpdates(newestTimestamp,newestTitle); 
      console.log('updated: ',updated);
    }
    if (updated || firstRun) {
      PulseMaker.clearProjectLists();
      PulseMaker.renderProjectsIntoView(sortedProjects); 
    }
    document.getElementById('loading').style.display = 'none';
    PulseMaker.toggleAdditionalFeatures();
    setTimeout(function(){ 
      PulseMaker.dismissSplash();
    }, 250);

    // detail view handler
    enableDetailView();
  },
  'dismissSplash' : function() {
    var siteHeader = document.getElementById('siteHeader');
    siteHeader.classList.add('dismissed');
    var remove = setTimeout(function(){ 
      siteHeader.style.display = 'none';
    }, 500);

  },
  'sortByTimestamp' : function (data) {
    var sorted = _.orderBy( data, function(o) { 
      var timestamp = Date.parse(o.Timestamp);
      return timestamp;
    }, 'desc');
    return sorted;
  },
  'renderProjectsIntoView' : function(sortedData) {
    $.each( sortedData, function( projectID, projectData ) { // @todo replace jquery
      ProjectCard.render(projectData);
    });
  },
  'refresh' : function () {
    console.log('refresh');
    PulseMaker.getData(false);
  },
  'clearProjectLists' : function () {
    fadeUpdate.fadeOut();
    document.getElementById('loading').style.display = 'block';
    var lists = document.querySelectorAll('.projectList');
    Array.prototype.forEach.call(lists, function(list, i){
      list.innerHTML = '';
    });
  },
  'toggleAdditionalFeatures' : function () {
    if (FEATURE.orphans) { typography.preventTextOrphans(); }
    fadeUpdate.fadeIn();
    starred.init();
  },
  'parseGoogleSheetData': function(driveData) {
    // Formats JSON data returned from Google Spreadsheet and formats it into
    // an array with a series of objects with key value pairs like "column-name":"value"
    var headings = {};
    var newData = {};
    var finalData = [];
    var entries = driveData.feed.entry;

    for(var i = 0; i < entries.length; i++){
      var entry = entries[i];
      var row = parseInt(entry.gs$cell.row);
      var col = parseInt(entry.gs$cell.col);
      var value = entry.content.$t;

      if(row == 1) {
        headings[col] = value;
      }

      if(row > 1) {
        if(!newData[row]) {
          newData[row] = {};
        }
        newData[row][headings[col]] = value;
      }
    }

    for(var k in newData){
      finalData.push(newData[k]);
    }

    return finalData;
  }
};

// initialize network pulse
PulseMaker.init();

