import url from "url";
import { env } from "./env-server";

export default {
  directives: {
    defaultSrc: [`'none'`],
    scriptSrc: [
      `'self'`,
      `https://*.google-analytics.com`,
      `https://platform.twitter.com/widgets.js`,
      `https://www.googletagmanager.com/gtm.js`,
      `https://www.googletagmanager.com/debug/bootstrap`,
    ],
    fontSrc: [
      `'self'`,
      `https://code.cdn.mozilla.net`,
      `https://fonts.gstatic.com`,
    ],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      `https://code.cdn.mozilla.net`,
      `https://fonts.googleapis.com`,
    ],
    imgSrc: [`'self'`, `data:`, `https:`, `http:`],
    connectSrc: [
      `'self'`,
      url.parse(env.PULSE_API).host ||
        `https://network-pulse-api-staging.herokuapp.com/`,
      `https://www.mozilla.org/en-US/newsletter/`,
    ],
    childSrc: [
      `https://syndication.twitter.com`,
      `https://platform.twitter.com`,
    ],
    frameAncestors: [`'none'`],
    manifestSrc: [`'self'`],
  },
  reportOnly: false,
  browserSniff: false,
};
