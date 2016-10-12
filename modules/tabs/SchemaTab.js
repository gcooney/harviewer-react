import React from "react";
import PropTypes from "prop-types";

class SchemaTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.domRef = React.createRef();
  }

  maybeDoHighlighting() {
    const { text } = this.state;
    if (!text) {
      return;
    }

    const pre = this.domRef.current;
    const code = pre.firstChild;

    // clear flag
    code.removeAttribute("highlighted");

    code.innerText = "";
    code.appendChild(document.createTextNode(text));
    // Run highlightElement on the <code>, not the <pre>
    Prism.highlightElement(code);

    // set flag that is useful for testing - to determine if highlighting has worked.
    const brush = "javascript";
    if (code.classList.contains(`language-${brush}`)) {
      code.setAttribute("highlighted", true);
    }
  }

  componentDidMount() {
    const { text } = this.state;
    if (text) {
      return;
    }
    fetch("modules/preview/harSchema.js")
      .then((response) => response.text())
      .then((text) => {
        const state = { text };
        this.setState(state, () => this.maybeDoHighlighting());
      });
  }

  render() {
    const brush = "javascript";
    return (
      <pre className={`language-${brush} line-numbers`} name="code" ref={this.domRef}>
        <code></code>
      </pre>
    );
  }
}

SchemaTab.propTypes = {
  version: PropTypes.string,
  harSpecURL: PropTypes.string,
  harViewerExampleApp: PropTypes.string,
};

export default SchemaTab;
