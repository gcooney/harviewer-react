import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import Tab from "./Tab";

export default createReactClass({
  displayName: "tabview/TabBar",

  propTypes: {
    id: PropTypes.string,
    onSelectTab: PropTypes.func,
    selectedTabIdx: PropTypes.number,
    tabs: PropTypes.array,
  },

  onSelectTab(tab, tabIdx) {
    const { tabs, onSelectTab } = this.props;
    if (onSelectTab) {
      onSelectTab(tabs[tabIdx], tabIdx, tabs);
    }
  },

  render() {
    const { id, tabs, selectedTabIdx } = this.props;
    const tabElements = tabs.map((tab, i) =>
      <Tab key={tab.id} { ...tab } selected={selectedTabIdx === i} onSelect={this.onSelectTab.bind(this, tab, i)} />
    );
    return (
      <div className={id + "Bar tabBar"}>
        {tabElements}
      </div>
    );
  }
});
