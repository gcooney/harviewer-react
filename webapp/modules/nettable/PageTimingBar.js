import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default createReactClass({
  displayName: "nettable/PageTimingBar",

  propTypes: {
    classes: PropTypes.string,
    left: PropTypes.string,
  },

  render() {
    let { left, classes } = this.props;
    const style = {
      left: left,
      display: "block"
    };
    return (
      <div className={classes + " netPageTimingBar netBar"} style={style}></div>
    );
  }
});
