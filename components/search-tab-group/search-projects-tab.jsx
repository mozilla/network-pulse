import React from 'react';
import { Helmet } from "react-helmet";
import ProjectLoader from '../../components/project-loader/project-loader.jsx';

export default (props) => {
  return (
    <div className="search-projects-tab">
      <Helmet><title>Project search</title></Helmet>
      { props.keywordSearched && <ProjectLoader search={props.keywordSearched} showCounter={true} />}
    </div>
  );
};
