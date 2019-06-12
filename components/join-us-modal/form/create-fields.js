import React from "react";
import validator from "../../../js/form-validator";

module.exports = function(user, profile) {
  let step1 = {
    custom_name: {
      type: `text`,
      placeholder: ``,
      defaultValue: profile.custom_name || user.name,
      fieldClassname: `form-control`,
      validator: [
        validator.emptyValueValidator(),
        validator.maxLengthValidator(70)
      ]
    },
    email: {
      type: `text`,
      defaultValue: user.email,
      fieldClassname: `form-control`
    },
    newsletter: {
      // TODO:FIXME: not sure if Pulse API supports this?
      type: `checkbox`,
      labelClassname: `body-small`,
      label: (
        <div className="d-inline-block">
          <span style={{ background: `Aquamarine` }}>
            (Not sure if API supports this yet?)
          </span>{" "}
          Yes, I want to receive email updates about Mozilla’s campaigns.
        </div>
      )
    }
  };

  let step2 = {
    user_bio: {
      optional: true,
      type: `textarea`,
      placeholder: `Add bio`,
      defaultValue: profile.user_bio,
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
      // defaultValue: `http://test.example.com:8000${profile.thumbnail}`,
      defaultValue: `${profile.thumbnail}`,
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
