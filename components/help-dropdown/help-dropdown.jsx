import React from 'react';
import Service from '../../js/service';

export default class HelpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: [] };
  }
  componentWillMount() {
    Service.helpTypes.get().then(options => {
        this.setState({ options: options.map(option => option.name) });
    });
  }

  render() {
      let renderedHelpTypes = options.map( type => {
          return <option value={ type }>{ type }</option>
      });

      return <select name="dropdown">
          <option value="">Help</option>
          { renderedHelpTypes }
      </select>;
  }
}
