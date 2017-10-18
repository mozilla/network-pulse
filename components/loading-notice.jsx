import React from 'react';

export default () => {
  // 3 empty <div></div> here are for the loading animation dots (done in CSS) to show.
  return <div className="loading my-5 d-flex justify-content-center align-items-center">
              <div></div>
              <div></div>
              <div></div>
            </div>;
};
