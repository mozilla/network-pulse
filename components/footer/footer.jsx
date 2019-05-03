import React from "react";
import PropTypes from "prop-types";

export default class Footer extends React.Component {
  renderFooterLinks() {
    return this.props.footerLinks.map((footerLink) => {
      return (
        <li className="col-auto" key={footerLink.text}>
          <a className={`footer-link-${footerLink.iconType}`} href={footerLink.link}>{footerLink.text}</a>
        </li>
      );
    });
  }
  renderOrgs() {
    return this.props.orgs.map((org) => {
      // "org-info" is the default classname to be assigned to every organization's wrapper <div>
      // If there's any custom classname associated with this particular org, append it to the className string.
      let className = `org-info${ org.className ? ` ${org.className}` : `` }`;

      return (
        <div className={className} key={org.name}>
          <div className="logo-container"><a className="logo" href={org.link}></a></div>
          {org.description}
        </div>
      );
    });
  }
  render() {
    return (
      <footer className="mofo-footer">
        <div className="container">
          <ul className="list-unstyled footer-links row justify-content-center">
            { this.renderFooterLinks() }
          </ul>
          { this.renderOrgs() }
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  footerLinks: PropTypes.arrayOf(PropTypes.shape({
    iconType: PropTypes.oneOf([ `twitter`, `instagram`, `github`,`donate`, `legal`, `cc-license`,`participate`, `privacy`]).isRequired,
    link: PropTypes.string.isRequired,
    text: PropTypes.string
  }).isRequired).isRequired,
  orgs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    description: PropTypes.element.isRequired,
    className: PropTypes.string
  }).isRequired).isRequired
};
