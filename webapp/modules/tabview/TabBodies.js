import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import TabBody from "./TabBody";

export default createReactClass({
  displayName: "tabview/TabBodies",

  propTypes: {
    id: PropTypes.string,
    selectedTabIdx: PropTypes.number,
    tabs: PropTypes.array,
  },

  render() {
    const { id, tabs, selectedTabIdx } = this.props;
    const tabBodies = tabs.map((tab, i) => {
      const selected = (selectedTabIdx === i);
      // Only include the body if it's selected
      return <TabBody key={tab.id} id={tab.id} selected={selected}>{selected ? tab.body : ""}</TabBody>;
    });
    return (
      <div className={id + "Bodies tabBodies"}>
        {tabBodies}
      </div>
    );
  },
});
