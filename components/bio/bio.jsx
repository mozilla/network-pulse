import React from 'react';

class Bio extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPic() {
    let style = {
      backgroundImage: `url(${this.props.pic})`,
    };

    return <div className="pic mx-auto" style={style}></div>;
  }

  renderName() {
    return <div className="name d-inline-block mb-2 mr-4">{this.props.firstname} {this.props.lastname}</div>;
  }

  renderSocialMedia() {
    if (!this.props.socialMedia || this.props.socialMedia.length < 1) return null;

    let platforms = this.props.socialMedia.map(platform => {
      return <a href={platform.link} target="_blank" className="d-inline-block mr-3" key={platform.type}>{platform.type}</a>;
    });

    return <div className="d-inline-block">{platforms}</div>;
  }

  renderMeta(text,icon,link) {
    let meta = text;

    if (link) {
      meta = <a href={link}>{text}</a>;
    }

    return <div className="d-inline-block mr-4">{meta}</div>;
  }

  renderOtherMeta() {
    let org = this.props.org ? this.renderMeta(this.props.org) : null;
    let location = this.props.location ? this.renderMeta(this.props.location) : null;
    let language = this.props.language ? this.renderMeta(this.props.language.join(` ,`)) : null;
    let story = this.props.storyLink ? this.renderMeta(`Read Story`, ``, this.props.storyLink) : null;
    let link = this.props.link ? this.renderMeta(this.props.link) : null;

    return <div className="other-meta mb-2">{org}{location}{language}{story}{link}</div>;
  }

  renderBlurb() {
    let paragraphs = this.props.bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    if (paragraphs.length < 1) return null;

    return <div className="blurb">{paragraphs}</div>;
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
            { this.renderOtherMeta() }
            { this.renderBlurb() }
          </div>
        </div>
      </div>
    );
  }
}
export default Bio;
