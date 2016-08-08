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

/* search */

var search = {
  'input' : document.getElementById('search-box'),
  'dismissButton' : document.querySelector('#search .dismiss'),
  'projectContainer' : document.getElementById('project-container'),
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
        $("#search-not-found").hide();
      } else {
        // nothing found
        $("#search-not-found").show();
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
    search.dismiss();
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

/* pulse maker */

var PulseMaker = {
  'url' : "https://spreadsheets.google.com/feeds/cells/"+GOOGLE_SHEET_ID+"/1/public/values?alt=json",
  'projects' : [],
  'init': function() {
    newProjectForm.init();
    FavouritesManager.init();
    PulseMaker.getData(true);
    search.init();
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

