import url from 'url';

const Validator = {
  emptyValueValidator() {
    return {
      error: `This field cannot be left blank.`,
      validate: function(value) {
        return !value;
      }
    };
  },
  maxLengthValidator(maxCharLength) {
    return {
      error: `Maximum ${maxCharLength} characters.`,
      validate: function(value) {
        return value && value.length > maxCharLength;
      }
    };
  },
  urlValidator() {
    return {
      error: `Not a valid URL. Remember to include protocol (http:// or https://).`,
      validate: function(value) {
        try {
          let parsedUrl = url.parse(value);

          if (parsedUrl.href.indexOf(`https://`) !== 0 && parsedUrl.href.indexOf(`http://`) !== 0) {
            return true;
          }
        } catch (e) {
          // Do nothing.
          // To check if a field is empty or not use Validator.emptyValueValidator() instead.
        }
      }
    };
  },
  imageTypeValidator() {
    return {
      error: `Only JPEG, PNG, GIF, or SVG file is allowed.`,
      validate: function(value) {
        if (value) {
          value = value.split(`.`);
          let fileExtention = value[value.length-1].toLowerCase();
          let allowedExtensions = [
            `jpg`,
            `jpeg`,
            `gif`,
            `png`,
            `svg`
          ];

          return allowedExtensions.indexOf(fileExtention) < 0;
        }
      }
    };
  }
};

export default Validator;
