import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Lib from "../core/lib";
import * as HarModel from "../preview/harModel";
import Strings from "amdi18n-loader!../nls/PageTimeline";

class PageDescContainer extends Component {
  render() {
    return (
      <div className="pageDescBox ">
        <div className="connector " style={{ marginLeft: "18px" }}></div>
        <div className="desc "><span className="summary ">{this.getSummary(this.props.model, this.props.page)}</span>
          <span className="time ">{this.getTime(this.props.page)}</span>
          <span className="title ">{this.getTitle(this.props.page)}</span>
          <pre className="comment ">{this.getComment(this.props.page)}</pre>
        </div>
      </div>
    );
  }

  getSummary(model, page) {
    let summary = "";
    const onLoad = page.pageTimings.onLoad;
    if (onLoad > 0) {
      summary += Strings.pageLoad + ": " + Lib.formatTime(onLoad) + ", ";
    }

    const requests = HarModel.getPageEntries(model.input, page);
    const count = requests.length;
    summary += count + " " + (count === 1 ? Strings.request : Strings.requests);

    return summary;
  }

  getTime(page) {
    const pageStart = Lib.parseISO8601(page.startedDateTime);
    const date = new Date(pageStart);
    return date.toLocaleString();
  }

  getTitle(page) {
    return page.title;
  }

  getComment(page) {
    return page.comment ? page.comment : "";
  }
}

PageDescContainer.propTypes = {
  model: PropTypes.object,
  page: PropTypes.object,
};

export default PageDescContainer;
