import React from 'react';
import validator from './validator';
import HelpTypesField from '../../../components/form-fields/help-types.jsx';

let fields = {
  'get_involved': {
    type: `text`,
    label: `Looking for support? Describe how people can do that.`,
    placeholder: `Help us test the prototype, plan some local events, contribute to the codebase, ...`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(300)
  },
  'help_types': {
    type: HelpTypesField,
    label: `Pick up to 3 ways that people can help.`,
  },
  'get_involved_url': {
    type: `text`,
    label: `Link for people to get involved.`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: validator.urlValidator()
  }
};

export default fields;
