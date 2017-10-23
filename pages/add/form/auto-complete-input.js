import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import Service from '../../../js/service';
import { DELIMITERS } from './tag-delimiters';

function findReactComponent(dom) {
  for (var key in dom) {
    if (key.startsWith("__reactInternalInstance$")) {
      var compInternals = dom[key]._currentElement;
      var compWrapper = compInternals._owner;
      var comp = compWrapper._instance;
      return comp;
    }
  }
  return null;
}

export default class AutoCompleteInput extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      data: [],
      suggestions: []
    }
  }
  componentDidMount() {
    // this is to be specified by extending components
  }
  update(data) {
    this.setState({ data }, () => {
      const mappedData = this.state.data.map(field => this.toSchema(field));
      this.props.onChange(null, mappedData);
    });
  }
  toSchema(record) {
    return record.name;
  }
  handleDelete(i) {
    const data = this.state.data;
    data.splice(i, 1);
    this.update(data);
  }
  handleAddition(field) {
    field.name = field.name.trim();
    const data = [].concat(this.state.data, this.fixLettercase(field));
    this.update(data);
  }
  handleInputChange(input) {
    // does nothing in the superclass
  }
  fixLettercase(field) {
    // Ensure that if some field is identical to an already-known
    // field, but uses a different case, the known case gets used
    // instead of what the user typed.
    for (let t of this.state.suggestions) {
      if (t.name.toLowerCase() === field.name.toLowerCase()) {
        field = t;
        break;
      }
    }
    return field;
  }
  getFilteredSuggestions() {
    // show only tag suggestions that haven't been selected yet
    const { data, suggestions } = this.state;
    const names = data.map(tagObj => tagObj.name);

    return suggestions.map((suggestion) => {
      if (names.indexOf(suggestion.name) > -1) return null;

      return suggestion;
    }).filter(suggestion => !!suggestion);
  }
  handleBlur(e) {
    let input = this.reactTags.state.query.trim();
    if (input) {
      this.handlePendingInput(input);
      this.reactTags.setState({ query: '' });
    }
  }
  handlePendingInput() {
    console.warn("handlePendingData should be implemented in subclass.");
  }
  save(input) {
    this.handleAddition({
      name: input
    });
  }
  render(props={}) {
    let placeholder = props.placeholder || `Add new tag`;
    return <div onBlur={e => this.handleBlur(e)} ref={e => this.div=e} tabIndex={0}>
              <ReactTags
                ref={e => this.reactTags=e}
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