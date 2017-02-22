import validator from './validator';

module.exports = {
  title: { // required field
    type: `text`,
    label: `Title of the project`,
    placeholder: `Title`,
    labelClassname: `required`,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator(),
      validator.maxLengthValidator(140)
    ]
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
    label: `Describe what you are sharing. Keep it simple and use plain language.`,
    placeholder: `Description`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(600)
  },
};
