import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import Service from '../../../js/service';

const DELIMITERS = [9,13,188]; // keycodes for tab,enter,comma

export default class Creators extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      tags: [],
      suggestions: []
    };
  }
  componentDidMount() {}
  fetchCompletions(fragment) {
    Service.creators
      .get(fragment)
      .then((data) => {
        console.log(data);
        let suggestions = data.results.map((creator) => {
          return { id: creator.creator_id, name: creator.name };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
  updateTags(tags) {
    this.setState({ tags }, () => {
      const tagNames = this.state.tags.slice().map(tagObj => tagObj.name);
      console.log(tagNames);
      this.props.onChange(null,{a:1,b:1});
    });
  }
  handleDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.updateTags(tags);
  }
  handleAddition(tag) {
    tag.name = tag.name.trim();
    const tags = [].concat(this.state.tags, this.fixTagLettercase(tag));
    this.updateTags(tags);
  }
  fixTagLettercase(tag) {
    for (let t of this.state.suggestions) {
      // We don't want to have duplicated tags in the database.
      // If the user-defined tag is a known tag,
      // fix the lettercase so it mataches the known tag we have in the database.
      if (t.name.toLowerCase() === tag.name.toLowerCase()) {
        tag = t;
        break;
      }
    }
    return tag;
  }
  getFilteredSuggestions() {
    // show only tag suggestions that haven't been selected yet
    const { tags, suggestions } = this.state;
    const tagNames = tags.map(tagObj => tagObj.name);

    return suggestions.map((suggestion) => {
      if (tagNames.indexOf(suggestion.name) > -1) return null;

      return suggestion;
    }).filter(suggestion => !!suggestion);
  }
  handleInputChange(input) {
    console.log(`onChange`, input);
    if (input.length >= 3) {
      this.fetchCompletions(input);
    }
  }
  render() {
    return <ReactTags
              handleInputChange={(...args) => this.handleInputChange(...args)}
              tags={this.state.tags}
              suggestions={this.getFilteredSuggestions()}
              allowNew={true}
              autofocus={false}
              delimiters={DELIMITERS}
              handleDelete={(...args) => this.handleDelete(...args) }
              handleAddition={(...args) => this.handleAddition(...args) }
              classNames={{
                root: `react-tags form-control d-flex flex-column flex-sm-row`,
                selectedTag: `selected-tag btn btn-sm mr-sm-2 my-1`,
                search: `search d-flex`,
                searchInput: `tag-input-field`,
                suggestions: `suggestions p-2`
              }}
            />;
  }
}
