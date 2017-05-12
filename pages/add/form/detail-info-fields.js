import validator from './validator';

module.exports = {
  creators: {
    type: `text`,
    label: `Who are the creators? This could be staff, contributors, partners…`,
    placeholder: `Name`,
    fieldClassname: `form-control`,
    multiplicity: 1,
    addLabel: `+ Add another`
  },
  interest: {
    type: `text`,
    label: `Why might this be interesting to other people in our network?`,
    placeholder: ``,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(300)
  },
  issues: {
    type: `checkboxGroup`,
    label: `Check any Key Internet Issues that relate to your project.`,
    options: [ `Online Privacy & Security`, `Open Innovation`, `Decentralization`, `Web Literacy`, `Digital Inclusion` ],
    colCount: 1
  },
  tags: {
    type: `text`,
    label: `Tags: Comma separated. Spaces are ok. Issues are added automatically.`,
    placeholder: `games, best practice, iot, cape town, code, ...`,
    fieldClassname: `form-control`
  },
  'get_involved': {
    type: `text`,
    label: `Looking for support? Describe how people can do that.`,
    placeholder: `Help us test the prototype, plan some local events, contribute to the codebase, ...`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(300)
  },
  'get_involved_url': {
    type: `text`,
    label: `Link for people to get involved.`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: validator.urlValidator()
  },
  'thumbnail': {
    type: `image`,
    label: `Project image: Only submit images that you have permission to use in this context.`,
    prompt: `Select image`,
    helpText: `Looks best at 1200px × 630px`,
    fieldClassname: `form-control`,
    validator: [
      validator.imageTypeValidator(),
      validator.imageSizeValidator(),
      validator.imageFilenameValidator()
    ]
  }
};
