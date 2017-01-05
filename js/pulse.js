// Your Google Drive Spreadsheet URL
var GOOGLE_SHEET_ID = "1vmYQjQ9f6CR8Hs5JH3GGJ6F9fqWfLSW0S4dz-t2KTF4";

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

    PulseMaker.getData(function() {
      PulseMaker.setProjectsUpdated(true);
    });
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
  _projects: [],
  _projectsUpdated: false,
  setProjectsUpdated: function(ifTrue) {
    this._projectsUpdated = ifTrue;
  },
  getProjectsUpdated: function() {
    return this._projectsUpdated ? this._projects : false;
  },
  init: function() {
    newProjectForm.init();
    FavouritesManager.init();
    $("#sign-up-btn").on("click", this.signUpBtnClickHandler);

    PulseMaker.getData(function() {
      ViewsManager.init(PulseMaker._projects);
      NavItemsManager.init();
      Search.init();

      setTimeout(function(){ 
        PulseMaker.dismissSplash();
      }, 2000);
    });
  },
  getData: function(callback) {
    console.log('Getting data from Google Spreadsheet.');
    $.getJSON( PulseMaker.url, function(data) {
      // succeeded!
      var projects = PulseMaker.parseGoogleSheetData(data);
      PulseMaker._projects = PulseMaker.sortByTimestamp(projects);
    }).error(function() {
      console.log("Failed to fetch data from Google Spreadsheet.");
    }).complete( function() {
      // AJAX call is done (whether it was successful or failed)
      console.log("Ajax call to Google Spreadsheet has finished.");
      callback();
    });   
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
  timestampStringToId: function(timestampStr) {
    // timestampStr returned from Google is in the format of "m/dd/yyyy hh:mm:ss"
    // e.g., "9/26/2016 12:59:01"
    var timestamp = {
      month: "", // start froms 1
      day: "",
      year: "",
      hour: "",
      minute: "",
      second: ""
    };
    var formatNumber = function(number) {
      if (number < 10) {
        return "0" + number;
      }
      return number;
    }
    var timestampArr = timestampStr.split(" ");
    var date = timestampArr[0].split("/").map(function(meta,index) {
      if ( index == 0 ) { // month
        timestamp.month = formatNumber(meta);
      } else if ( index == 1 ) { // day
        timestamp.day = formatNumber(meta);
      } else if ( index == 2 ) { // year
        timestamp.year = meta;
      }
    });
    var time = timestampArr[1].split(":").map(function(meta,index) {
      if ( index == 0 ) { // hour
        timestamp.hour = formatNumber(meta);
      } else if ( index == 1 ) { // minute
        timestamp.minute = formatNumber(meta);
      } else if ( index == 2 ) { // second
        timestamp.second = formatNumber(meta);
      }
    });

    return  timestamp.month + 
            timestamp.day + 
            timestamp.year + 
            timestamp.hour + 
            timestamp.minute + 
            timestamp.second;
  },
  generatePulseProjectId: function(projectData) {
    var projectId = false;
    if ( projectData.Timestamp ) {
      projectId = this.PROJECT_ID_PREFIX + PulseMaker.timestampStringToId(projectData.Timestamp);
    }
    return projectId;
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
      var id = this.generatePulseProjectId(projectData);
      if ( id ) {
        projectData.id = id;
        parsedData.push(projectData);
      }
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

