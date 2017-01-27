import React from 'react';
import { Link } from 'react-router';

const HintMessage = (props) => {
  return (
    <div>
      <div className="hint-message text-center">
        <h2><img src={props.imgSrc} /></h2>
        <h2>{props.header}</h2>
        {props.children}
        { props.btn ? <Link to={props.btn.to} className="btn">{props.btn.text}</Link>
                    : <a href={props.link.href} className="btn">{props.link.text}</a> }
      </div>
    </div>
  );
};

export { HintMessage as default };
