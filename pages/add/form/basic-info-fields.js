import validator from './validator';

module.exports = {
  title: { // required field
    type: `text`,
    label: `Title: Keep it simple. Name it, don't describe it.`,
    placeholder: `Title`,
    labelClassname: `required`,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator(),
      validator.maxLengthValidator(80)
    ],
    charLimit: 140
  },
  'content_url': { // required field
    type: `text`,
    label: `URL`,
    placeholder: `https://example.com`,
    labelClassname: `required`,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator(),
      validator.urlValidator()
    ]
  },
  description: {
    type: `textarea`,
    label: `Description: Simple, brief language works best. No jargon.`,
    placeholder: `Description`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(600)
  },
};
