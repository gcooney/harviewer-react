import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

const Bar = createReactClass({
  displayName: "nettable/Bar",

  propTypes: {
    bar: PropTypes.object,
  },

  render() {
    const { bar } = this.props;

    const timeLabel = bar.timeLabel ? <span className="netTimeLabel ">{bar.timeLabel}</span> : null;

    return (
      <div className={bar.className + " netBar"} style={bar.style}>
        {timeLabel}
      </div>
    );
  }
});

export default Bar;
