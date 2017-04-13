import React from 'react';
import { Link } from 'react-router';
import HintMessage from '../components/hint-message/hint-message.jsx';

export default React.createClass({
  render() {
    return (
      <HintMessage iconComponent={<img src="/assets/svg/icon-404.svg" />}
                   header={`Something's wrong`}
                   linkComponent={<Link to={`/featured`}>Explore featured</Link>}>
        <p>Check your URL or try a search. Still no luck? <a href="https://github.com/mozilla/network-pulse/issues/new">Let us know</a>.</p>
      </HintMessage>
    );
  }
});
