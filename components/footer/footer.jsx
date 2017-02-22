import React from 'react';
import { MofoFooter } from 'mofo-ui';

const Footer = () => {
  const FOOTER_LINKS = [
    {
      iconType: `github`,
      link: `https://github.com/mozilla/network-pulse`,
      text: `Github`
    },
    {
      iconType: `chat`,
      link: `https://chat.mozillafoundation.org/mozilla/channels/town-square`,
      text: `Chat`
    },
    {
      iconType: `email`,
      link: `https://mzl.la/pulse-contact`,
      text: `Contact Us`
    },
    {
      iconType: `legal`,
      link: `https://www.mozilla.org/about/legal/`,
      text: `Legal`
    },
    {
      iconType: `cc-license`,
      link: `https://creativecommons.org/licenses/by/4.0/`,
      text: `License`
    }
  ];

  const ORGS = [
    {
      name: `mozilla`,
      link: `https://mozilla.org`,
      description: (<p>Mozilla is a global non-profit dedicated to putting you in control of your online experience and shaping the future of the web for the public good. Visit us at <a href="https://mozilla.org">mozilla.org</a>.</p>),
      className: `mozilla`
    }
  ];

  return (
    <MofoFooter footerLinks={FOOTER_LINKS} orgs={ORGS} />
  );
};

export { Footer as default };
