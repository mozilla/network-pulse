import React from 'react';
import { Redirect } from 'react-router-dom';
import Service from '../../js/service';

export default class HelpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       options: [],
       value: '',
       redirect: false,
       path: ''
     };

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    Service.helpTypes.get().then(options => {
      this.setState({ options: options.map(option => option.name) });
    });
  }

  handleChange(e) {
    // when user selects, value is updated
    this.setState({ 
      value: e.target.value
    });

    //value stored and used in path
    let value = this.state.value.toLowerCase().replace(/\s/g,'');
    let pathUpdate = `/?helptype=${ value }`;

    // updating state of redirect & path
    this.setState({
      redirect: true,
      path: { pathUpdate }
    });
    
    // updating url params
    if (this.state.redirect) {
      console.log(this.state.redirect, this.state.path);
      return <Redirect to={ this.state.path } />;
    }
  }

  render() {
    let renderedHelpTypes = this.state.options.map(type => {
      return <option key={type} value={type}>{type}</option>;
    });

    return <select id="help-dropdown" className="body-large p-3" value={ this.state.value } onChange={ this.handleChange }>
      <option value="">Help</option>
      {renderedHelpTypes}
    </select>;
  }
}