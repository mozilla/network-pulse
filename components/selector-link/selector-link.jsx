import React from 'react';
import { Link } from 'react-router';
import ReactGA from 'react-ga';

export default React.createClass({
  handleInternalPageLinkClick() {
    ReactGA.event({
      category: `Interal page Link`,
      action: `Clicked`,
      label: `${this.props.to}`, // value has to be a string
    });
  },
  render() {
    return (
      <Link {...this.props} activeClassName="active" onClick={this.handleInternalPageLinkClick} />
    );
  }
});
