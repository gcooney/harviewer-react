import React, { Component } from "react";
import PropTypes from "prop-types";

import ObjectTree from "../../tree/ObjectTree";

class DOMBox extends Component {
  render() {
    const { har, title } = this.props;
    if (!har) {
      return null;
    }

    return (
      <table cellPadding="0" cellSpacing="0" className="domBox">
        <tbody className="">
          <tr className="">
            <td className="content">
              <div className="title">{title}</div>
              <ObjectTree root={har} />
            </td>
            <td className="splitter"></td>
            <td className="results">
              <div className="resultsDefaultContent">JSON Query Results</div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

DOMBox.propTypes = {
  har: PropTypes.object,
  title: PropTypes.string,
};

export default DOMBox;
