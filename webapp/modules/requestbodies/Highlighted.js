import React from "react";
import PropTypes from "prop-types";
import * as Mime from "../core/mime";

import { canDecode } from "./decoder";

class Highlighted extends React.Component {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
  }

  maybeDoHighlighting() {
    const { entry } = this.props;
    const text = entry.response.content.text;

    const pre = this.domRef.current;
    const code = pre.firstChild;

    // clear flag
    code.removeAttribute("highlighted");

    code.innerText = "";
    code.appendChild(document.createTextNode(text));
    // Run highlightElement on the <code>, not the <pre>
    Prism.highlightElement(code);

    // set flag that is useful for testing - to determine if highlighting has worked.
    const brush = Highlighted.shouldHighlightAs(entry.response.content.mimeType);
    if (code.classList.contains(`language-${brush}`)) {
      code.setAttribute("highlighted", true);
    }
  }

  componentDidMount() {
    this.maybeDoHighlighting();
  }

  componentDidUpdate() {
    this.maybeDoHighlighting();
  }

  render() {
    const { entry } = this.props;
    const brush = Highlighted.shouldHighlightAs(entry.response.content.mimeType);
    // line-numbers class must come after language.
    // Prism needs a <code> block inside a <pre> block.
    return (
      <div className="netInfoHighlightedText netInfoText">
        <pre className={`language-${brush} line-numbers`} name="code" ref={this.domRef}>
          <code></code>
        </pre>
      </div>
    );
  }
};

Highlighted.propTypes = {
  entry: PropTypes.object,
};

Highlighted.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  // Remove any mime type parameters (if any)
  const mimeType = Mime.extractMimeType(content.mimeType || "");

  const shouldHighlightAs = Highlighted.shouldHighlightAs(mimeType);
  return (shouldHighlightAs !== null);
};

// TODO - Put this in the right place when we implement XML tab.
const XmlTab = {};

XmlTab.isXmlMimeType = function(mimeType) {
  mimeType = Mime.extractMimeType(mimeType);
  return [
    "text/xml",
    "application/xml",
    "image/svg+xml",
    "application/atom+xml",
    "application/xslt+xml",
    "application/mathml+xml",
    "application/rss+xml",
  ].indexOf(mimeType) > -1;
};

Highlighted.shouldHighlightAs = function(mimeType) {
  const mimeTypesToHighlight = {
    javascript: [
      "application/javascript",
      "text/javascript",
      "application/x-javascript",
      "text/ecmascript",
      "application/ecmascript",
      "application/json",
    ],
    css: ["text/css"],
    markup: ["text/html", "application/xhtml+xml"],
  };
  for (let brush in mimeTypesToHighlight) {
    if (mimeTypesToHighlight[brush].indexOf(mimeType) > -1) {
      return brush;
    }
  }
  return XmlTab.isXmlMimeType(mimeType) ? "xml" : null;
};

export default Highlighted;
