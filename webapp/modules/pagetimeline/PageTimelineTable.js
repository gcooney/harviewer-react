import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default createReactClass({
  displayName: "pagetimeline/PageTimelineTable",

  propTypes: {
    pageTimelineCols: PropTypes.node,
  },

  render() {
    return (
      <table cellPadding="0" cellSpacing="0" className="pageTimelineTable">
        <tbody className=" ">
          <tr className="pageTimelineRow">
            {this.props.pageTimelineCols}
          </tr>
        </tbody>
      </table>
    );
  }
});
