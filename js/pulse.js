

/* color project cards */

var colors = {
	'names' : ['orange','blue','bluegreen','purple','red'],
	'id' : 0,
	'getColor' : function (){
		color = colors.names[colors.id];
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

project.buildHTML = function (projectID, projectData) {
	// format available data
	var URL = projectData.URL ? projectData.URL : '';
	var link = '<p><a href="' + URL + '">' + URL + '</a></p>';
	var title = projectData.Title ? '<h2>' + projectData.Title + '</h2>' : '';
	var creator = projectData.Creator ? '<h3>' + projectData.Creator + '</h3>' : '';
	var description = projectData.Description ? '<p class="description">' + projectData.Description + '</p>' : '';
	var interest = projectData.Interest ? '<p class="interest">' + projectData.Interest + '</p>' : '';
	var favorites = projectData.Favorites ? projectData.Favorites : 0;
	var featured = projectData.Featured ? ' featured' : '';

	// rotate colors
	var color = colors.getColor();

	// assemble html
	var html = '<div id="p' + projectID + '" class="project ' + color + featured + '" data-favorites="' + favorites + '" ' + '>' + title + creator + description + interest +link + '<div class="star"></div></div>';

	return html;
};

project.render = function (projectID, projectData) {
	var featured = projectData.Featured;
	var html = project.buildHTML(projectID, projectData);
	if (featured) {
		$('#featuredProjects').append(html);
	} else {
		$('#recentProjects').append(html);
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
		filterProjects.projectContainer.style.display = 'flex';
		newProjectForm.toggleFormButton.style.transform = 'rotate(0deg)';
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
		document.onclick = function(e) { /* tap outside to close */
		    if(e.target != filterForm.filterButton) {
        		filterForm.hideFilters;          
    		}
		};
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




/* favorite stars */

var starred = {
	'getStarred' : function () {
		var allStarred = document.querySelectorAll('.starred');
		return allStarred;
	},
	'toggle' : function (event) {
		var star = event.target;
		var project = star.parentElement;
		var starred = project.classList.contains('starred');
		starred ? project.classList.remove('starred') : project.classList.add('starred');
	},
	'init' : function () {
		var emptyStars = document.querySelectorAll('.star');
		Array.prototype.forEach.call(emptyStars, function(el, i){
			el.onclick = starred.toggle;
		});	
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


/* project data */


var projectData = {
	'url' : 'https://sheetsu.com/apis/0144610c',
	'getData' : function () {
		console.log('getData');
		$.getJSON( projectData.url, function( data ) {
			$.each( data.result, function( projectID, projectData ) {
				project.render(projectID, projectData);
			});
		}).done( function() {
			console.log('gotData');
			document.getElementById('loading').style.display = 'none';
			projectData.processData();
		});		
	},
	'processData' : function (){ // init most things here
		typography.preventTextOrphans();
		filterForm.init();
		filterForm.updateChoice('recent');
		starred.init();
	},
};

projectData.getData();



