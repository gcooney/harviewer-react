import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import aboutHtml from "raw!tabs/aboutTab.html";

export default createReactClass({
  displayName: "tabs/AboutTab",

  propTypes: {
    version: PropTypes.string,
    harSpecURL: PropTypes.string,
    harViewerExampleApp: PropTypes.string,
  },

  replace(s, pattern, replaceWith) {
    if (!replaceWith) {
      return s;
    }
    return s.replace(new RegExp(pattern, "g"), replaceWith);
  },

  render() {
    let { version, harSpecURL, harViewerExampleApp } = this.props;
    if (!harSpecURL) {
      harSpecURL = "http://www.softwareishard.com/blog/har-12-spec/";
    }

    let html = aboutHtml;
    html = this.replace(html, "@VERSION@", version);
    html = this.replace(html, "@HAR_SPEC_URL@", harSpecURL);
    html = this.replace(html, "@HARVIEWER_EXAMPLE_APP@", harViewerExampleApp);

    return (
      <div className="aboutBody" dangerouslySetInnerHTML={{ __html: html }}></div>
    );
  },
});
