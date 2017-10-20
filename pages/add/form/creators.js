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
      creators: [],
      suggestions: []
    };
  }
  componentDidMount() {}
  fetchCompletions(fragment) {
    Service.creators
      .get(fragment)
      .then((data) => {
        let suggestions = data.results.map((creator) => {
          return { id: creator.creator_id, name: creator.name };
        });
        this.setState({ suggestions });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
  updateCreators(creators) {
    this.setState({ creators }, () => {
      let relatedCreators = this.state.creators.map((creator) => {
        // Model data thusly:
        //
        // "related_creators": [{
        //   "creator_id": number | <id of the creator autocompleted. Will be null if the creator was not autocompleted and was manually typed in>,
        //   "name": string | <name of the creator typed in, not autocompleted. Will be null if the creator was autocompleted>
        // }, ...]
        return {
          creator_id: creator.id ? creator.id : null,
          name: creator.id ? null : creator.name
        };
      });

      this.props.onChange(null, relatedCreators);
    });
  }
  handleDelete(i) {
    const creators = this.state.creators.slice(0);
    creators.splice(i, 1);
    this.updateCreators(creators);
  }
  handleAddition(creator) {
    creator.name = creator.name.trim();
    const creators = [].concat(this.state.creators, this.fixCreatorLettercase(creator));
    this.updateCreators(creators);
  }
  fixCreatorLettercase(creator) {
    for (let t of this.state.suggestions) {
      // We don't want to have duplicated creators in the database.
      // If the user-defined creator is a known creator,
      // fix the lettercase so it mataches the known creator we have in the database.
      if (t.name.toLowerCase() === creator.name.toLowerCase()) {
        creator = t;
        break;
      }
    }
    return creator;
  }
  getFilteredSuggestions() {
    // show only creator suggestions that haven't been selected yet
    const { creators, suggestions } = this.state;
    const creatorNames = creators.map(creatorObj => creatorObj.name);

    return suggestions.map((suggestion) => {
      if (creatorNames.indexOf(suggestion.name) > -1) return null;

      return suggestion;
    }).filter(suggestion => !!suggestion);
  }
  handleInputChange(input) {
    if (input.length >= 3) {
      this.fetchCompletions(input);
    }
  }
  render() {
    return <ReactTags
              handleInputChange={(...args) => this.handleInputChange(...args)}
              tags={this.state.creators}
              placeholder={`Add new creator`}
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
