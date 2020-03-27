import React from "react";
import { Helmet } from "react-helmet";

const ISSUE_MAPPING = {
  "privacy-and-security": `Privacy & Security`,
  openness: `Openness`,
  decentralization: `Decentralization`,
  "web-literacy": `Web Literacy`,
  "digital-inclusion": `Digital Inclusion`
};

const Utils = {
  // transform all snake_case keys in an object into camelCase format
  processEntryData(obj) {
    let out = {};

    Object.keys(obj).forEach(key => {
      let rekey = key.replace(/_(\w)/g, (a, b) => b.toUpperCase());

      out[rekey] = obj[key];
    });
    return out;
  },

  inBrowser() {
    return typeof window !== "undefined";
  },

  getCurrentURL() {
    if (Utils.inBrowser()) {
      return window.location.toString();
    }
    return console.error(`No window available to get the current url!`);
  },

  getIssueNameFromUriPath(path) {
    return ISSUE_MAPPING[path] || ``;
  },

  getUriPathFromIssueName(issueName) {
    for (let key in ISSUE_MAPPING) {
      if (ISSUE_MAPPING[key] === issueName) return key;
    }

    return ``;
  },

  getSlugFromHelpTag(helpTag) {
    // turns help type into a prettier string so we can use it as slug
    // e.g., "Plan & organize" becomes "plan-and-organize"

    return helpTag
      .split(` `)
      .map(word => encodeURIComponent(word.replace(/&/g, `and`)).toLowerCase())
      .join(`-`);
  },

  getHelpTagFromSlug(slug) {
    // turns help type slug into a string Pulse API recognizes as helpType
    // e.g., "plan-and-organize" becomes "plan & organize"

    return slug
      .split(`-`)
      .map(word => decodeURIComponent(word.replace(/\band\b/g, `&`)))
      .join(` `);
  },

  generateMetaTags(metaTitle, metaDescription, metaImage) {
    metaTitle = metaTitle ? `${metaTitle} – Mozilla Pulse` : null;

    // <Helmet> requires meta tags to be immediate children of it.
    // So using array is the cleanest way to implement the following.
    // vs <Helmet>
    //      {metaTile && <title ...>}
    //      {metaTile && <meta ...>}
    //      {metaTile && <meta ...>}
    //    </Helmet>
    //

    let titleTags = metaTitle && [
      <title key="title">{metaTitle}</title>,
      <meta name="twitter:title" content={metaTitle} key="twitter:title" />,
      <meta property="og:title" content={metaTitle} key="og:title" />
    ];

    let descriptionTags = metaDescription && [
      <meta name="description" content={metaDescription} key="descripiton" />,
      <meta
        name="twitter:description"
        content={metaDescription}
        key="twitter:description"
      />,
      <meta
        property="og:description"
        content={metaDescription}
        key="og:description"
      />
    ];

    let imageTag = metaImage && (
      <meta property="og:image" content={metaImage} />
    );

    return (
      <Helmet>
        {titleTags}
        {descriptionTags}
        {imageTag}
      </Helmet>
    );
  }
};

export default Utils;
