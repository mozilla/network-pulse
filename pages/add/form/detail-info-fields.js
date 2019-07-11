import React from "react";
import { Link } from "react-router-dom";
import IssuesField from "../../../components/form-fields/issues.jsx";
import validator from "./validator";
import Creators from "./creators";
import Tags from "./tags";

const IssuesLabel = function() {
  return (
    <p className="form-label mb-0">
      Check any{" "}
      <Link to="/issues" target="_blank">
        Key Internet Issues
      </Link>{" "}
      that relate to your project.
    </p>
  );
};

module.exports = {
  published_by_creator: {
    type: `checkbox`,
    label: `Yes`,
    fieldClassname: `published-by-creator`,
    guideText: `Are you one of the creators?`
  },
  related_creators: {
    type: Creators,
    label: `Name any creators, contributors, partners. Comma separated.`,
    labelClassname: `form-label`,
    fieldClassname: `form-control`
  },
  interest: {
    type: `text`,
    label: `Why might this be interesting to other people in our network?`,
    placeholder: ``,
    labelClassname: `form-label`,
    fieldClassname: `form-control mb-4`,
    validator: validator.maxLengthValidator(300)
  },
  issues: {
    type: IssuesField,
    label: <IssuesLabel />,
    colCount: 1
    
  },
  tags: {
    type: Tags,
    label: `Tags: Comma separated. Spaces are ok. Issues are added automatically.`,
    labelClassname: `form-label`,
    fieldClassname: `form-control`
  },
  thumbnail: {
    type: `image`,
    label: (
      <p className="form-label project-image">
        Project image
      </p>
    ),
    helpText: `Looks best at 1200px × 630px`,
    prompt: `Select image`,
    fieldClassname: `form-control`,
    validator: [
      validator.imageTypeValidator(),
      validator.imageSizeValidator(),
      validator.imageFilenameValidator()
    ]
  }
};
