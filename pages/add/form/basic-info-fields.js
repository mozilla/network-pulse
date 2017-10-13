import validator from './validator';

let getRemainingCount = (charCount, charLimit) => {
  // show a twitter-style "characters remainig" count
  return charLimit - charCount;
};

module.exports = {
  title: { // required field
    type: `text`,
    label: `Title: Keep it simple. Name it, don't describe it.`,
    placeholder: `Title`,
    labelClassname: `required`,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator()
    ],
    charLimit: 80,
    charLimitText: getRemainingCount
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
    charLimit: 600,
    charLimitText: getRemainingCount
  },
};
