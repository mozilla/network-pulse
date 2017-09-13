import React from 'react';
import { Link } from 'react-router';
import validator from '../../../js/form-validator';
import IssuesField from '../../../components/form-fields/issues.jsx';
// import HelpTypesField from '../../../components/form-fields/help-types.jsx';

// TODO:FIXME: field names are subject to changes. Once we figure out what fields backend is accepting.

let IssuesLabel = () => {
  return <div>Your <Link to="/issues" target="_blank">Key Internet Issues</Link> interest.</div>;
};

module.exports = {
  "custom_name": {
    type: `text`,
    label: `Public name`,
    placeholder: ``,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator()
    ]
  },
  // TODO:FIXME: backend currently doesn't have this field
  // "city_country": {
  //   type: `text`,
  //   label: `City, Country`,
  //   placeholder: `Vancouver, Canada`,
  //   fieldClassname: `form-control`,
  //   validator: []
  // },

  // TODO:FIXME: backend currently doesn't have this field
  // "languages": {
  //   type: `text`,
  //   label: `Languages`,
  //   placeholder: `English, Türkçe`,
  //   fieldClassname: `form-control`,
  //   validator: []
  // },

  "user_bio": {
    type: `textarea`,
    label: `Bio`,
    placeholder: `About you`,
    fieldClassname: `form-control`,
    validator: [
      validator.maxLengthValidator(140)
    ]
  },
  "twitter": {
    type: `text`,
    label: `Twitter`,
    placeholder: `https://twitter.com/username`,
    fieldClassname: `form-control`,
    validator: [
      validator.urlValidator(`Twitter`)
    ],
    value: `aaa`
  },
  "linkedin": {
    type: `text`,
    label: `LinkedIn`,
    placeholder: `https://linkedin.com/in/username`,
    fieldClassname: `form-control`,
    validator: [
      validator.urlValidator(`LinkedIn`)
    ]
  },
  "github": {
    type: `text`,
    label: `GitHub`,
    placeholder: `https://github.com/username`,
    fieldClassname: `form-control`,
    validator: [
      validator.urlValidator(`GitHub`)
    ]
  },
  "website": {
    type: `text`,
    label: `Your website URL`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: [
      validator.urlValidator()
    ]
  },
  "thumbnail": {
    type: `image`,
    label: `Profile pic`,
    prompt: `Select image`,
    fieldClassname: `form-control`,
    validator: [
      validator.imageTypeValidator(),
      validator.imageSizeValidator(),
      validator.imageFilenameValidator()
    ]
  },
  "issues": {
    type: IssuesField,
    label: <IssuesLabel />,
    colCount: 1
  },

  // TODO:FIXME: backend currently doesn't have this field
  // "help_types": {
  //   type: HelpTypesField,
  //   label: `You can help other people with.`,
  // },

  // TODO:FIXME: backend currently doesn't have this field
  // "show_fav": {
  //   type: `checkboxGroup`,
  //   label: `Allow anyone to see a list of posts I have favoritied.`,
  //   options: [ `Yes, please show my favs` ],
  //   colCount: 1
  // }
};
