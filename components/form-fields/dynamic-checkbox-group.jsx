import React from 'react';
import PropTypes from 'prop-types';

class DynamicCheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: []
    };
  }

  componentDidMount() {
    this.props.funcToFetchOptions()
      .then(options => {
        this.setState({
          options: options.map(type => type.name)
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
    if (this.state.options.length < 1) return null;

    let options = this.state.options.map((option) => this.renderCheckbox(option));

    return <div className="options" style={{"columnCount": this.props.colNum}}>{options}</div>;
  }

  render() {
    return <div className="checkboxGroup">{this.renderCheckboxes()}</div>;
  }
}

DynamicCheckboxGroup.propTypes = {
  funcToFetchOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  colNum: PropTypes.number
};

DynamicCheckboxGroup.defaultProps = {
  colNum: 1
};

export default DynamicCheckboxGroup;
