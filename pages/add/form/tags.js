import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import Service from '../../../js/service';
import AutoCompleteInput from './auto-complete-input';

export default class Tags extends AutoCompleteInput {
  componentDidMount() {
    Service.tags
      .get()
      .then((data) => {
        let suggestions = data.map((tag,i) => {
          return { id: i+1, name: tag };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  /**
   * Add any tag that the user wrote before
   * they clicked away as a tag to this entry.
   */
  handlePendingInput(input) {
    this.save(input);
  }

  render() {
    return super.render({ placeholder: `Add new tag` });
  }
}