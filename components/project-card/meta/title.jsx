import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  handleTitleClick() {
    this.props.sendGaEvent();
  }

  render() {
    let title = this.props.title;
    let simpleView = this.props.simpleView;
    let content = <h1 className="title h1-heading mb-1 mb-md-3">{title}</h1>;

    if (simpleView) {
      if (this.props.link) {
        title = (
          <Link to={this.props.link} onClick={() => this.handleTitleClick()}>
            {this.props.title}
          </Link>
        );
      }

      content = <h4 className="title h4-heading mb-0">{title}</h4>;
    }

    return content;
  }
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  sendGaEvent: PropTypes.func,
};

Title.defaultProps = {
  title: ``,
  link: ``,
  sendGaEvent: function () {},
};

export default Title;
