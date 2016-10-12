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
      <table cellPadding="0" cellSpacing="0" className="domTable">
        <tbody className="">
          <tr level="0" className="memberRow domRow hasChildren hasChildren opened">
            <td style={{ paddingLeft: "0px" }} className="memberLabelCell">
              <span className="memberLabel domLabel">log</span>
            </td>
            <td className="memberValueCell">
              <div className="objectBox objectBox-object">TODO - THIS IS FAKE</div>
            </td>
          </tr>
          <tr level="1" className="memberRow domRow">
            <td style={{ paddingLeft: "16px" }} className="memberLabelCell">
              <span className="memberLabel domLabel">version</span>
            </td>
            <td className="memberValueCell">
              <div className="objectBox objectBox-string">1.2</div>
            </td>
          </tr>
          <tr level="1" className="memberRow domRow hasChildren hasChildren">
            <td style={{ paddingLeft: "16px" }} className="memberLabelCell">
              <span className="memberLabel domLabel">creator</span>
            </td>
            <td className="memberValueCell">
              <div className="objectBox objectBox-object">Object</div>
            </td>
          </tr>
          <tr level="1" className="memberRow domRow hasChildren hasChildren">
            <td style={{ paddingLeft: "16px" }} className="memberLabelCell">
              <span className="memberLabel domLabel">pages</span>
            </td>
            <td className="memberValueCell">
              <div className="objectBox objectBox-array">Array [1]</div>
            </td>
          </tr>
          <tr level="1" className="memberRow domRow hasChildren hasChildren">
            <td style={{ paddingLeft: "16px" }} className="memberLabelCell">
              <span className="memberLabel domLabel">entries</span>
            </td>
            <td className="memberValueCell">
              <div className="objectBox objectBox-array">Array [1]</div>
            </td>
          </tr>
        </tbody>
      </table>
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
