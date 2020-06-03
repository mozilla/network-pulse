import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

class NotificationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classNames(`notification-bar p-3`, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

NotificationBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationBar;
