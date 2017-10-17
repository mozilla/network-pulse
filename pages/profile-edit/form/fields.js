import React from 'react';
import { Link } from 'react-router';
import IssuesField from '../../../components/form-fields/issues.jsx';
import HelpTypesField from '../../../components/form-fields/help-types.jsx';

// FIXME:TO: field names are subject to changes. Once we figure out what fields backend is accepting.

let IssuesLabel = () => {
  return <div>Your <Link to="/issues" target="_blank">Key Internet Issues</Link> interest.</div>;
};

module.exports = {
  "city_country": {
    type: `text`,
    label: `City, Country`,
    placeholder: `Vancouver, Canada`,
    fieldClassname: `form-control`,
    validator: []
  },
  "languages": {
    type: `text`,
    label: `Languages`,
    placeholder: `English, Türkçe`,
    fieldClassname: `form-control`,
    validator: []
  },
  "bio": {
    type: `textarea`,
    label: `Bio`,
    placeholder: `About you`,
    fieldClassname: `form-control`,
    validator: []
  },
  "twitter": {
    type: `text`,
    label: `Twitter`,
    placeholder: `https://twitter.com/username`,
    fieldClassname: `form-control`,
    validator: []
  },
  "linkedin": {
    type: `text`,
    label: `LinkedIn`,
    placeholder: `https://linkedin.com/in/username`,
    fieldClassname: `form-control`,
    validator: []
  },
  "github": {
    type: `text`,
    label: `GitHub`,
    placeholder: `https://github.com/username`,
    fieldClassname: `form-control`,
    validator: []
  },
  "website": {
    type: `text`,
    label: `Your website URL`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: []
  },
  "thumbnail": {
    type: `image`,
    label: `Profile pic`,
    prompt: `Select image`,
    fieldClassname: `form-control`,
    validator: []
  },
  "issues": {
    type: IssuesField,
    label: <IssuesLabel />,
    colCount: 1
  },
  "help_types": {
    type: HelpTypesField,
    label: `You can help other people with.`,
  },
  "show_fav": {
    type: `checkboxGroup`,
    label: `Allow anyone to see a list of posts I have favoritied.`,
    options: [ `Yes, please show my favs` ],
    colCount: 1
  }
};
