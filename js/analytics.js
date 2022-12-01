import ReactGA from "react-ga";

let Analytics = {};

function checkDoNotTrack() {
  // Treat server-side prerender as "do not track". If JS is enabled, the
  // React app will load client-side and add in GA later if permitted.
  if (typeof window === `undefined`) return true;

  // Check user's DNT setting is script is being run client-side
  let _dntStatus = navigator.doNotTrack || navigator.msDoNotTrack,
    fxMatch = navigator.userAgent.match(/Firefox\/(\d+)/),
    ie10Match = navigator.userAgent.match(/MSIE 10/i),
    w8Match = navigator.appVersion.match(/Windows NT 6.2/);

  if (fxMatch && Number(fxMatch[1]) < 32) {
    _dntStatus = `Unspecified`;
  } else if (ie10Match && w8Match) {
    _dntStatus = `Unspecified`;
  } else {
    _dntStatus =
      {
        0: `Disabled`,
        1: `Enabled`,
      }[_dntStatus] || `Unspecified`;
  }

  return _dntStatus === `Enabled`;
}

// Are we allowed to track?
if (checkDoNotTrack() === false) {
  // build our analytics export
  Analytics = {
    ReactGA,
    initialize: () => {
      const getIdentifier = (type = "ga") => {
        const meta = document.querySelector(`meta[name="${type}-identifier"]`);

        if (!meta) return;

        let identifier = meta.getAttribute(`content`);

        if (!identifier) {
          console.warn(
            `No ${type.toUpperCase()} identifier found: skipping bootstrap step`
          );
        }

        return identifier;
      };

      ReactGA.initialize(getIdentifier(`ga`));
    },
  };
}

// If we're not allowed to track, return a "no-op" API object.
else {
  function noop() {}

  Analytics = {
    ReactGA: {
      initialize: noop,
      event: noop,
    },
    initialize: noop,
  };
}

export default Analytics;
