import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
  }

  handleThumbnailClick() {
    this.props.sendGaEvent();
  }

  render() {
    let imgSrc = this.props.thumbnail ? this.props.thumbnail : `/assets/placeholder-thumbnail.png`;
    let thumbnail = <div className="img-container"><img src={imgSrc} /></div>;
    let classnames = `thumbnail`;

    if (this.props.link) {
      return <Link to={this.props.link} onClick={()=>this.handleThumbnailClick()} className={classnames}>
        {thumbnail}
      </Link>;
    }

    return <div className={classnames}>{thumbnail}</div>;
  }
}

Thumbnail.propTypes = {
  thumbnail: PropTypes.string,
  link: PropTypes.string,
  sendGaEvent: PropTypes.func
};

Thumbnail.defaultProps = {
  link: ``,
  sendGaEvent: function() {}
};

export default Thumbnail;
