import React from "react";
import PropTypes from "prop-types";

import ParamRow from "./ParamRow";
import TitleRow from "./TitleRow";

class Headers extends React.Component {
  render() {
    const { entry } = this.props;

    return (
      <table cellPadding="0" cellSpacing="0" className="netInfoHeadersText netInfoText netInfoHeadersTable ">
        <tbody>
          <TitleRow titleType="Response" title="Response Headers" />
          {
            entry.response.headers.map((header, i) =>
              <ParamRow key={i} name={header.name} value={header.value} />
            )
          }
          <TitleRow titleType="Request" title="Request Headers" />
          {
            entry.request.headers.map((header, i) =>
              <ParamRow key={i} name={header.name} value={header.value} />
            )
          }
        </tbody>
      </table>
    );
  }
}

Headers.canShowEntry = function(entry) {
  return (entry.response.headers.length > 0);
};

Headers.propTypes = {
  entry: PropTypes.object,
};

export default Headers;
