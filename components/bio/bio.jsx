import React from 'react';
import { Helmet } from "react-helmet";
// import { Link } from 'react-router';

class Bio extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPic() {
    let style = {
      backgroundImage: `url(${this.props.pic})`,
    };

    return <div className="pic mx-4" style={style}></div>;
  }

  renderName() {
    return <div className="name d-inline-block mr-4">{this.props.firstname} {this.props.lastname}</div>;
  }

  renderSocialMedia() {
    if (!this.props.socialMedia || this.props.socialMedia.length < 1) return null;

    let platforms = this.props.socialMedia.map(platform => {
      return <a href={platform.link} target="_blank" className="d-inline-block mr-3">{platform.type}</a>;
    });

    return <div className="d-inline-block">{platforms}</div>;
  }

  renderProjects() {
    return <div className="col-12"><ProjectLoader /></div>;
  }

  render() {
    console.log(this.props);
    return (
      <div className="bio pb-5 mb-5">
        <div className="row">
          <div className="col-sm-4">
            { this.renderPic() }
          </div>
          <div className="col-sm-8">
            { this.renderName() }
            { this.renderSocialMedia() }
          </div>
        </div>
      </div>
    );
  }
}
export default Bio;
