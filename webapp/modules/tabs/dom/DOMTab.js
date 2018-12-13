import React from "react";
import PropTypes from "prop-types";

import DOMBox from "./DOMBox";
import Toolbar from "../../toolbar/Toolbar";

class SearchBox extends React.Component {
  render() {
    return (
      <span className="searchBox">
        <span className="toolbarSeparator resizer">&nbsp;</span>
        <span className="searchTextBox">
          <input type="text" placeholder="Search" className="searchInput" />
          <span className="arrow">&nbsp;</span>
        </span>
      </span>
    );
  }
}

class DOMTab extends React.Component {
  onClick = (e) => { }

  renderToolbar() {
    return (
      <div key="Toolbar" className="domToolbar">
        <Toolbar>
          <SearchBox />
        </Toolbar>
      </div>
    );
  }

  render() {
    const { harModels } = this.props;
    return (
      <>
        {this.renderToolbar()}
        <div className="domContent">
          <DOMBox key="DOMBox" ref={this.domBoxRef} harModels={harModels} />
        </div>
      </>
    );
  }
}

DOMTab.propTypes = {
  appendPreview: PropTypes.func,
  requestTabChange: PropTypes.func,
  harModels: PropTypes.array,
};

export default DOMTab;
