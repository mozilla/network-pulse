/* notifications */

var Notifier = {
  defaultInterval: 1*60*1000,
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
  checkForUpdates: function(newestTimestamp,newestTitle) {
    var updated = false;
    var lastProject = Number(localStorage.getItem("lastProject")); 
    if (lastProject && lastProject < newestTimestamp) { 
      var notification = 'Check out ' + newestTitle;
      this.create(notification);
      updated = true;
    }
    localStorage.setItem("lastProject",newestTimestamp);
    return updated;
  },
  init: function(action,interval) {
    if (action && typeof action === 'function') {
      setInterval(action, interval || this.defaultInterval);
    }
  }
};
