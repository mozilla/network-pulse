import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import HintMessage from '../../components/hint-message/hint-message.jsx';

const Submitted = () => {
  return (
    <div>
      <Helmet><title>Thank you!</title></Helmet>
      <HintMessage iconComponent={<img src="/assets/svg/icon-bookmark-selected.svg" />}
        header="Thanks!"
        linkComponent={<Link to={`/myprofile`}>Edit your profile</Link>}
      >
        <p>After moderation, you can find your entry on your profile.</p>
      </HintMessage>
    </div>
  );
};

export default Submitted;
