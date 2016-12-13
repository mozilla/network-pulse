export default {
  PROJECT_ID_PREFIX: `p`,
  parse: function(driveData) {
    // Formats JSON data returned from Google Spreadsheet and formats it into
    // an array with a series of objects with key value pairs like "column-name":"value"
    var headings = {};
    var projects = {};
    var parsedData = [];
    var entries = driveData.feed.entry;

    for(var i = 0; i < entries.length; i++){
      var entry = entries[i];
      var row = parseInt(entry.gs$cell.row,10);
      var col = parseInt(entry.gs$cell.col,10);
      var value = entry.content.$t;

      if(row === 1) {
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
        parsedData.push(this.formatRowEntry(projectData));
      }
    }

    return this.sortByTimestamp(parsedData);
  },
  timestampStringToId: function(timestampStr) {
    // timestampStr returned from Google is in the format of "m/dd/yyyy hh:mm:ss"
    // e.g., "9/26/2016 12:59:01"
    var timestamp = {
      month: ``, // start froms 1
      day: ``,
      year: ``,
      hour: ``,
      minute: ``,
      second: ``
    };
    var formatNumber = function(number) {
      if (number < 10) {
        return `0` + number;
      }
      return number;
    };
    var timestampArr = timestampStr.split(` `);

    timestampArr[0].split(`/`).map((meta,index) => {
      if ( index === 0 ) { // month
        timestamp.month = formatNumber(meta);
      } else if ( index === 1 ) { // day
        timestamp.day = formatNumber(meta);
      } else if ( index === 2 ) { // year
        timestamp.year = meta;
      }
    });

    timestampArr[1].split(`:`).map((meta,index) => {
      if ( index === 0 ) { // hour
        timestamp.hour = formatNumber(meta);
      } else if ( index === 1 ) { // minute
        timestamp.minute = formatNumber(meta);
      } else if ( index === 2 ) { // second
        timestamp.second = formatNumber(meta);
      }
    });

    return timestamp.month +
            timestamp.day +
            timestamp.year +
            timestamp.hour +
            timestamp.minute +
            timestamp.second;
  },
  generatePulseProjectId: function(projectData) {
    let projectId = false;

    if ( projectData.Timestamp ) {
      projectId = this.PROJECT_ID_PREFIX + this.timestampStringToId(projectData.Timestamp);
    }
    return projectId;
  },
  formatRowEntry: function(entry) {
    /* ***** entry properties we are converting into
      id: int
      timestamp: Date
      featured: boolean
      /// Favorites  /// not sure what this is for
      title: string
      /// Status  /// not sure what this is for
      Creators: string
      URL: string
      description: string
      interest: string
      Get involved URL: string
      Get involved: string
      Suggestions & Feedback: string
      Network connection: string
      Origin: string
      Tags: string
      Issues: string
      Program Type: string
      Thumbnail URL: string
      Backup Thumbnail URL: string
    *** */
    return {
      id: entry.id,
      creators: entry.Creators,
      description: entry.Description || ``,
      interest: entry.Interest,
      issues: entry.Issues ? entry.Issues.split(`,`) : [],
      featured: entry.Featured,
      getInvolved: entry[`Get involved`],
      getInvolvedUrl: entry[`Get involved URL`],
      thumbnailUrl: entry[`Thumbnail URL`],
      timestamp: new Date(entry.Timestamp),
      title: entry.Title,
      url: entry.URL
    };
  },
  sortByTimestamp: function(projects) {
    // most recently -> least recently
    return projects.sort((a,b) => {
      return a.timestamp < b.timestamp;
    });
  }
};

// id

// Timestamp  
// Featured  
// Favorites 
// Title 
// Status  
// Creators  
// URL 
// Description 
// Interest  
// Get involved URL  
// Get involved  
// Suggestions & Feedback  
// Network connection  
// Origin  
// Tags  
// Issues  
// Program Type  
// Thumbnail URL
// Backup Thumbnail URL
