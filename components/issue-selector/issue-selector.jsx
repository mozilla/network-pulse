import React from 'react';
import NavLink from '../nav-link/nav-link.jsx';

class IssueSelector extends React.Component {
  render() {
    return (
      <div className="issue-selector">
        <NavLink className="btn" to="/issues/online-privacy-and-security">Online Privacy &amp; Security</NavLink>
        <NavLink className="btn" to="/issues/open-innovation">Open Innovation</NavLink>
        <NavLink className="btn" to="/issues/decentralization">Decentralization</NavLink>
        <NavLink className="btn" to="/issues/web-literacy">Web Literacy</NavLink>
        <NavLink className="btn" to="/issues/digital-inclusion">Digital Inclusion</NavLink>
      </div>
    );
  }
}
export default IssueSelector;
