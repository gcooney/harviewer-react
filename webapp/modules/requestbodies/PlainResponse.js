import React from "react";
import PropTypes from "prop-types";

import * as Str from "../core/string";

class PlainResponse extends React.Component {
  render() {
    const { entry } = this.props;
    const { text } = entry.response.content;

    return (
      <div className="netInfoResponseText netInfoText">
        <pre>
          {Str.wrapText(text, true)}
        </pre>
      </div>
    );
  }
}

PlainResponse.propTypes = {
  entry: PropTypes.object,
};

export default PlainResponse;
