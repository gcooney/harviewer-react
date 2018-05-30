import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import { render, unmountComponentAtNode } from "react-dom";

import * as Lib from "core/lib";

import InfoTip from "./InfoTip";

const InfoTipHolder = createReactClass({
  displayName: "",

  propTypes: {
    children: PropTypes.node,
  },

  listeners: [],
  maxWidth: 100,
  maxHeight: 80,
  infoTipMargin: 10,
  infoTipWindowPadding: 25,

  getChildContext() {
    return {
      infoTipHolder: this,
    };
  },

  componentDidMount() {
    $(this.holder).on("mouseover", this.mousemove);
    $(this.holder).on("mouseover", this.mouseout);
    $(this.holder).on("mouseover", this.mousemove);
  },

  componentWillUnmount() {
    $(this.holder).off("mouseover", this.mousemove);
    $(this.holder).off("mouseover", this.mouseout);
    $(this.holder).off("mouseover", this.mousemove);
  },

  setInfoTipState(state) {
    if (this.infoTip) {
      // console.log("setInfoTipState", state);
      this.infoTip.setState(state);
    }
  },

  showInfoTip(infoTip, target, x, y, rangeParent, rangeOffset) {
    const scrollParent = Lib.getOverflowParent(target);
    const scrollX = x + (scrollParent ? scrollParent.scrollLeft : 0);

    // Distribute event to all registered listeners and show the info tip if
    // any of them return true.
    const dispatchArgs = [infoTip, target, scrollX, y, rangeParent, rangeOffset];
    const result = Lib.dispatch2(this.listeners, "showInfoTip", dispatchArgs);

    if (result && result.element) {
      unmountComponentAtNode(infoTip);
      render(result.element, infoTip);

      this.setInfoTipState({
        active: true,
        x,
        y,
        multiline: result.multiline,
      });
    } else {
      this.setInfoTipState({
        active: false,
        x,
        y,
      });
    }
  },

  onInfoTipRef(ref) {
    console.log("onInfoTipRef", ref);
    this.infoTipDom = ref;
  },

  addListener(listener) {
    this.listeners.push(listener);
  },

  removeListener(listener) {
    Lib.remove(this.listeners, listener);
  },

  mousemove(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.showInfoTip(this.infoTipDom, e.target, x, y, e.rangeParent, e.rangeOffset);
  },

  mouseout(e) {
    if (!e.relatedTarget) {
      this.setInfoTipState({
        active: false,
      });
    }
  },

  render() {
    const { infoTipMargin, infoTipWindowPadding } = this;
    return (
      <div ref={(ref) => this.holder = ref}>
        {this.props.children}
        <InfoTip ref={(ref) => this.infoTip = ref} onRef={this.onInfoTipRef} infoTipMargin={infoTipMargin} infoTipWindowPadding={infoTipWindowPadding} />
      </div>
    );
  },
});

InfoTipHolder.childContextTypes = {
  infoTipHolder: PropTypes.object,
};

export default InfoTipHolder;
