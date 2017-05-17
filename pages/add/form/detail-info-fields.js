import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import validator from './validator';
import Service from '../../../js/service';

let Tags = React.createClass({
  getInitialState() {
    return {
      tags: [],
      suggestions: []
    };
  },
  componentDidMount: function() {
    Service.tags
      .get()
      .then((data) => {
        console.log(data);
        let suggestions = data.map((tag,i) => {
          return { id: i+1, name: tag };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });
  },
  handleDelete: function(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  },
  handleAddition: function(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  },
  getFilteredSuggestions: function() {
    // show suggestions that haven't been selected yet
    const { tags, suggestions } = this.state;
    const tagNames = tags.map(tagObj => tagObj.name);

    return suggestions.map((suggestion) => {
      if (tagNames.indexOf(suggestion.name) > -1) return null;

      return suggestion;
    }).filter(suggestion => !!suggestion);
  },
  render: function() {

    return <ReactTags
              tags={this.state.tags}
              suggestions={this.getFilteredSuggestions()}
              allowNew={true}
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag}
              onChange={this.onChange}
              classNames={{
                // root: 'react-tags',
                root: `react-tags form-control d-flex flex-column flex-sm-row`,
                rootFocused: 'is-focused',
                selected: 'react-tags__selected',
                // selectedTag: 'react-tags__selected-tag',
                selectedTag: `selected-tag btn btn-sm mr-sm-2 my-1`,
                selectedTagName: 'react-tags__selected-tag-name',
                // search: 'react-tags__search',
                search: `search d-flex`,
                // searchInput: 'react-tags__search-input',
                searchInput: `tag-input-field`,
                suggestions: `suggestions p-2`,
                suggestionActive: 'is-active',
                suggestionDisabled: 'is-disabled'
              }}
            />;
  }
});

let Test = React.createClass({
  getInitialState() {
    return {
      value: null
    };
  },
  onChange: function() {
    console.log(`hi test onChange`);
    this.setState({value: 123});
  },
  render: function() {
    return <input onChange={this.onChange} />;
  }
});

module.exports = {
  tagsNew: {
    type: Tags,
    label: `Tags (with react-tag-autocomplete)`,
    fieldClassname: `form-control`
  },
  test: {
    type: Test,
    label: `test test test`,
    fieldClassname: `form-control`
  },
  creators: {
    type: `text`,
    label: `Who are the creators? This could be staff, contributors, partners…`,
    placeholder: `Name`,
    fieldClassname: `form-control`,
    multiplicity: 1,
    addLabel: `+ Add another`
  },
  interest: {
    type: `text`,
    label: `Why might this be interesting to other people in our network?`,
    placeholder: ``,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(300)
  },
  issues: {
    type: `checkboxGroup`,
    label: `Check any Key Internet Issues that relate to your project.`,
    options: [ `Online Privacy & Security`, `Open Innovation`, `Decentralization`, `Web Literacy`, `Digital Inclusion` ],
    colCount: 1
  },
  tags: {
    type: `text`,
    label: `Tags: Comma separated. Spaces are ok. Issues are added automatically.`,
    placeholder: `games, best practice, iot, cape town, code, ...`,
    fieldClassname: `form-control`
  },
  'get_involved': {
    type: `text`,
    label: `Looking for support? Describe how people can do that.`,
    placeholder: `Help us test the prototype, plan some local events, contribute to the codebase, ...`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(300)
  },
  'get_involved_url': {
    type: `text`,
    label: `Link for people to get involved.`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: validator.urlValidator()
  },
  'thumbnail': {
    type: `image`,
    label: `Project image: Only submit images that you have permission to use in this context.`,
    prompt: `Select image`,
    helpText: `Looks best at 1200px × 630px`,
    fieldClassname: `form-control`,
    validator: [
      validator.imageTypeValidator(),
      validator.imageSizeValidator(),
      validator.imageFilenameValidator()
    ]
  }
};
