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
  tags: {
    type: `text`,
    label: `Keywords to help with search by program, event, campaign, subject …`,
    placeholder: `#mozfest  #code  #tool`,
    fieldClassname: `form-control`
  },
  issues: {
    type: `checkboxGroup`,
    label: `Check any Key Internet Issues that relate to your project.`,
    options: [ `Online Privacy & Security`, `Open Innovation`, `Decentralization`, `Web Literacy`, `Digital Inclusion` ],
    colCount: 1,
    fieldClassname: `form-control`
  },
  'get_involved': {
    type: `text`,
    label: `Looking for support? Describe how people can do that.`,
    placeholder: `Contribute to the code.`,
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
  'thumbnail_url': {
    type: `text`,
    label: `Link to thumbnail image.`,
    placeholder: `https://example.com.png`,
    fieldClassname: `form-control`,
    validator: [
      validator.urlValidator(),
      validator.imageTypeValidator()
    ]
  }
};
