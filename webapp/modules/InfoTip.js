import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default createReactClass({
  displayName: "InfoTip",

  propTypes: {
    children: PropTypes.node,
    onRef: PropTypes.func,
    infoTipMargin: PropTypes.number,
    infoTipWindowPadding: PropTypes.number,
  },

  getInitialState() {
    return {
      active: false,
      multiline: false,
    };
  },

  placeInfoTip(infoTip, x, y) {
    const { infoTipMargin, infoTipWindowPadding } = this.props;

    const docEl = infoTip.ownerDocument.documentElement;
    const panelWidth = docEl.clientWidth;
    const panelHeight = docEl.clientHeight;

    const style = {};

    if (x + infoTip.offsetWidth + infoTipMargin >
      panelWidth - infoTipWindowPadding) {
      style.left = "auto";
      style.right = ((panelWidth - x) + infoTipMargin) + "px";
    } else {
      style.left = (x + infoTipMargin) + "px";
      style.right = "auto";
    }

    if (y + infoTip.offsetHeight + infoTipMargin > panelHeight) {
      style.top = Math.max(0,
        panelHeight - (infoTip.offsetHeight + infoTipMargin)) + "px";
      style.bottom = "auto";
    } else {
      style.top = (y + infoTipMargin) + "px";
      style.bottom = "auto";
    }

    infoTip.style.top = style.top;
    infoTip.style.left = style.left;
    infoTip.style.right = style.right;
    infoTip.style.bottom = style.bottom;

    console.log(style);
    console.log(infoTip.style);
  },

  refresh(props, state) {
    const { active, multiline, x, y } = state;
    this.setActiveAttr(this.infoTip, active, multiline);
    if (active) {
      this.placeInfoTip(this.infoTip, x, y);
    }
  },

  setActiveAttr(ref, active, multiline) {
    ref.setAttribute("active", active);
    // There is no background image for mulitline tooltips.
    ref.setAttribute("multiline", multiline);
  },

  componentDidMount() {
    this.refresh(this.props, this.state);
    if (this.props.onRef) {
      this.props.onRef(this.infoTip);
    }
  },

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.refresh(nextProps, nextState);
  },

  render() {
    return (
      <div className="infoTip" ref={(ref) => this.infoTip = ref}>
        {this.props.children}
      </div>
    );
  },
});
