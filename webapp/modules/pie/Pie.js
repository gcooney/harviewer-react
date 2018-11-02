import React, { Component } from "react";

import * as Lib from "../core/lib";

export default function createPie(fields) {
  const clazz = class extends Component {
    constructor(props) {
      super(props);
      this.title = fields.title || "TITLE";
      this.data = fields.data || [];
    }

    componentDidMount() {
      this.draw(this.refs.canvas, this);
    }

    render() {
      const model = this.props.model;

      const pages = model ? model.input.log.pages : null;

      if (pages) {
        this.update(pages);
      }

      let labels = this.data.map(item => (
        <div key={item.label} className="pieLabel ">
          <span style={{ backgroundColor: item.color }} className="box ">&nbsp; </span><span className="label ">{item.label}</span>
        </div>
      ));

      return (
        <table ref="container" cellPadding="0" cellSpacing="0" className="pagePieTable ">
          <tbody className=" ">
            <tr className=" ">
              <td title={this.title} className="pieBox ">
                <canvas ref="canvas" className="pieGraph " height="100" width="100"></canvas>
              </td>
              <td className=" ">
                {labels}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    cleanUp() {
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].value = 0;
        this.data[i].count = 0;
      }
    }

    getLabelTooltipText(item) {
      return fields.getLabelTooltipText ? fields.getLabelTooltipText(item) : "DEFAULT";
    }

    draw(canvas, pie) {
      if (!canvas || !canvas.getContext) {
        return;
      }

      const ctx = canvas.getContext("2d");
      const radius = Math.min(canvas.width, canvas.height) / 2;
      const center = [canvas.width / 2, canvas.height / 2];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const data = pie.data;
      let total = 0;
      for (let i = 0; i < data.length; i++) {
        total += data[i].value;
      }

      if (!total) {
        ctx.beginPath();
        ctx.moveTo(center[0], center[1]); // center of the pie
        ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = "rgb(229,236,238)";
        ctx.lineStyle = "lightgray";
        ctx.fill();
        return;
      }

      let sofar = 0; // keep track of progress

      for (let j = 0; j < data.length; j++) {
        const thisvalue = data[j].value / total;
        if (thisvalue <= 0) {
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(center[0], center[1]);
        ctx.arc(center[0], center[1], radius,
          Math.PI * (-0.5 + 2 * sofar), // -0.5 sets set the start to be top
          Math.PI * (-0.5 + 2 * (sofar + thisvalue)),
          false);

        // line back to the center
        ctx.lineTo(center[0], center[1]);
        ctx.closePath();
        ctx.fillStyle = data[j].color;
        ctx.fill();

        sofar += thisvalue; // increment progress tracker
      }
    }

    update(pages) {
      this.cleanUp();

      // If there is no selection, display stats for all pages/files.
      if (!pages || !pages.length) {
        fields.handlePage.call(this, null);
        return;
      }

      // Iterate over all selected pages
      for (let j = 0; j < pages.length; j++) {
        const page = pages[j];
        fields.handlePage.call(this, page);
      }
    }

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
    }
  };
  clazz.displayName = fields.title;
  return clazz;
}
