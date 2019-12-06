import React from "react";
import validator from "./validator";

export default {
  title: {
    // required field
    type: `text`,
    label: (
      <div>
        Title: Keep it simple. Name it, don't describe it.{" "}
        <span className="hint-text">(*required)</span>
      </div>
    ),
    placeholder: `Title`,
    fieldClassname: `form-control`,
    validator: [
      validator.emptyValueValidator(),
      validator.maxLengthValidator(80)
    ],
    charLimit: 80,
    charLimitText: function(charCount, charLimit) {
      // show a twitter-style "characters remainig" count
      return charLimit - charCount;
    }
  },
  content_url: {
    // required field
    type: `text`,
    label: (
      <div>
        URL <span className="hint-text">(*required)</span>
      </div>
    ),
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: [validator.emptyValueValidator(), validator.urlValidator()]
  },
  description: {
    type: `textarea`,
    label: `Description: Simple, brief language works best. No jargon.`,
    placeholder: `Description`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(600),
    charLimit: 600,
    charLimitText: function(charCount, charLimit) {
      return charLimit - charCount;
    }
  }
};
