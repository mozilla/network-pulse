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
      error: `Only JPG, JPEG, PNG, GIF, or SVG file is allowed.`,
      validate: function(value) {
        let fileName = value.name;
        if (fileName) {
          fileName = fileName.split(`.`);
          let fileExtention = fileName[fileName.length-1].toLowerCase();
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
  },
  imageSizeValidator() {
    return {
      error: `File size is over 2MB.`,
      validate: function(value) {
        // there's no file size limit on the backend
        // but it's still good that we enforce a size limit (2MB) on client side
        let base64String = value.base64;
        let sizeLimit = Math.pow(2, 20) * 2; // 2MB in bytes
        if (base64String && base64String.length > 4/3 * sizeLimit) {
          return new Error(`File size is over 2MB.`);
        }
      }
    };
  },
  imageFilenameValidator() {
    return {
      error: `File name is over 2048 characters long.`,
      validate: function(value) {
        let fileName = value.name;
        if (fileName && fileName.length > 2048) {
          return new Error(`File name is over 2048 characters long.`);
        }
      }
    };
  }
};

export default Validator;
