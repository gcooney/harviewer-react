import React, { Component } from "react";
import PropTypes from "prop-types";

import DOMBox from "./DOMBox";
import Toolbar from "../../toolbar/Toolbar";
import ObjectSearch from "../../tabs/ObjectSearch";

const caseSensitiveCookieName = "searchCaseSensitive";

class SearchBox extends React.Component {
  state = {
    searchValue: "",
    status: null,
  }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({
      searchValue: text,
    }, () => this.search(text));
  }

  onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.search(e.target.value);
    }
  }

  search(text) {
    const result = this.props.search(text);
    this.setState({
      status: result ? null : "notfound",
    });
  }

  render() {
    const { status } = this.state;
    return (
      <span className="searchBox">
        <span className="toolbarSeparator resizer">&nbsp;</span>
        <span className="searchTextBox">
          <input type="text" placeholder="Search" className="searchInput" status={status} value={this.state.searchValue} onChange={this.onChange} onKeyPress={this.onKeyPress} />
          <span className="arrow">&nbsp;</span>
        </span>
      </span>
    );
  }
}

class DOMTab extends Component {
  search = (text) => {
    if (text.length < 3) {
      return true;
    }

    if (this.currentSearch && this.currentSearch.text !== text) {
      console.log("new text, clear search");
      this.currentSearch = null;
    }

    if (!this.currentSearch) {
      console.log("create search");
      const { harModels } = this.props;
      const inputs = harModels;
      this.currentSearch = new ObjectSearch(text, inputs, false, caseSensitiveCookieName);
    }

    if (this.currentSearch.findNext(text)) {
      console.log(this.currentSearch);
      return true;
    }

    return false;
  }

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
          <SearchBox search={this.search} />
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
