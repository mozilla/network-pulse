import React from 'react';

export default (props) => {
  let renderThumbnail = (thumbnail = ``) => {
    let style = {};

    if (thumbnail) {
      style = {
        backgroundImage: `url(${thumbnail})`
      };
    }

    return <div className="thumbnail mx-auto" style={style}></div>;
  };

  let renderProfileBlurb = (bio = ``) => {
    if (!bio) return null;

    let paragraphs = bio.split(`\n`).map((paragraph) => {
      if (!paragraph) return null;

      return <p key={paragraph}>{paragraph}</p>;
    });

    return <div className="blurb">{paragraphs}</div>;
  };

  return <div className="profile-card bio col-md-8 my-5">
    <div className="row">
      <div className="col-6 offset-3 col-md-3 offset-md-0 mb-4 mb-md-0">
        { renderThumbnail(props.thumbnail) }
      </div>
      <div className="col-md-9">
        <h4 className="name">({props.id}) {props.name}</h4>
        { renderProfileBlurb(props.user_bio) }
      </div>
    </div>
  </div>;
};
