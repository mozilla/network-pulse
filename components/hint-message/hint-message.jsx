import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class HintMessage extends React.Component {
  renderLink() {
    if (!this.props.linkComponent) return null;

    return React.cloneElement(this.props.linkComponent, { className: classNames(`btn`, `btn-outline-info`)} );
  }

  render() {
    return (
      <div className="hint-message text-center">
        <h2 className="icon mb-3">{ this.props.iconComponent }</h2>
        <h2>{ this.props.header }</h2>
        { this.props.children }
        { this.renderLink() }
      </div>
    );
  }
}

HintMessage.propTypes = {
  header: PropTypes.string.isRequired,
  iconComponent: PropTypes.element.isRequired,
  linkComponent: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element
  ]).isRequired
};

export default HintMessage;
