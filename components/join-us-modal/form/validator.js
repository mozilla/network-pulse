import url from "url";

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
  imageTypeValidator() {
    return {
      error: `Only JPG, JPEG, PNG, GIF, or SVG files are accepted.`,
      validate: function(value) {
        if (!value) {
          return;
        }

        let fileName = value.name;
        if (fileName) {
          let extension = fileName
            .substring(fileName.lastIndexOf(`.`) + 1)
            .toLowerCase();
          let allowedExtensions = [`jpg`, `jpeg`, `gif`, `png`, `svg`];

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
        if (base64String && base64String.length > (4 / 3) * sizeLimit) {
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

export default Validator;
