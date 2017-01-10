import React from 'react';
import HintMessage from '../components/hint-message/hint-message.jsx';

export default React.createClass({
  render() {
    return (
      <HintMessage imgSrc={`/assets/svg/icon-404.svg`}
                   header={`Something's wrong`}
                   btn={{to: `/featured`, text: `Explore featured`}}>
        <p>Check your URL or try a search. Still no luck? <a href="https://github.com/mozilla/network-pulse/issues/new">Let us know</a>.</p>
      </HintMessage>
    );
  }
});
