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
    let content;
    let title = this.props.title;
    let view = this.props.view;
    let classnames = classNames(`title`, {
      "h1-heading mb-1 mb-md-3": !view,
      "h4-heading mb-0": view
    });

    if(view) {
      if (this.props.link) {
        title = (
          <Link to={this.props.link} onClick={() => this.handleTitleClick()}>
            {this.props.title}
          </Link>
        );
      }

      content = <h4 className={classnames}>{title}</h4>;
    }

    if(!view) {
      content = <h1 className={classnames}>{title}</h1>;
    }

    return content;
  }
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  sendGaEvent: PropTypes.func
};

Title.defaultProps = {
  title: ``,
  link: ``,
  sendGaEvent: function() {}
};

export default Title;
