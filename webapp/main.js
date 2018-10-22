import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import App from "./modules/App";

const path = window.location.href.split("?")[0];
const mode = (path.endsWith("preview.html")) ? "preview" : "";
const container = document.getElementById("content");
container.addEventListener("onViewerInit", (e) => console.log(e));
render(<App mode={mode} container={container} />, container);
