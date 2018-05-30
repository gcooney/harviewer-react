import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default createReactClass({
  displayName: "tabview/TabBody",

  propTypes: {
    children: PropTypes.node,
    id: PropTypes.string,
    selected: PropTypes.bool,
  },

  render() {
    const { id, selected } = this.props;
    return (
      <div className={"tab" + id + "Body tabBody " + (selected ? "selected" : "")}>
        {this.props.children}
      </div>
    );
  },
});
