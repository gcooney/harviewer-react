import React, { Component } from "react";
import PropTypes from "prop-types";

import PageTimelineCol from "./PageTimelineCol";
import PageDescContainer from "./PageDescContainer";
import PageTimelineTable from "./PageTimelineTable";

class PageTimeline extends Component {
  render() {
    const model = this.props.model;
    let page = this.props.page;
    let pages = null;

    if (model) {
      if (!page) {
        page = model.input.log.pages[0];
      }
      pages = model.getPages();
    }

    const pageTimelineCols = pages ? pages.map((page, i) => <PageTimelineCol key={"PageTimelineCol" + i} page={page} maxElapsedTime={this.maxLoadTime(pages)} />) : null;
    const pageDescContainer = page ? <PageDescContainer model={model} page={page} /> : null;

    return (
      <div style={{ height: "auto" }} className="pageTimelineBody   opened ">
        <table style={{ margin: "7px" }} cellPadding="0" cellSpacing="0" className=" ">
          <tbody className=" ">
            <tr className=" ">
              <td className=" ">
                <PageTimelineTable pageTimelineCols={pageTimelineCols} />
              </td>
            </tr>
            <tr className=" ">
              <td colSpan="2" className="pageDescContainer ">
                {pageDescContainer}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  maxLoadTime(pages) {
    // Iterate over all pages and find the max load-time so, the vertical
    // graph extent can be set.
    return pages.reduce((max, page) => {
      const onLoadTime = page.pageTimings.onLoad;
      return Math.max(onLoadTime, max);
    }, 0);
  }
}

PageTimeline.propTypes = {
  model: PropTypes.object,
  page: PropTypes.object,
};

export default PageTimeline;
