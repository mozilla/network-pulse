import React from 'react';
import { Link } from 'react-router';
import validator from '../../../js/form-validator';
import IssuesField from '../../../components/form-fields/issues.jsx';

let IssuesLabel = () => {
  return <div>Your <Link to="/issues" target="_blank">Key Internet Issues</Link> interest.</div>;
};

module.exports = {
  "custom_name": {
    type: `text`,
    label: <div>Name <em>(*required field)</em></div>,
    placeholder: ``,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator(),
      validator.maxLengthValidator(70)
    ]
  },
  "user_bio": {
    type: `textarea`,
    label: <div>Bio <em>(do not include any personal information)</em></div>,
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
    ]
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
    label: <div>Profile pic <em>(only submit photos you have permission to use in this context)</em></div>,
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
  }
};
