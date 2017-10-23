import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import Service from '../../../js/service';
import AutoCompleteInput from './auto-complete-input';

export default class Creators extends AutoCompleteInput {
  toSchema(field) {
    // Model data thusly:
    //
    // "related_creators": [{
    //   "creator_id": number | <id of the creator autocompleted. Will be null if the creator was not autocompleted and was manually typed in>,
    //   "name": string | <name of the creator typed in, not autocompleted. Will be null if the creator was autocompleted>
    // }, ...]
    return {
      creator_id: field.id ? field.id : null,
      name: field.id ? null : field.name
    };
  }
  handleInputChange(input) {
    if (input.length >= 3) {
      this.fetchCompletions(input);
    }
  }
  fetchCompletions(fragment) {
    Service.creators
      .get(fragment)
      .then((data) => {
        let suggestions = data.results.map((creator) => {
          if(creator.profile_id){ creator.name = `👤 ${creator.name}`; }
          return { id: creator.creator_id, name: creator.name };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
  handlePendingInput(input) {
    // If the creator the user typed matches a known creator suggestion (ignoring
    // case by comparing ucase'd strings) add that creator to the list of creators,
    // otherwise discard it as incomplete data.
    for (let suggestion of this.state.suggestions) {
      if (suggestion.name && suggestion.name.toLowerCase()===input.toLowerCase()) {
        return this.save(input);
      }
    }
  }
  render() {
    return super.render({ placeholder: `Add new creator` });
  }
}
