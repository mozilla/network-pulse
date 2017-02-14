import env from "../config/env.generated.json";

export default {
  directives: {
    defaultSrc: [
      `'none'`
    ],
    scriptSrc: [
      `'self'`,
      `'unsafe-inline'`
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
      `*`
    ],
    connectSrc: [
      `'self'`,
      env.PULSE_API || `https://network-pulse-api-staging.herokuapp.com/`
    ]
  },
  reportOnly: false,
  browserSniff: false
};
