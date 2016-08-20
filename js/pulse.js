// Your Google Drive Spreadsheet URL
var GOOGLE_SHEET_ID = "1vmYQjQ9f6CR8Hs5JH3GGJ6F9fqWfLSW0S4dz-t2KTF4";
var REFRESH_INTERVAL = 1*60*1000; // 60 secs

var FEATURE = {
  'orphans' : false,// @todo screwing things for notifications??!
  'notify' : false // this turns on both auto app refresh and browser notification
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

/* add new project form */

var newProjectForm = {
  'formContainer' : document.getElementById('add-project-form'),
  'projectContainer' : document.getElementById('project-container'),
  'toggleFormButton' : document.getElementById('toggle-form-button'),
  'getDisplayState' : function () {
    var state = newProjectForm.formContainer.style.display;
    return state;
  },
  'showForm' : function (){
    newProjectForm.formContainer.style.display = 'block';
    newProjectForm.projectContainer.style.display = 'none';
    newProjectForm.toggleFormButton.style.transform = 'rotate(45deg)';
    newProjectForm.toggleFormButton.title = 'Close Form';
    ga('send', {
      hitType: 'event',
      eventCategory: "Add New Button",
      eventAction: 'click'
    });
  },
  'hideForm' : function (){
    newProjectForm.formContainer.style.display = 'none';
    newProjectForm.projectContainer.style.display = 'block';
    newProjectForm.toggleFormButton.style.transform = 'rotate(0deg)';
    newProjectForm.toggleFormButton.title = 'Add something new';
  },
  'toggleForm' : function () {  
    var displayState = newProjectForm.getDisplayState();
    window.scrollTo(0,0);
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

/* pulse maker */

var PulseMaker = {
  PROJECT_ID_PREFIX: "p",
  url: "https://spreadsheets.google.com/feeds/cells/"+GOOGLE_SHEET_ID+"/1/public/values?alt=json",
  projects: [],
  'init': function() {
    newProjectForm.init();
    FavouritesManager.init();
    PulseMaker.getData(true);
    Search.init();
    $("#sign-up-btn").on("click", this.signUpBtnClickHandler);
    
    if (FEATURE.notify) {
      setInterval(PulseMaker.refresh,REFRESH_INTERVAL);
    }
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

    // nav items manager
    NavItemsManager.init();
    // routes handler
    ViewsManager.init(sortedProjects);

    if (FEATURE.notify) { 
      var updated = Notifier.checkForUpdates(sortedProjects);
      console.log('updated: ',updated);
    }
    if (updated || firstRun) {
      // TODO:FIXME: is this check needed?
      // else block means data update was triggered by refresh
      PulseMaker.clearProjectLists();
    }
    document.getElementById('loading').style.display = 'none';
    PulseMaker.toggleAdditionalFeatures();
    setTimeout(function(){ 
      PulseMaker.dismissSplash();
    }, 250);
  },
  'dismissSplash' : function() {
    var splashScreen = document.getElementById('splash-screen');
    splashScreen.classList.add('dismissed');
    var remove = setTimeout(function(){ 
      splashScreen.style.display = 'none';
    }, 500);

  },
  'sortByTimestamp' : function (data) {
    var sorted = _.orderBy( data, function(o) { 
      var timestamp = Date.parse(o.Timestamp);
      return timestamp;
    }, 'desc');
    return sorted;
  },
  'refresh' : function () {
    console.log('refresh');
    PulseMaker.getData(false);
  },
  'clearProjectLists' : function () {
    document.getElementById('loading').style.display = 'block';
  },
  'toggleAdditionalFeatures' : function () {
    if (FEATURE.orphans) { typography.preventTextOrphans(); }
  },
  generatePulseProjectId: function(projectData) {
    var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
    var projectId = timestamp ? Date.parse(timestamp) : '0';

    return this.PROJECT_ID_PREFIX + projectId;
  },
  'parseGoogleSheetData': function(driveData) {
    // Formats JSON data returned from Google Spreadsheet and formats it into
    // an array with a series of objects with key value pairs like "column-name":"value"
    var headings = {};
    var projects = {};
    var parsedData = [];
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
        if(!projects[row]) {
          projects[row] = {};
        }
        projects[row][headings[col]] = value;
      }
    }

    for(var rowNum in projects){
      var projectData = projects[rowNum];
      projectData.id = this.generatePulseProjectId(projectData); 
      parsedData.push(projectData);
    }

    return parsedData;
  },
  signUpBtnClickHandler: function(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: "Sign Up Link",
      eventAction: 'click'
    });
  }
};

// initialize network pulse
PulseMaker.init();

