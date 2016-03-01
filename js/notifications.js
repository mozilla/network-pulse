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

notify.checkForUpdates = function(){
  // psuedo
  // var newest = latest timestamp
  // var lastViewed = localstorage latest
  // if (newest > lastViewed) { show notice }
  // else { localstorage = newest }
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

notify.init();

// While the Notification API is not privileged or certified, 
// ...should still be include an entry in manifest.webapp
// "permissions": {
//   "desktop-notification": {
//     "description": "Needed for creating system notifications."
//   }
// }

