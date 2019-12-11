import React from "react";
import validator from "../../../js/form-validator";

export default function(user, profile) {
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
      type: `checkbox`,
      labelClassname: `body-small`,
      label: (
        <div className="d-inline-block">
          Yes, I want to subscribe to Mozilla’s newsletter.
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
