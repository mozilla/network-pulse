

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
}


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
	'fadeOut' : function (elem) {
		elem.classList.add('fadeUpdate');
	},
	'fadeIn' : function (elem) {
		elem.classList.remove('fadeUpdate');
	},
	'fadeOutIn' : function (elem) {
		fadeUpdate.fadeOut(elem);
		setTimeout( function () {
			fadeUpdate.fadeIn(elem);
		}, 250)
	},
};


/* render projects cards */

var project = {};



project.getID = function (projectData) {
	var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
	var id = timestamp ? Date.parse(timestamp) : '0';
	return id; 
}

// project.getID = function (projectData) {
// 	var timestamp = projectData.Timestamp ? projectData.Timestamp : false;
// 	console.log('timestamp',timestamp);
// 	var id = timestamp ? timestamp.replace(/-|:|\s|\//gi, '') : '0';
// 	var id = 'p' + id;
// 	return id; 
// }

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
	var html = '<div id="p' + id + '" class="project ' + color + featured + '" data-created="' + id + '" data-favorites="' + favorites + '" ' + '>' + title + creator + description + interest + links + '<div class="star"></div></div>';

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

	project.addPattern(projectData);
};

project.hideProject = function (element) {
    element.style.display = 'none';
    dismissed.addDismissed(element.id);
};

project.shrinkProject = function (element) {
    element.classList.add = 'shrunken';
    setTimeout(function(){ project.hideProject(element) }, 500);
};

project.checkSwipe = function (element,deltaX) {
    var width = element.offsetWidth;
    var threshold = width / -3;
    var purgatory = (width * -1) - 50;
    if (deltaX < threshold ) { 
        element.style.left = purgatory + 'px';
        setTimeout(function(){ project.shrinkProject(element) }, 500);
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
	'toggleFormButton' : document.getElementById('toggleFormButton'),
	'getDisplayState' : function () {
		var state = newProjectForm.formContainer.style.display;
		return state;
	},
	'showForm' : function (){
		newProjectForm.formContainer.style.display = 'block';
		filterProjects.projectContainer.style.display = 'none';
		newProjectForm.toggleFormButton.style.transform = 'rotate(45deg)';
	},
	'hideForm' : function (){
		newProjectForm.formContainer.style.display = 'none';
		filterProjects.projectContainer.style.display = 'block';
		newProjectForm.toggleFormButton.style.transform = 'rotate(0deg)';
		setTimeout(function(){ projectData.getData(); }, 250);
	},
	'toggleForm' : function () {	
		var displayState = newProjectForm.getDisplayState();
		displayState === 'block' ? newProjectForm.hideForm() : newProjectForm.showForm();		 
	},
	'init' : function () {
		newProjectForm.toggleFormButton.onclick = newProjectForm.toggleForm;
	},
};

newProjectForm.init();



/* project filter form */

var filterForm = {
	'container' : document.getElementById('projectFilter'),
	'filterButton' : document.getElementById('filterButton'),
	'filterOptions' : document.getElementById('filterOptions'),
	'filterChoice' : document.getElementById('filterChoice'),
	'filterSort' : document.querySelectorAll('input[name="projectSort"]'),
	'toggleFilters' : function () {
		var filterState = filterForm.container.classList.contains('active');
		filterState ? filterForm.hideFilters() : filterForm.showFilters();
	},
	'showFilters' : function () {
		filterForm.container.classList.add('active');
		// document.onclick = function(e) { /* tap outside to close */
		//     if(e.target != filterForm.filterButton) {
  //       		filterForm.hideFilters;          
  //   		}
		// };
	},
	'hideFilters' : function () {
		filterForm.container.classList.remove('active');
	},
	'updateChoice' : function () {
		filterForm.filterSort = document.querySelector('input[name="projectSort"]:checked');
		filterProjects.updateSort(filterForm.filterSort.id);
		filterForm.hideFilters();
	}, 
	'init' : function () {
		filterForm.filterButton.onclick = filterForm.toggleFilters;
		Array.prototype.forEach.call(filterForm.filterSort, function(el, i){
			el.onchange = filterForm.updateChoice;
		});	
	},
};



/* search filter */

var search = {};




/* project list filtering */

var filterProjects = {
	'projectContainer' : document.getElementById('projectContainer'),
	'updateSort' : function (choice) {
		fadeUpdate.fadeOutIn(filterProjects.projectContainer);
		switch (choice) {
			case 'featured' : 
				filterProjects.showFeaturedProjects();
				break;
			case 'recent' : 
				filterProjects.showRecentProjects();
				break;
			case 'favorite' : 
				filterProjects.showFavoriteProjects();
				break;
			case 'popular' : 
				filterProjects.showPopularProjects();
				break;
			default : 
				filterProjects.showRecentProjects();
		};
	},
	'showFeaturedProjects' : function () {
		filterProjects.projectContainer.classList.remove('showFavorites');
		filterProjects.projectContainer.classList.add('showFeatured');
		filterForm.filterChoice.innerHTML = 'Show featured';
	},
	'showFavoriteProjects' : function () {
		var starred = document.querySelector('.starred');
		if ( !starred ) {
			alert('You haven\'t starred any favorites yet.');
			document.querySelector('input[id="recent"]').checked=true;
			filterProjects.projectContainer.classList.remove('showFeatured');
			filterForm.filterChoice.innerHTML = 'Show recent';
		} else {
			filterProjects.projectContainer.classList.remove('showFeatured');
			filterProjects.projectContainer.classList.add('showFavorites');
			filterForm.filterChoice.innerHTML = 'My Favorites';			
		};
	},
	'showPopularProjects' : function () {
		filterProjects.projectContainer.classList.remove('showFeatured');
		filterProjects.projectContainer.classList.remove('showFavorites');
		filterForm.filterChoice.innerHTML = 'Popular (not yet available)';
	},
	'showRecentProjects' : function () {
		filterProjects.projectContainer.classList.remove('showFeatured');
		filterProjects.projectContainer.classList.remove('showFavorites');
		filterForm.filterChoice.innerHTML = 'Show recent';
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
}

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
		status ? project.classList.remove('starred') : project.classList.add('starred');
		if (!status) { 
			starred.saveStar(project.id);
		} else {
			starred.deleteStar(project.id);
		};
	},
	'loadStars' : function () {
		var starIDs = localStorage.getItem("pulse"); 
		if (!starIDs) { return false; }
		starred.list = starIDs.split(',');
	},
	'showStars' : function () {
		Array.prototype.forEach.call(starred.list, function(el, i){
			var project = document.getElementById(el);
			if (project) { project.classList.add('starred'); };
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
}


/* reformat on scroll */


var scrollStyle = {
	'siteHeader' : document.getElementById('siteHeader'),
	'formatHeader' : function () {
	    if (document.documentElement.scrollTop > 50 || document.body.scrollTop > 50) {
	        scrollStyle.siteHeader.classList.add("minimized");
	    } else {
	        scrollStyle.siteHeader.classList.remove("minimized");
	    }		
	},
	'init' : function () {
		window.onscroll = function () { scrollStyle.formatHeader(); };		
	},	
}

scrollStyle.init();



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
}


/* notifications */


var notify = {};

notify.checkPermission = function() {
	var permission = false;
	if (!"Notification" in window) {
		// check browser support
	} else if (Notification.permission === "granted") {
		permission = true;
		notify.hideCTA();
		return permission;
	} else if (Notification.permission !== 'denied') {
		// permission unknown
		permission = notify.requestPermission();
		return permission;
	} else {
		return permission;
	}
}

notify.requestPermission = function() {
    var permission = false;
    Notification.requestPermission(function(result) {
        if (result === 'denied') {
          return false;
        } else if (result === 'default') {
          return false;
        } else { // accepted
          notify.hideCTA();
          return true;
        }
    });
}

notify.hideCTA = function() {
 	document.getElementById('notificationsCTA').style.display = 'none';
}

notify.create = function(notice) {
	var permission = notify.checkPermission();
	if (permission) { 
		var notification = new Notification('Mozilla Pulse', { body: notice });
	}
}

notify.checkForUpdates = function(newestTimestamp,newestTitle){
	var updated = false;
	var lastProject = Number(localStorage.getItem("lastProject")); 
	if (lastProject && lastProject < newestTimestamp) { 
		var notification = 'New project. Check out ' + newestTitle;
		notify.create(notification);
		updated = true;
	}
	localStorage.setItem("lastProject",newestTimestamp);
	return updated;
}



notify.init = function(){
  var addNotificationsButton = document.getElementById('addNotifications');
  addNotificationsButton.onclick = function(){
      notify.requestPermission();
  };
  var testNotificationsButton = document.getElementById('testNotifications');
  testNotificationsButton.onclick = function(){
      notify.create('Test notification');
  };
}




/* project data */


var projectData = {
	'url' : 'https://sheetsu.com/apis/0144610c',
	'projects' : {},
	'getData' : function (firstRun) {
		console.log('getData');
		$.getJSON( projectData.url, function( data ) {
			var sortedData = projectData.sortByTimestamp(data.result);
			var newestTimestamp = Date.parse(sortedData[0].Timestamp);
			var newestTitle = sortedData[0].Title;
			var updated = notify.checkForUpdates(newestTimestamp,newestTitle);
			if (updated || firstRun) {
				projectData.clearProjectLists();
				projectData.renderData(sortedData);	
			}
		}).done( function() {
			console.log('gotData');
			document.getElementById('loading').style.display = 'none';
			projectData.processData();
		});		
	},
	'sortByTimestamp' : function (data) {
		var sorted = _.orderBy( data, function(o) { 
			var timestamp = Date.parse(o.Timestamp);
			return timestamp;
		}, 'desc');
		return sorted;
	},
	'renderData' : function(sortedData) {
		$.each( sortedData, function( projectID, projectData ) {
			project.render(projectData);
		});
	},
	'processData' : function () { // init most things here
		// typography.preventTextOrphans(); // @todo screwing things up
		filterForm.init(); // @todo deprecate
		filterForm.updateChoice('recent');
		dismissed.init();
		starred.init();
		touch.init();
	},
	'getProjectElements' : function () {
		var projects = document.querySelectorAll('.project');
		return projects;
	},
	'refresh' : function () {
		projectData.getData(false);
	},
	'clearProjectLists' : function () {
		document.getElementById('projectContainer').classList.add('fadeUpdate');
		document.getElementById('loading').style.display = 'block';
		var lists = document.querySelectorAll('.projectList');
		Array.prototype.forEach.call(lists, function(list, i){
			list.innerHTML = '';
		});
	}
};

starred.loadStars();
dismissed.loadDismissed();
notify.init();
projectData.getData(true);

var getDelay = 10 * 60 * 1000;
var getProjects = setInterval(projectData.refresh, getDelay);
