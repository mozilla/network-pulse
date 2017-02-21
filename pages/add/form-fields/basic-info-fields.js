module.exports = {
  title: {
    type: `text`,
    label: `Title of the project`,
    placeholder: `Title`,
    labelClassname: `required`,
    fieldClassname: `form-control`,
    validator: [
      {
        error: `Title cannot be left empty.`,
        validate: function(value) {
          return !value;
        }
      },
      {
        error: `Maximum 140 characters.`,
        validate: function(value) {
          return value && value.length > 140; // return true if value fails validation
        }
      }
    ]
  },
  'content_url': {
    type: `text`,
    label: `URL`,
    placeholder: `https://example.com`,
    labelClassname: `required`,
    fieldClassname: `form-control`,
    validator: {
      error: `Not a valid URL.`,
      validate: function(value) {
        let r = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

        if (!r.test(value)) {
          console.error(`content_url is not a valid url`);
          return !r.test(value);
        }
      }
    }
  },
  description: {
    type: `textarea`,
    label: `Describe what you are sharing. Keep it simple and use plain language.`,
    placeholder: `Description`,
    fieldClassname: `form-control`,
    validator: {
      error: `Maximum 600 characters.`,
      validate: function(value) {
        if (!value) {
          // this is an optional field, it can be left blank
          return;
        }

        return value && value.length > 600; // return true if value fails validation
      }
    },
    // optional: true
  },
};
