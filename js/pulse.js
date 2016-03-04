var env = {
	'production' : 'https://sheetsu.com/apis/0144610c',
	'develop' : 'https://sheetsu.com/apis/895dabf3',
};

var feature = {
	'touch' : false,
	'orphans' : false,// @todo screwing things for notifications??!
	'patterns' : true,
	'notify' : true,
	'dismiss' : false,
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
		if (evt.keyCode === 27) { 
			search.dismiss();
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
		search.input.blur();
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



/* render projects cards */

var project = {};

project.getID = function (projectData) {
	var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
	var id = timestamp ? Date.parse(timestamp) : '0';
	return id; 
};

project.buildHTML = function (projectData) {
	// format available data
	var helpURL = projectData['Get involved URL'];
	helpURL = !helpURL ? '' : '<a href="' + helpURL + '">Get Involved &#8599;</a>';
	var projectURL = !projectData.URL ? '' : '<a href="' + projectData.URL + '">Open &#8599;</a>';
	var links = '<p class="projectLinks">' + projectURL + helpURL +  '</p>';
	var title = projectData.Title ? '<h2>' + projectData.Title + '</h2>' : '';
	var creator = projectData.Creator ? '<h3>' + projectData.Creator + '</h3>' : '';
	var description = projectData.Description ? '<p class="description">' + projectData.Description + '</p>' : '';
	var interest = projectData.Interest ? '<p class="interest">' + projectData.Interest + '</p>' : '';
	var favorites = projectData.Favorites ? projectData.Favorites : 0;
	var featured = projectData.Featured ? ' featured' : '';

	var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
	var id = project.getID(projectData);
	var color = colors.getColor('name'); 

	// assemble html
	var html = '<div id="p' + id + '" class="project ' + color + featured + '" data-created="' + id + '" data-favorites="' + favorites + '" ' + '><div class="projectSummary">' + title + creator + description + interest + links + '</div><div class="star"></div></div>';
	return html;
};

project.addPattern = function(projectData){
	var color = colors.getColor('hex'); 
	var pattern = GeoPattern.generate(projectData.Title,{
		color : color,
		baseColor : '333333	'
	});
	pattern = pattern.toDataUrl();

	var id = 'p' + project.getID(projectData);
	document.getElementById(id).style.backgroundImage = pattern;
};

project.render = function (projectData) {
	var id = project.getID(projectData);
	var starStatus = starred.list.indexOf('p' + id);
	var featured = projectData.Featured;
	var html = project.buildHTML(projectData);

	if (starStatus != -1) {
	    $('#starredProjects').append(html);
	} else if (featured) {
		$('#featuredProjects').append(html);
	} else {
		$('#recentProjects').append(html);
	}

	if (feature.patterns) { project.addPattern(projectData); }
};

project.hideProject = function (element) {
    element.style.display = 'none';
    if (feature.dismiss) { dismissed.addDismissed(element.id); }
};

project.shrinkProject = function (element) {
    element.classList.add = 'shrunken';
    setTimeout(function(){ 
    	project.hideProject(element);
    }, 500);
};

project.checkSwipe = function (element,deltaX) {
    var width = element.offsetWidth;
    var threshold = width / -3;
    var purgatory = (width * -1) - 50;
    if (deltaX < threshold ) { 
        element.style.left = purgatory + 'px';
        setTimeout(function(){ 
        	project.shrinkProject(element);
        }, 500);
    } else {
        element.style.left = '0px';
    }
};

project.swipeProject = function (event) {
    var element = event.target;
	if ( !element.classList.contains('project') ) { element = element.parentElement; } // this is weird
	if ( !element.classList.contains('project') ) { element = element.parentElement; } // this is insane
    var deltaX = event.deltaX;
    element.style.left = deltaX + 'px';
    if (event.isFinal) { 
		project.checkSwipe(element,deltaX);
    }
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
		setTimeout(function(){ projectData.getData(); }, 250);
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


/* dismissed */

var dismissed = {
	'list' : [],
	'addDismissed' : function (id) {
		dismissed.list.push(id);
		var projIDs = dismissed.list.toString(); 
		localStorage.setItem("dismissed",projIDs);
	},	
	'loadDismissed' : function () {
		var projIDs = localStorage.getItem("dismissed"); 
		if (!projIDs) { return false; }
		dismissed.list = projIDs.split(',');
	},
	'hideDismissed' : function () {
		Array.prototype.forEach.call(dismissed.list, function(el, i){
			var proj = document.getElementById(el);
			if (proj) { proj.style.display = 'none'; }
		});	
	},
	'clearDismissed' : function () {
		 localStorage.removeItem("dismissed");
		 location.reload();
	},
	'init' : function () {
		dismissed.hideDismissed();
		document.getElementById('clearDismissed').onclick = dismissed.clearDismissed;
	},	
};

/* favorite stars */

var starred = {
	'list' : [],
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






/* touch */

var touch = {
	'init' : function () {
		var width = screen.width;
		if (screen.width < 601) {
			touch.addHandlers();
		}
	},
	'addHandlers' : function () {
		var projects = projectData.getProjectElements();
		Array.prototype.forEach.call(projects, function(element, i){
			touch.i = new Hammer(element);
			touch.i.on("panleft", project.swipeProject);
		});
	}
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
	var getProjects = setInterval(projectData.refresh, notify.interval);
};


/* utility */

var utility = {
	'findContainer' : function(elem, containerClass){
	    while ((elem = elem.parentElement) && !elem.classList.contains(containerClass));
	    return elem;
	},
};


/* project data */

var projectData = {
	'url' : env.develop,
	'projects' : {},
	'getData' : function (firstRun) {
		console.log('getData');
		$.getJSON( projectData.url, function( data ) {
			var sortedData = projectData.sortByTimestamp(data.result);
			var newestTimestamp = Date.parse(sortedData[0].Timestamp);
			var newestTitle = sortedData[0].Title;
			if (feature.notify) { 
				var updated = notify.checkForUpdates(newestTimestamp,newestTitle); 
				console.log('updated: ',updated);
			}
			if (updated || firstRun) {
				projectData.clearProjectLists();
				projectData.renderData(sortedData);	
			}
		}).done( function() {
			console.log('gotData');
			document.getElementById('loading').style.display = 'none';
			projectData.processData();
		    setTimeout(function(){ 
		    	projectData.dismissSplash();
		    }, 250);
		});		
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
	'renderData' : function(sortedData) {
		$.each( sortedData, function( projectID, projectData ) { // @todo replace jquery
			project.render(projectData);
		});
	},
	'getProjectElements' : function () {
		var projects = document.querySelectorAll('.project');
		return projects;
	},
	'refresh' : function () {
		console.log('refresh');
		projectData.getData(false);
	},
	'clearProjectLists' : function () {
		fadeUpdate.fadeOut();
		document.getElementById('loading').style.display = 'block';
		var lists = document.querySelectorAll('.projectList');
		Array.prototype.forEach.call(lists, function(list, i){
			list.innerHTML = '';
		});
	},
	'processData' : function () { // init most things here
		if (feature.orphans) { typography.preventTextOrphans(); }
		fadeUpdate.fadeIn();
		if (feature.dismissed) { dismissed.init(); }
		starred.init();
		if (feature.touch) { touch.init(); }
	},
};

newProjectForm.init();
starred.loadStars();
if (feature.dismiss) { dismissed.loadDismissed(); }
projectData.getData(true);
search.init();
if (feature.notify) { notify.init(); }
