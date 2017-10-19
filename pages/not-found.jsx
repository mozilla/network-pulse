import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HintMessage from '../components/hint-message/hint-message.jsx';

const NotFound = (props) => {
  return (
    <HintMessage iconComponent={<img src="/assets/svg/icon-404.svg" />}
                 header={props.header}
                 linkComponent={props.linkComponent}>
      { props.children || <p>Check your URL or try a search. Still no luck? <a href="https://github.com/mozilla/network-pulse/issues/new">Let us know</a>.</p> }
    </HintMessage>
  );
};

NotFound.propTypes = {
  header: PropTypes.string,
  linkComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.bool,
  ]),
  children: PropTypes.element
};

NotFound.defaultProps = {
  header: `Something's wrong`,
  linkComponent: <Link to={`/featured`}>Explore featured</Link>
};

export default NotFound;
