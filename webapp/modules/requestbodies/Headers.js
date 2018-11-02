import React from "react";
import PropTypes from "prop-types";

import ParamRow from "./ParamRow";
import TitleRow from "./TitleRow";

class Headers extends React.Component {
  render() {
    const { entry } = this.props;

    const responseHeaders = entry.response.headers || [];
    const requestHeaders = entry.request.headers || [];

    return (
      <table cellPadding="0" cellSpacing="0" className="netInfoHeadersText netInfoText netInfoHeadersTable ">
        <tbody>
          <TitleRow titleType="ResponseVersion" title="Response Version" />
          <ParamRow name="" value={entry.response.httpVersion} />
          <TitleRow titleType="ResponseHeaders" title="Response Headers" />
          {
            responseHeaders.map((header, i) =>
              <ParamRow key={i} name={header.name} value={header.value} />
            )
          }
          <TitleRow titleType="RequestVersion" title="Request Version" />
          <ParamRow name="" value={entry.request.httpVersion} />
          <TitleRow titleType="RequestHeaders" title="Request Headers" />
          {
            requestHeaders.map((header, i) =>
              <ParamRow key={i} name={header.name} value={header.value} />
            )
          }
        </tbody>
      </table>
    );
  }
}

Headers.canShowEntry = function(entry) {
  return true;
};

Headers.propTypes = {
  entry: PropTypes.object,
};

export default Headers;
