import url from 'url';

const FormValidator = {
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
  urlValidator(type = ``) {
    let error = `Not a valid URL. Remember to include protocol (http:// or https://).`;
    if (type === `Twitter` || type === `LinkedIn` || type === `GitHub`) {
      error = `Not a valid URL. Please enter full link to your ${type} page. Don't forget to include protocol (http:// or https://).`;
    }

    return {
      error: error,
      validate: function(value) {
        if (!value) return false;

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
      error: `Only JPG, JPEG, PNG, GIF, or SVG files are accepted.`,
      validate: function(value) {
        if (!value) {
          return;
        }

        let fileName = value.name;
        if (fileName) {
          let extension = fileName.substring(fileName.lastIndexOf(`.`)+1).toLowerCase();
          let allowedExtensions = [
            `jpg`,
            `jpeg`,
            `gif`,
            `png`,
            `svg`
          ];

          return allowedExtensions.indexOf(extension) < 0;
        }
      }
    };
  },
  imageSizeValidator() {
    return {
      error: `File size is over 2MB.`,
      validate: function(value) {
        if (!value) {
          return;
        }

        // there's no file size limit on the backend
        // but it's still good that we enforce a size limit (2MB) on client side
        let base64String = value.base64;
        let sizeLimit = 2097152; // 2MB
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
        if (!value) {
          return;
        }

        let fileName = value.name;
        if (fileName && fileName.length > 2048) {
          return new Error(`File name is over 2048 characters long.`);
        }
      }
    };
  }
};

export default FormValidator;
