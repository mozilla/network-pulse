import React from 'react';
import Service from '../../js/service';

export default class HelpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: [] };
  }
  componentDidMount() {
    Service.helpTypes.get().then(options => {
      this.setState({ options: options.map(option => option.name) });
    });
  }

  render() {
    let renderedHelpTypes = this.state.options.map(type => {
      return <option key={type} value={type}>{type}</option>;
    });

    return <select id="help-dropdown" className="body-large p-3">
      <option value="">Help</option>
      {renderedHelpTypes}
    </select>;
  }
}
