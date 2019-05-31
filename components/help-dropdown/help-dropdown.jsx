import React from 'react';
import Service from '../../js/service';

export default class HelpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       helpOptions: []
     };
  }
  componentDidMount() {
    Service.helpTypes.get().then(options => {
      this.setState({ 
        helpOptions: options.map(option => option.name) 
      });
    });
  }

  render() {
    let renderedHelpTypes = this.state.helpOptions.map(type => {
      return <option key={type} value={type}>{type}</option>;
    });

    return (
      <select className="body-large dropdown" onChange={ (event) => {this.props.helpType(event);} }>
        <option value="">Help</option>
        {renderedHelpTypes}
      </select>
    );
  }
}
