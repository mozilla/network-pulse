import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { Link } from 'react-router';
import IssuesField from '../../../components/form-fields/issues.jsx';
import validator from './validator';
import Service from '../../../js/service';

const DELIMITERS = [9,13,188]; // keycodes for tab,enter,comma

class Tags extends Component {
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
  updateTags(tags) {
    this.setState({ tags }, () => {
      const tagNames = this.state.tags.slice().map(tagObj => tagObj.name);
      this.props.onChange(null,tagNames);
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
  render() {
    return <ReactTags
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

const IssuesLabel = function() {
  return (
    <div>Check any <Link to="/issues" target="_blank">Key Internet Issues</Link> that relate to your project.</div>
  );
};


module.exports = {
  published_by_creator: {
    type: 'checkbox',
    label: 'I am one of the creators.',
    fieldClassname: `published-by-creator`,
    guideText: 'Are you one of the creators?'
  },
  creators: {
    type: `text`,
    label: `Name any other creators. This could be staff, contributors, partners…`,
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
    type: IssuesField,
    label: <IssuesLabel/>,
    colCount: 1
  },
  tags: {
    type: Tags,
    label: `Tags: Comma separated. Spaces are ok. Issues are added automatically.`,
    fieldClassname: `form-control`
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
