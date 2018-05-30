import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import * as Str from "core/string";

export default createReactClass({
  displayName: "requestbodies/PlainResponse",

  propTypes: {
    entry: PropTypes.object,
  },

  render() {
    const { entry } = this.props;

    var text = entry.response.content.text;

    return (
      <div className="netInfoResponseText netInfoText">
        <pre>
          {Str.wrapText(text, true)}
        </pre>
      </div>
    );
  }
});
