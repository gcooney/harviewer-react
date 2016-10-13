import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Lib from "../core/lib";

class PageTimelineCol extends Component {
  render() {
    const title = "Click to select and include in statistics preview.";
    const style = {
      height: this.getHeight() + "px",
    };
    return (
      <td ref="dom" className="pageTimelineCol ">
        <div title={title} style={style} onClick={this.onClick} className="pageBar "></div>
      </td>
    );
  }

  onClick(event) {
    const e = Lib.fixEvent(event);

    const bar = e.target;
    if (!Lib.hasClass(bar, "pageBar")) {
      return;
    }

    const control = Lib.isControlClick(e);
    const shift = Lib.isShiftClick(e);

    const row = Lib.getAncestorByClass(bar, "pageTimelineRow");

    // If no modifier is active remove the current selection.
    if (!control && !shift) {
      Selection.unselectAll(row, bar);
    }

    // Clicked bar toggles its selection state
    Selection.toggle(bar);

    this.selectionChanged();
  }

  selectionChanged() {
    // Notify listeners such as the statistics preview
    const pages = this.getSelection();
    Lib.dispatch(this.listeners, "onSelectionChange", [pages]);
  }

  isVisible() {
    return Lib.hasClass(this.element, "opened");
  }

  getSelection() {
    if (!this.isVisible()) {
      return [];
    }

    const row = Lib.getElementByClass(this.refs.dom, "pageTimelineRow");
    return Selection.getSelection(row);
  }

  getHeight() {
    const page = this.props.page;
    const maxElapsedTime = this.props.maxElapsedTime;
    const onLoad = page.pageTimings.onLoad;

    let height = 1;
    if (onLoad > 0 && maxElapsedTime > 0) {
      height = Math.round((onLoad / maxElapsedTime) * 100);
    }

    return Math.max(1, height);
  }
}

PageTimelineCol.propTypes = {
  maxElapsedTime: PropTypes.number,
  page: PropTypes.object,
};

export default PageTimelineCol;
