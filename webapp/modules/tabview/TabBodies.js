import React from "react";
import PropTypes from "prop-types";

import TabBody from "./TabBody";

class TabBodies extends React.Component {
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
  }
}

TabBodies.propTypes = {
  id: PropTypes.string,
  selectedTabIdx: PropTypes.number,
  tabs: PropTypes.array,
};

export default TabBodies;
