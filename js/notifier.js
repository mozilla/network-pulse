/* notifications */

var Notifier = {
  LOCALSTORAGE_KEY: "pulse-newestProjectTimestamp",
  checkPermission: function() {
    var permission = false;
    if (Notification.permission === "granted") {
      console.log('permission granted');
      permission = true;
      return permission;
    } else if (Notification.permission !== 'denied') {
      console.log('permission unknown');
      // permission unknown
      permission = this.requestPermission();
      return permission;
    } else {
      console.log('permission denied');
      return permission;
    }
  },
  requestPermission: function() {
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
  },
  create: function(notice) {
    if ("Notification" in window) {
      var permission = this.checkPermission();
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
  },
  checkForUpdates: function(sortedProjects) {
    var updated = false;
    var newestProject = sortedProjects[0];
    var newestTimestamp = Date.parse(newestProject.Timestamp);
    var localStorageKey = this.LOCALSTORAGE_KEY;
    var newestTimestampInStorage = localStorage.getItem(localStorageKey);
    var onInitialLoad = !newestTimestampInStorage;
    var hasUpdates = Number(newestTimestampInStorage) < newestTimestamp;

    if ( onInitialLoad || hasUpdates ) {
      var notification = 'Check out ' + newestProject.Title;
      this.create(notification);
      localStorage.setItem(localStorageKey,newestTimestamp);
      updated = true;
    }

    return updated;
  }
};
