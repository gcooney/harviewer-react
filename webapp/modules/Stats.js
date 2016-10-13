import React from "react";

import TimingPie from "./pie/TimingPie";
import ContentPie from "./pie/ContentPie";
import TrafficPie from "./pie/TrafficPie";
import CachePie from "./pie/CachePie";
import * as Lib from "./core/lib";

let Pie = {
  showInfoTip(infoTip, target, x, y) {
    const pieTable = Lib.getAncestorByClass(target, "pagePieTable");
    if (!pieTable) {
      return false;
    }

    const label = Lib.getAncestorByClass(target, "pieLabel");
    if (label) {
      PieInfoTip.render(pieTable.repObject, label.repObject, infoTip);
      return true;
    }
  },
};

class Stats extends React.Component {
  isVisible() {
    return Lib.hasClass(this.element, "opened");
  }

  update(pages) {
    if (!this.isVisible()) {
      return;
    }

    this.cleanUp();

    [
      "timingPie",
      "contentPie",
      "trafficPie",
      "cachePie",
    ].forEach((key) => this.refs[key] && this.refs[key].update(pages));
  }

  cleanUp() {
    [
      "timingPie",
      "contentPie",
      "trafficPie",
      "cachePie",
    ].forEach((key) => this.refs[key] && this.refs[key].cleanUp());
  }

  render() {
    this.update();
    return (
      <div style={{ height: "auto" }} className="pageStatsBody opened">
        <TimingPie ref="timingPie" {...this.props} />
        <ContentPie ref="contentPie" {...this.props} />
        <TrafficPie ref="trafficPie" {...this.props} />
        <CachePie ref="cachePie" {...this.props} />
      </div>
    );
  }
}

export default Stats;
