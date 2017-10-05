import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  handleTitleClick() {
    this.props.sendGaEvent();
  }

  render() {
    let classnames = classNames(`mb-0`, this.props.className);
    let title = this.props.title;

    if (this.props.link) {
      title = <Link to={this.props.link} onClick={() => this.handleTitleClick() }>{this.props.title}</Link>;
    }

    return <h2 className={classnames}>{title}</h2>;
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
