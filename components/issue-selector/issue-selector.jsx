import React from 'react';
import SelectorLink from '../selector-link/selector-link.jsx';

export default React.createClass({
  render() {
    return (
      <div className="issue-selector">
        <SelectorLink className="btn" to="/issues/online-privacy-and-security">Online Privacy &amp; Security</SelectorLink>
        <SelectorLink className="btn" to="/issues/open-innovation">Open Innovation</SelectorLink>
        <SelectorLink className="btn" to="/issues/decentralization">Decentralization</SelectorLink>
        <SelectorLink className="btn" to="/issues/web-literacy">Web Literacy</SelectorLink>
        <SelectorLink className="btn" to="/issues/digital-inclusion">Digital Inclusion</SelectorLink>
      </div>
    );
  }
});
