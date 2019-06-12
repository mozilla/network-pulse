import React from "react";
import validator from "./validator";

module.exports = function(user) {
  let step1 = {
    custom_name: {
      type: `text`,
      placeholder: ``,
      // defaultValue: user.name, // TODO:FIXME: custom_name or name?
      fieldClassname: `form-control`,
      validator: [
        validator.emptyValueValidator(),
        validator.maxLengthValidator(70)
      ]
    },
    email: {
      type: `text`,
      // defaultValue: user.email,
      fieldClassname: `form-control`
    },
    newsletter: {
      optional: true,
      // TODO:FIXME: not sure if Pulse API supports this?
      type: `checkbox`,
      labelClassname: `body-small`,
      label: `Yes, I want to receive email updates about Mozilla’s campaigns.`,
    }
  };

  let step2 = {
    user_bio: {
      optional: true,
      type: `textarea`,
      label: ``,
      placeholder: `Add bio`,
      fieldClassname: `form-control`,
      validator: [validator.maxLengthValidator(140)],
      charLimit: 140,
      charLimitText: function(charCount, charLimit) {
        return charLimit - charCount;
      }
    }
  };

  let step3 = {
    thumbnail: {
      optional: true,
      type: `image`,
      label: ``,
      prompt: `Select image`,
      reprompt: `Select another image`,
      fieldClassname: `form-control`,
      validator: [
        validator.imageTypeValidator(),
        validator.imageSizeValidator(),
        validator.imageFilenameValidator()
      ]
    }
  };

  return {
    step1,
    step2,
    step3
  };
};
