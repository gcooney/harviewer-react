import React from "react";
import { render } from "react-dom";
import App from "./modules/App";

const mode = (window.location.href.split("?")[0].endsWith("preview.html")) ?
  "preview" :
  "";
render(<App mode={mode} />, document.getElementById("content"));
