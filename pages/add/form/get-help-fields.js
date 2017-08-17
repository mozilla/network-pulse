import React from 'react';
import validator from './validator';
import Service from '../../../js/service';

class HelpTypes extends React.Component {
  constructor() {
    super();
    this.state = {
      helpTypes: [],
      selected: []
    };
  }

  componentDidMount() {
    Service.helpTypes
      .get()
      .then(helpTypes => {
        this.setState({
          helpTypes: helpTypes.map(type => type.name)
        });
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  updateSelected(selected) {
    this.setState({ selected }, () => {
      this.props.onChange(null,selected);
    });
  }

  handleCheckboxChange(event) {
    let value = event.target.value;
    let currentlySelected = this.state.selected;

    if (event.target.checked) {
      if (currentlySelected.indexOf(value) < 0) {
        currentlySelected.push(value);
      }
    } else {
      let index = currentlySelected.indexOf(value);
      if (index > 0) {
        currentlySelected.splice(index, 1);
      }
    }

    this.updateSelected(currentlySelected);
  }

  renderCheckbox(helpType) {
    return <div key={helpType}><label>
                <input type="checkbox" value={helpType} onChange={event => this.handleCheckboxChange(event)} /> {helpType}
             </label></div>;
  }

  renderCheckboxes() {
    if (this.state.helpTypes.length < 1) return null;

    let helpTypes = [].concat(this.state.helpTypes);
    let renderHelpType = (helpType) => this.renderCheckbox(helpType);

    // we want to show this long list of checkboxes in 2-column layout
    let firstGroup = helpTypes.splice(0, Math.ceil(helpTypes.length / 2)).map(renderHelpType);
    let secondGroup = helpTypes.map(renderHelpType);

    return <div className="row">
            <div className="col-sm-6">{firstGroup}</div>
            <div className="col-sm-6">{secondGroup}</div>
          </div>;
  }

  render() {
    return <div className="checkboxGroup">{this.renderCheckboxes()}</div>;
  }
}

let fields = {
  'get_involved': {
    type: `text`,
    label: `Looking for support? Describe how people can do that.`,
    placeholder: `Help us test the prototype, plan some local events, contribute to the codebase, ...`,
    fieldClassname: `form-control`,
    validator: validator.maxLengthValidator(300)
  },
  'help_types': {
    type: HelpTypes,
    label: `Pick up to 3 ways that people can help.`,
  },
  'get_involved_url': {
    type: `text`,
    label: `Link for people to get involved.`,
    placeholder: `https://example.com`,
    fieldClassname: `form-control`,
    validator: validator.urlValidator()
  }
};

export default fields;
