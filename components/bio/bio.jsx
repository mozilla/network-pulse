import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class Bio extends React.Component {
  constructor(props) {
    super(props);
  }

  renderThumbnail() {
    return <div className="thumbnail mx-auto">
            { this.props.thumbnail && <img src={this.props.thumbnail} className="img-fluid" /> }
          </div>;
  }

  renderEditLink() {
    if (!this.props.my_profile) return null;

    return <div className="mt-3"><Link to="/myprofile">edit profile</Link></div>;
  }

  renderName() {
    return <div className="name d-block d-sm-inline-block mb-2 mr-sm-4 text-center text-sm-left">
      {this.props.custom_name || this.props.name}
    </div>;
  }

  renderSocialMedia() {
    let list = [ `twitter`, `linkedin`, `github` ].map(type => this.renderSocialMediaLink(type, this.props[type]) );

    return <div className="d-block d-sm-inline-block text-center text-sm-left mb-4 mb-sm-0">{list}</div>;
  }

  renderSocialMediaLink(type, link) {
    if (!link) return null;

    return <a href={link} target="_blank" className="d-inline-block mr-3 social-media default-text-color-link" key={type}><span className={`fa fa-${type}`}></span></a>;
  }

  renderMeta(type, text, link) {
    let meta = text;

    if (link) {
      meta = <a href={link} className="default-text-color-link">{text}</a>;
    }

    return <div className={`meta-with-icon ${type} d-inline-block mr-4`}>{meta}</div>;
  }

  renderOtherMeta() {
    let org = this.props.org ? this.renderMeta(`org`, this.props.org) : null;
    let location = this.props.location ? this.renderMeta(`location`, this.props.location) : null;
    let language = this.props.language ? this.renderMeta(`language`, this.props.language.join(` ,`)) : null;
    let story = this.props.storyLink ? this.renderMeta(`story`, `Read Story`, this.props.storyLink) : null;
    let website = this.props.website ? this.renderMeta(`website`, this.props.website, this.props.website) : null;

    return <div className="other-meta open-sans mb-2">{org}{location}{language}{story}{website}</div>;
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
      return <Link to={`/${type}/${encodeURIComponent(tag)}`} className="btn btn-xs btn-tag" key={tag}>{tag}</Link>;
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
            { this.renderName() }
            { this.renderSocialMedia() }
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
  thumbnail: PropTypes.string.isRequired,
  issues: PropTypes.array.isRequired,
  twitter: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  "my_profile": PropTypes.bool.isRequired
};

export default Bio;
