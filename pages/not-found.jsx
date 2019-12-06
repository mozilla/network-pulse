import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import HintMessage from "../components/hint-message/hint-message.jsx";

class NotFound extends React.Component {
  componentDidMount() {
    const { staticContext } = this.props;
    if (staticContext) {
      staticContext.pageNotFound = true;
    }
  }

  render() {
    return (
      <HintMessage
        iconComponent={<img src="/assets/svg/icon-404.svg" />}
        header={this.props.header}
        linkComponent={this.props.linkComponent}
      >
        {this.props.children || (
          <p>
            Check your URL or try a search. Still no luck?{" "}
            <a href="https://github.com/mozilla/network-pulse/issues/new">
              Let us know
            </a>
            .
          </p>
        )}
      </HintMessage>
    );
  }
}

NotFound.propTypes = {
  header: PropTypes.string,
  linkComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  children: PropTypes.element
};

NotFound.defaultProps = {
  header: `Something's wrong`,
  linkComponent: <Link to={`/featured`}>Explore featured</Link>
};

export default NotFound;
