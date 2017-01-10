import React from 'react';
import { Link } from 'react-router';

const HintMessage = (props) => {
  return (
    <div>
      <div className="hint-message text-center">
        <h2><img src={props.imgSrc} /></h2>
        <h2>{props.header}</h2>
        {props.children}
        <Link to={props.btn.to} className="btn">{props.btn.text}</Link>
      </div>
    </div>
  );
};

export { HintMessage as default };
