import React from "react";
import PropTypes from "prop-types";

class MofoFooter extends React.Component {
  renderSocialLinks() {
    return this.props.socialLinks.map(socialLink => {
      return (
        <li className="mr-2">
          <a
            className={`${socialLink.iconType} small d-inline-block`}
            href={socialLink.link}>
            <span className="sr-only">{socialLink.text}</span>
          </a>
        </li>
      );
    });
  }
  renderFooterLinks() {
    return this.props.footerLinks.map(footerLink => {
      return (
        <li className="col-auto" key={footerLink.text}>
          <a
            className={`footer-link-${footerLink.iconType}`}
            href={footerLink.link}
          >
            {footerLink.text}
          </a>
        </li>
      );
    });
  }
  renderOrgs() {
    return this.props.orgs.map(org => {
      // "org-info" is the default classname to be assigned to every organization's wrapper <div>
      // If there's any custom classname associated with this particular org, append it to the className string.
      let className = `org-info${org.className ? ` ${org.className}` : ``}`;

      return (
        <div className={className} key={org.name}>
          <div className="logo-container">
            <a className="logo" href={org.link} />
          </div>
          {org.description}
        </div>
      );
    });
  }
  render() {
    return (
      <footer className="site-footer dark-theme py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="join-us mb-5" />
              <div className="my-5 mb-md-0">
                <a href="https://foundation.mozilla.org" className="logo">
                  <img src="" alt="" />
                </a>
              </div>
            </div>
            <div className="col-md-6 offset-md-1 d-flex flex-column justify-content-between">
              <div className="row">
                <div className="col-md-4">
                  <h5 class="h5-heading">More about us</h5>
                  <ul className="d-flex">{this.renderSocialLinks()}</ul>
                </div>
                <div className="col-md-8">
                  <ul className="link-list list-unstyled mb-0">
                    {this.renderFooterLinks()}
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <hr class="mt-3 mt-md-5" />
                  {this.renderOrgs()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

MofoFooter.propTypes = {
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      iconType: PropTypes.oneOf([`twitter`, `instagram`, `github`]).isRequired,
      link: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  footerLinks: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  orgs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      description: PropTypes.element.isRequired,
      className: PropTypes.string
    }).isRequired
  ).isRequired
};

const Footer = () => {
  const SOCIAL_LINKS = [
    {
      iconType: `twitter`,
      link: `https://twitter.com/mozilla`,
      text: `Twitter`
    },
    {
      iconType: `instagram`,
      link: `https://www.instagram.com/mozilla/`,
      text: `Instagram`
    },
    {
      iconType: `github`,
      link: `https://www.github.com/mozilla/foundation.mozilla.org/`,
      text: `Github`
    }
  ];
  const FOOTER_LINKS = [
    {
      link: `https://donate.mozilla.org/?utm_source=foundation.mozilla.org&utm_medium=referral&utm_content=footer`,
      text: `Donate`
    },
    {
      link: `https://mozilla.org/en-US/about/legal/`,
      text: `Legal`
    },
    {
      link: `https://creativecommons.org/licenses/by/4.0`,
      text: `License`
    },
    {
      link: `https://www.mozilla.org/about/governance/policies/participation/`,
      text: `Participation Guidelines`
    },
    {
      link: `https://mozilla.org/en-US/privacy/websites/`,
      text: `Privacy`
    }
  ];

  const ORGS = [
    {
      name: `mozilla`,
      link: `https://mozilla.org`,
      description: (
        <p className="dark-theme body-small">
          Mozilla is a global non-profit dedicated to putting you in control of
          your online experience and shaping the future of the web for the
          public good. Visit us at <a href="https://mozilla.org">mozilla.org</a>
          .
        </p>
      ),
      className: `mozilla`
    }
  ];

  return (
    <MofoFooter
      footerLinks={FOOTER_LINKS}
      orgs={ORGS}
      socialLinks={SOCIAL_LINKS}
    />
  );
};

export default Footer;
