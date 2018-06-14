import React from "react";
import PropTypes from "prop-types";

import { canDecode } from "./decoder";
import * as Mime from "../core/mime";

class JSON extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { entry } = this.props;

    return (
      <div>JSON</div>
    );
  }
};

JSON.propTypes = {
  entry: PropTypes.object,
};

JSON.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  const mimeType = Mime.extractMimeType(content.mimeType || "");
  return ["application/json"].indexOf(mimeType) > -1;
};

export default JSON;
