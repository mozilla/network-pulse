import React from 'react';
import DynamicCheckboxGroup from './dynamic-checkbox-group.jsx';
import Service from '../../js/service';

class IssuesField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selectedOptions: this.props.value
    };
  }
  componentWillMount() {
    Service.issues.get().then(options => {
      this.setState({ options: options.map(option => option.name) });
    });
  }
  render() {
    return <DynamicCheckboxGroup
      options={this.state.options}
      selectedOptions={this.props.value}
      onChange={this.props.onChange}
    />;
  }
}

export default IssuesField;
