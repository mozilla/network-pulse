import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  handleTitleClick() {
    this.props.sendGaEvent(`Title tap`);
  }

  render() {
    let title = this.props.title;

    if (this.props.link) {
      return <h2><Link to={this.props.link} onClick={() => this.handleTitleClick() }>{this.props.title}</Link></h2>;
    }

    return <h2>{title}</h2>;
  }
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  sendGaEvent: PropTypes.func
};

Title.defaultProps = {
  title: ``,
  link: ``,
  sendGaEvent: function() {}
};

export default Title;
