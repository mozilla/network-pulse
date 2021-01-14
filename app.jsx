import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { GoogleAnalytics } from "./js/google-analytics.js";
import Main from "./main.jsx";

GoogleAnalytics.init();

ReactDOM.render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>,
  document.getElementById(`app`)
);
