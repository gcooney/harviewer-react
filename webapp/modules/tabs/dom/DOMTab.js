import React, { Component } from "react";
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

class DOMTab extends Component {
  onClick = (e) => { }

  getTitle(har) {
    // Iterate all pages and get titles.
    // Some IE11 HARs (11.48.17134.0/11.0.65) don't have pages
    return (har.log.pages || [])
      .map(({ title }) => title)
      .join(", ");
  }

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
          {
            harModels.map((model, i) => {
              const title = this.getTitle(model.input);
              return <DOMBox key={`DOMBox${i}`} har={model.input} title={title} />;
            })
          }
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
