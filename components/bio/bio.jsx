import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Utility from '../../js/utility.js';
import SignOutButton from '../sign-out-button.jsx';

class Bio extends React.Component {
  constructor(props) {
    super(props);
    this.profileOwnerName = props.custom_name || props.name;
  }

  renderThumbnail() {
    let style = {};

    if (this.props.thumbnail) {
      style = {
        backgroundImage: `url(${this.props.thumbnail})`,
        backgroundSize: `cover`,
        backgroundRepat: `no-repeat`,
        backgroundPosition: `center center`
      };
    }

    return <div className="thumbnail mx-auto" style={style}></div>;
  }

  renderEditLink() {
    if (!this.props.my_profile) return null;

    return <div className="mt-3"><Link to="/myprofile">Edit your profile</Link></div>;
  }

  renderName() {
    return <div className="name mr-sm-4 text-truncate mw-100">{this.profileOwnerName}</div>;
  }

  renderSocialMedia() {
    let list = [ `twitter`, `linkedin`, `github` ];
    list = list.map((type, i) => {
      let link = this.props[type];
      if (!link) { return; }

      let classname = classNames(`d-inline-block social-media`, {
        "mr-sm-3" : i !== list.length-1
      });

      return <a href={link} target="_blank" className={classname} onClick={(event) => this.handleSocialMediaClick(event, type)} key={type}><span className={`fa fa-${type}`}></span></a>;
    });

    return <div>{list}</div>;
  }

  renderSignOut() {
    if (!this.props.my_profile) return null;

    return <div className="ml-sm-3"><SignOutButton user={this.props.user} history={this.props.history} /></div>;
  }

  renderMeta(type, text, link) {
    let meta = text;

    if (link) {
      meta = <a href={link} onClick={(event) => this.handleSocialMediaClick(event, type)}>{text}</a>;
    }

    return <div className={`meta-with-icon ${type} d-inline-block mr-4`}>{meta}</div>;
  }

  renderOtherMeta() {
    let org = this.props.org ? this.renderMeta(`org`, this.props.org) : null;
    let location = this.props.location ? this.renderMeta(`location`, this.props.location) : null;
    let language = this.props.language ? this.renderMeta(`language`, this.props.language.join(` ,`)) : null;
    let story = this.props.storyLink ? this.renderMeta(`story`, `Read Story`, this.props.storyLink) : null;
    let website = this.props.website ? this.renderMeta(`website`, this.props.website, this.props.website) : null;

    return <div className="other-meta open-sans mb-3">{org}{location}{language}{story}{website}</div>;
  }

  renderBlurb() {
    let paragraphs = this.props.user_bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    if (paragraphs.length < 1) return null;

    return <div className="blurb">{paragraphs}</div>;
  }

  renderTags(label = ``, type = ``, tags = []) {
    if (!type || tags.length < 1) { return null; }

    tags = tags.map(tag => {
      let link = `/${type}/${type === `issues` ? Utility.getUriPathFromIssueName(tag) : encodeURIComponent(tag)}`;

      return <Link to={link} className="btn btn-xs btn-tag" key={tag}>{tag}</Link>;
    });

    return <div className="tags mb-1">
      <div className="d-inline-block mr-2 open-sans text-uppercase">{label}:</div>
      {tags}
    </div>;
  }

  renderInterest() {
    if (!this.props.issues) { return null; }

    return this.renderTags(`interests`, `issues`, this.props.issues);
  }

  render() {
    return (
      <div className="bio mb-5">
        <div className="row">
          <div className="col-sm-4 col-md-2 text-center">
            { this.renderThumbnail() }
            { this.renderEditLink() }
          </div>
          <div className="col-sm-8 col-md-10">
            <div className="d-flex flex-wrap flex-column flex-sm-row align-items-center align-items-sm-baseline mb-3">
              { this.renderName() }
              { this.renderSocialMedia() }
              { this.renderSignOut() }
            </div>
            { this.renderOtherMeta() }
            { this.renderBlurb() }
            { this.renderInterest() }
          </div>
        </div>
      </div>
    );
  }
}

Bio.propTypes = {
  name: PropTypes.string.isRequired,
  "custom_name": PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  issues: PropTypes.array.isRequired,
  twitter: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  "my_profile": PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default Bio;
