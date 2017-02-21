module.exports = {
  creators: {
    type: `text`,
    label: `Who are the creators? This could be staff, contributors, partners…`,
    placeholder: `Name`,
    fieldClassname: `form-control`,
    multiplicity: 1,
    addLabel: `+ Add another`,
    // optional: true
  },
  interest: {
    type: `text`,
    label: `Why might this be interesting to other people in our network?`,
    placeholder: ``,
    fieldClassname: `form-control`,
    validator: {
      error: `Maximum 300 characters.`,
      validate: function(value) {
        if (!value) {
          // this is an optional field, it can be left blank
          return;
        }

        return value && value.length > 300; // return true if value fails validation
      }
    },
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
    fieldClassname: `form-control`,
    // optional: true
  },
  'get_involved': {
    type: `text`,
    label: `Looking for support? Describe how people can do that.`,
    placeholder: `Contribute to the code.`,
    fieldClassname: `form-control`,
    validator: {
      error: `Maximum 300 characters.`,
      validate: function(value) {
        if (!value) {
          // this is an optional field, it can be left blank
          return;
        }

        return value && value.length > 300; // return true if value fails validation
      }
    },
    // optional: true
  },
  'get_involved_url': {
    type: `text`,
    label: `Link for people to get involved.`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: {
      error: `Not a valid URL.`,
      validate: function(value) {
        if (!value) {
          // this is an optional field, it can be left blank
          return;
        }

        let r = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

        if (!r.test(value)) {
          console.error(`get_involved_url is not a valid url`);
          return !r.test(value);
        }
      }
    }
    // optional: true
  },
  'thumbnail_url': {
    type: `text`,
    label: `Link to thumbnail image.`,
    placeholder: `https://example.com.png`,
    fieldClassname: `form-control`,
    validator: [
      {
        error: `Not a valid image URL. Only JPEG, PNG, GIF, or SVG file is allowed.`,
        validate: function(value) {
          if (!value) {
            // this is an optional field, it can be left blank
            return;
          }

          let r = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\.(jpg|png|gif|svg)$/);

          if (!r.test(value)) {
            console.error(`thumbnail_url is not a valid url`);
            return !r.test(value);
          }
        }
      }
    ],
    // optional: true
  }
};
