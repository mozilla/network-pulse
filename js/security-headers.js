import env from "../config/env.generated.json";

export default {
  directives: {
    defaultSrc: [
      `'none'`
    ],
    scriptSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `https://*.google-analytics.com`
    ],
    fontSrc: [
      `'self'`,
      `https://code.cdn.mozilla.net`
    ],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `https://code.cdn.mozilla.net`
    ],
    imgSrc: [
      `'self'`,
      `data:`,
      `https:`,
      `http:`
    ],
    connectSrc: [
      `'self'`,
      env.PULSE_API || `https://network-pulse-api-staging.herokuapp.com/`
    ],
    childSrc: [
      `'none'`
    ],
    frameAncestors: [
      `'none'`
    ],
    manifestSrc: [
      `'self'`
    ]
  },
  reportOnly: false,
  browserSniff: false
};
