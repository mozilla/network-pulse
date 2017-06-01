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
        let suggestions = data.map((tag,i) => {
          return { id: i+1, name: tag };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });

      this.shimTagDelimiter();
  },
  shimTagDelimiter: function() {
    // The ReactTags component for some reason does not
    // do tag seperation on anything except "enter" which is
    // not an intuitive key when you're on a single-line input.
    try {
      const reactTags = this.reactTags;
      const trueInput = reactTags.input.input;
      const forceKey = reactTags.handleKeyDown.bind(reactTags);

      trueInput.addEventListener("keyup", evt => {
        // did we type a comma?
        const key = evt.key;
        if (key === ',') {
          // remove the comma and type an enter instead
          const { query, selectedIndex } = reactTags.state;
          reactTags.state.query = query.substring(0, query.length-1).trim();
          forceKey({ keyCode: 13, preventDefault: ()=>{} });
        }
      });

    } catch (e) {
      console.warning("Could not set up comma-delimiting for tags");
    }
  },
  updateTags: function(tags) {
    this.setState({ tags }, () => {
      const tagNames = this.state.tags.slice().map(tagObj => tagObj.name);
      this.props.onChange(null,tagNames);
    });
  },
  handleDelete: function(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.updateTags(tags);
  },
  handleAddition: function(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.updateTags(tags);
  },
  getFilteredSuggestions: function() {
    // show only tag suggestions that haven't been selected yet
    const { tags, suggestions } = this.state;
    const tagNames = tags.map(tagObj => tagObj.name);

    return suggestions.map((suggestion) => {
      if (tagNames.indexOf(suggestion.name) > -1) return null;

      return suggestion;
    }).filter(suggestion => !!suggestion);
  },
  render: function() {

    return <ReactTags
              ref={e => this.reactTags = e}
              tags={this.state.tags}
              suggestions={this.getFilteredSuggestions()}
              allowNew={true}
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
});

module.exports = {
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
    type: Tags,
    label: `Tags: Comma separated. Spaces are ok. Issues are added automatically.`,
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
