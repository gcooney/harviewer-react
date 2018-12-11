import React from "react";

import ObjectTree from "../../tree/ObjectTree";

class DOMBox extends React.Component {
  render() {
    const { harModels } = this.props;
    if (!harModels) {
      return null;
    }
    const har = harModels[0].input;
    return (
      <table cellPadding="0" cellSpacing="0" className="domBox">
        <tbody className="">
          <tr className="">
            <td className="content">
              <div className="title">XML</div>
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

export default DOMBox;
