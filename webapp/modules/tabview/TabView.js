import React from "react";
import PropTypes from "prop-types";

import TabBar from "./TabBar";
import TabBodies from "./TabBodies";

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.tabBodies = React.createRef();
  }

  onSelectTab = (tabIdx, tab, tabs) => {
    const { onSelectedTabChange } = this.props;
    onSelectedTabChange(tabIdx, tab, tabs);
  }

  getTab(name) {
    return this.tabBodies.current.getTab(name);
  }

  render() {
    const { id, tabs, selectedTabIdx } = this.props;

    return (
      <table cellPadding="0" cellSpacing="0" className={"tabView " + (id || "")}>
        <tbody className="">
          <tr className="tabViewRow">
            <td style={{ verticalAlign: "top" }} className="tabViewCol">
              <div className="tabViewBody">
                <TabBar id={id} tabs={tabs} selectedTabIdx={selectedTabIdx} onSelectTab={this.onSelectTab} />
                <TabBodies ref={this.tabBodies} id={id} tabs={tabs} selectedTabIdx={selectedTabIdx} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

TabView.propTypes = {
  id: PropTypes.string,
  selectedTabIdx: PropTypes.number,
  tabs: PropTypes.array,
  onSelectedTabChange: PropTypes.func,
};

export default TabView;
