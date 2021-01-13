import React from "react";
import NewsletterSignUp from "../../components/newsletter-sign-up/newsletter-sign-up.jsx";

export default class Footer extends React.Component {
  renderSocialLinks() {
    return (
      <ul className="d-flex pl-0">
        <li className="mr-2">
          <a
            className="twitter-glyph small d-inline-block"
            href="https://twitter.com/mozilla"
            target="_blank"
          >
            <span className="sr-only">Twitter</span>
          </a>
        </li>
        <li className="mr-2">
          <a
            className="instagram-glyph small d-inline-block"
            href="https://www.instagram.com/mozilla/"
            target="_blank"
          >
            <span className="sr-only">Instagram</span>
          </a>
        </li>
        <li className="mr-2">
          <a
            className="github-glyph small d-inline-block"
            href="https://www.github.com/mozilla/foundation.mozilla.org/"
            target="_blank"
          >
            <span className="sr-only">Github</span>
          </a>
        </li>
      </ul>
    );
  }
  renderFooterLinks() {
    return (
      <ul className="link-list list-unstyled mb-0">
        <li className="col-auto mb-2" key="Donate">
          <a
            href="https://donate.mozilla.org/?utm_source=mozillapulse.org&utm_medium=referral&utm_content=footer"
            target="_blank"
          >
            Donate
          </a>
        </li>
        <li className="col-auto mb-2" key="Cookies">
          <a
            href="https://www.mozilla.org/privacy/websites/#cookies"
            target="_blank"
          >
            Cookies
          </a>
        </li>
        <li className="col-auto mb-2" key="Legal">
          <a
            href="https://www.mozilla.org/about/legal/terms/mozilla/"
            target="_blank"
          >
            Legal
          </a>
        </li>
        <li className="col-auto mb-2" key="Participation">
          <a
            href="https://www.mozilla.org/about/governance/policies/participation/"
            target="_blank"
          >
            Participation Guidelines
          </a>
        </li>
        <li className="col-auto mb-2" key="Privacy">
          <a href="https://mozilla.org/en-US/privacy/websites/" target="_blank">
            Privacy
          </a>
        </li>
      </ul>
    );
  }
  render() {
    return (
      <footer className="site-footer dark-theme py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-lg-6 d-flex flex-column justify-content-end">
              <NewsletterSignUp buttonPosition="side" />
              <div className="my-5 mb-md-0">
                <a className="logo" href="https://foundation.mozilla.org">
                  <img
                    src="../assets/svg/mozilla-block-white.svg"
                    alt="Mozilla Foundation Home Page"
                    width="96"
                  />
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-5 offset-md-1 d-flex flex-column justify-content-between">
              <div className="row">
                <div className="col-lg-6 col-xl-5">
                  <h5 className="h5-heading">More about us</h5>
                  {this.renderSocialLinks()}
                </div>
                <div className="col-lg-6 col-xl-7">
                  {this.renderFooterLinks()}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <hr className="mt-3 mt-md-5" />
                  <p className="dark-theme body-small mb-5 mb-md-0">
                    Mozilla is a global non-profit dedicated to putting you in
                    control of your online experience and shaping the future of
                    the web for the public good. Visit us at{" "}
                    <a href="https://foundation.mozilla.org">
                      foundation.mozilla.org
                    </a>
                    . Most content available under a{" "}
                    <a href="https://foundation.mozilla.org/about/website-licensing/">
                      Creative Commons license
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
