import React from 'react';
import PropTypes from 'prop-types';

class DynamicCheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
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

  renderCheckbox(option) {
    return <div key={option}>
            <label>
              <input type="checkbox"
                     value={option}
                     onChange={event => this.handleCheckboxChange(event)} />{option}
            </label>
          </div>;
  }

  renderCheckboxes() {
    if (this.props.options.length < 1) return null;

    let options = this.props.options.map((option) => this.renderCheckbox(option));

    return <div className="options" style={{"columnCount": this.props.colNum}}>{options}</div>;
  }

  render() {
    return <div className="checkboxGroup">{this.renderCheckboxes()}</div>;
  }
}

DynamicCheckboxGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  colNum: PropTypes.number
};

DynamicCheckboxGroup.defaultProps = {
  colNum: 1,
  options: []
};

export default DynamicCheckboxGroup;
