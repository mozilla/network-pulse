import url from "url";
import { env } from "./env-server";

export default function (cspNonce) {
  return {
    directives: {
      defaultSrc: [`'none'`],
      scriptSrc: [
        `'self'`,
        `'nonce-${cspNonce}'`,
        `https://www.google-analytics.com`,
        `https://platform.twitter.com/widgets.js`,
        `https://*.googletagmanager.com`,
        `https://www.google.com/recaptcha/api.js`,
        `https://www.gstatic.com/recaptcha/releases/`,
        `https://tagmanager.google.com`,
      ],
      fontSrc: [
        `'self'`,
        `https://code.cdn.mozilla.net`,
        `https://fonts.gstatic.com`,
        `data:`,
      ],
      frameSrc: [`https://www.google.com/`, `https://platform.twitter.com/`],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        `https://code.cdn.mozilla.net`,
        `https://fonts.googleapis.com`,
        `https://tagmanager.google.com`,
      ],
      imgSrc: [`'self'`, `data:`, `https:`, `http:`],
      connectSrc: [
        `'self'`,
        url.parse(env.PULSE_API).host ||
          `https://network-pulse-api-staging.herokuapp.com/`,
        `https://www.mozilla.org/en-US/newsletter/`,
        `https://www.google.com/recaptcha/api.js`,
        `https://www.gstatic.com/recaptcha/releases/`,
        `https://*.google-analytics.com`,
        `https://*.analytics.google.com`,
        `https://*.googletagmanager.com`,
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
}
