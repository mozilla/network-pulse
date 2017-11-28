import ReactGA from 'react-ga';

export default {
  initialize: function() {
    console.log(`[APP] 123`);
    var _dntStatus = navigator.doNotTrack || navigator.msDoNotTrack;
    var fxMatch = navigator.userAgent.match(/Firefox\/(\d+)/);
    var ie10Match = navigator.userAgent.match(/MSIE 10/i);
    var w8Match = navigator.appVersion.match(/Windows NT 6.2/);

    if (fxMatch && Number(fxMatch[1]) < 32) {
      _dntStatus = `Unspecified`;
    } else if (ie10Match && w8Match) {
      _dntStatus = `Unspecified`;
    } else {
      _dntStatus = { '0': `Disabled`, '1': `Enabled` }[_dntStatus] || `Unspecified`;
    }

    if (_dntStatus !== `Enabled`){
      // if user doesn't have Do Not Track turned on, initialize GA script
      ReactGA.initialize(`UA-87658599-4`);
    }
  },
  logPageView: function() {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#set
    ReactGA.set({ page: window.location.pathname });
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#location
    ReactGA.set({ location: window.location.href, title: window.title });

    ReactGA.pageview(`${window.location.pathname}/${window.location.search}`);
  }
};
