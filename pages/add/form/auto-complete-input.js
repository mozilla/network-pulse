import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { DELIMITERS } from './tag-delimiters';

/**
 * This is a superclass for components that require
 * autocompletion and capturing strings as discrete
 * "chunks", with terms packed into an array, and
 * each term taking the form:
 *
 *  { name: <string> }
 *
 * This class is built up around react-tags-autocomplete
 * and subclasses are responsible for filling in the
 * "data" and "suggestions" state variables.
 *
 * Current subclasses are the Tags and Creators classes,
 * which are good examples of how to write a subclass
 * that needs autocompletion as well as custom logic
 * for handling initial data setup and subsequent
 * capture of terms.
 *
 */
export default class AutoCompleteInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      suggestions: []
    };
  }

  update(data) {
    this.setState({ data }, () => {
      const mappedData = this.state.data.map(field => this.toSchema(field));
      this.props.onChange(null, mappedData);
    });
  }

  /**
   * This function is responsible for converting term
   * objects to whatever form they need to be for the
   * parent to do something with. For instance, if the
   * parent requires the standard term format, but with
   * all terms in upper case, a subclass can override
   * this function to be:
   *
   *   toSchema(record) {
   *     return {
   *       name: record.name.toUpperCase()
   *     };
   *   }
   *
   * @param record Term record object
   */
  toSchema(record) {
    return record.name;
  }

  handleDelete(pos) {
    const data = this.state.data;
    data.splice(pos, 1);
    this.update(data);
  }

  handleAddition(field) {
    if (field.name) {
      field.name = field.name.trim();
    }
    const data = [].concat(this.state.data, this.fixLettercase(field));
    this.update(data);
  }

  handleInputChange() {
    // does nothing in the superclass
  }

  /**
   * Helper function to ensure that if some field is identical
   * to an already-known field, but uses a different case, the
   * known case gets used instead of what the user typed.
   */
  fixLettercase(field) {
    if (field.name) {
      for (let t of this.state.suggestions) {
        if (t.name.toLowerCase() === field.name.toLowerCase()) {
          field = t;
          break;
        }
      }
    }
    return field;
  }

  getFilteredSuggestions() {
    // show only suggestions that haven't already been selected.
    const { data, suggestions } = this.state;
    const names = data.map(field => field.name);

    return suggestions.map((suggestion) => {
      if (names.indexOf(suggestion.name) > -1) return null;

      return suggestion;
    }).filter(suggestion => !!suggestion);
  }

  handleBlur() {
    let input = this.reactTags.state.query.trim();
    if (input) {
      this.handlePendingInput(input);
      this.reactTags.setState({ query: `` });
    }
  }

  handlePendingInput() {
    // does nothing in the superclass
  }

  /**
   * Helper function that subclasses can call in order
   * to explicitly add get a term string correctly saved
   * into the list of know terms.
   *
   * @param input string or term object
   */
  save(input) {
    if (typeof input === `string`) {
      input = { name: input };
    }
    this.handleAddition(input);
  }

  /**
   * The superclass render function can take an object
   * representing additional properties that are to be used
   * during render. Currently, properties supported are:
   *
   * {
   *   placeholder: <string to be used as input field placeholder text>
   * }
   *
   */
  render(props={}) {
    let placeholder = props.placeholder || `Add new tag`;
    return <div onBlur={e => this.handleBlur(e)} ref={e => { this.div = e; }} tabIndex={0}>
      <ReactTags
        ref={e => { this.reactTags = e; }}
        tags={this.state.data}
        suggestions={this.getFilteredSuggestions()}
        allowNew={true}
        autofocus={false}
        delimiters={DELIMITERS}
        handleDelete={(...args) => this.handleDelete(...args) }
        handleAddition={(...args) => this.handleAddition(...args) }
        handleInputChange={(...args) => this.handleInputChange(...args)}
        placeholder={placeholder}
        classNames={{
          root: `react-tags form-control d-flex flex-column flex-sm-row`,
          selectedTag: `selected-tag btn btn-sm mr-sm-2 my-1`,
          search: `search d-flex`,
          searchInput: `tag-input-field`,
          suggestions: `suggestions p-2`
        }}
      />
    </div>;
  }
}
