import React from "react";
import { Link } from "react-router-dom";
import validator from "../../../js/form-validator";
import IssuesField from "../../../components/form-fields/issues.jsx";

let IssuesLabel = () => {
  return (
    <p className="h5-heading">
      Your{" "}
      <Link to="/issues" target="_blank">
        Key Internet Issues
      </Link>{" "}
      interest
    </p>
  );
};

module.exports = function(showLongBio) {
  let fields = {
    custom_name: {
      type: `text`,
      label: `Name`,
      placeholder: ``,
      labelClassname: `h5-heading required`,
      fieldClassname: `form-control`,
      validator: [
        validator.emptyValueValidator(),
        validator.maxLengthValidator(70)
      ]
    },
    user_bio: {
      type: `textarea`,
      label: `Bio`,
      placeholder: `About you`,
      labelClassname: `h5-heading bio`,
      fieldClassname: `form-control`,
      validator: [validator.maxLengthValidator(140)],
      charLimit: 140,
      charLimitText: function(charCount, charLimit) {
        return charLimit - charCount;
      }
    },
    Twitter: {
      type: `text`,
      label: `Twitter`,
      placeholder: `https://twitter.com/username`,
      labelClassname: `h5-heading`,
      fieldClassname: `form-control`,
      validator: [validator.urlValidator(`Twitter`)]
    },
    Linkedin: {
      type: `text`,
      label: `Linkedin`,
      placeholder: `https://linkedin.com/in/username`,
      labelClassname: `h5-heading`,
      fieldClassname: `form-control`,
      validator: [validator.urlValidator(`LinkedIn`)]
    },
    Github: {
      type: `text`,
      label: `GitHub`,
      placeholder: `https://github.com/username`,
      labelClassname: `h5-heading`,
      fieldClassname: `form-control`,
      validator: [validator.urlValidator(`GitHub`)]
    },
    website: {
      type: `text`,
      label: `Your website URL`,
      placeholder: `https://example.com`,
      labelClassname: `h5-heading`,
      fieldClassname: `form-control`,
      validator: [validator.urlValidator()]
    },
    thumbnail: {
      type: `image`,
      label: `Profile pic`,
      prompt: `Select image`,
      labelClassname: `h5-heading profile-image`,
      fieldClassname: `form-control`,
      validator: [
        validator.imageTypeValidator(),
        validator.imageSizeValidator(),
        validator.imageFilenameValidator()
      ]
    },
    location: {
      type: `text`,
      label: `Your location`,
      placeholder: `City, State, Country`,
      labelClassname: `h5-heading`,
      fieldClassname: `form-control`
    },
    issues: {
      type: IssuesField,
      label: <IssuesLabel />,
      colCount: 1
    }
  };

  if (showLongBio) {
    fields.user_bio_long = {
      type: `textarea`,
      label: `Tell your story`,
      placeholder: `Let others know about yourself.\nWhat are your goals? Where do you come from? What are you most passionate about?\nBe careful not to include any private information!`,
      labelClassname: `h5-heading`,
      fieldClassname: `form-control`,
      validator: [validator.maxLengthValidator(4096)],
      charLimit: 4096,
      charLimitText: function(charCount, charLimit) {
        return charLimit - charCount;
      }
    };
  }

  return fields;
};
