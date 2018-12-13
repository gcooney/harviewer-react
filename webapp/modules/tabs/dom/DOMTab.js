import React, { Component } from "react";
import PropTypes from "prop-types";

import Dom from "../../core/dom";
import Toolbar from "../../toolbar/Toolbar";
import ObjectSearch from "../../tabs/ObjectSearch";

import DOMBox from "./DOMBox";
import SearchBox from "./SearchBox";

const caseSensitiveCookieName = "searchCaseSensitive";

class DOMTab extends Component {
  constructor(...args) {
    super(...args);

    this.domBoxRefs = this.props.harModels.map(() => React.createRef());
    this.searchRef = React.createRef();
  }

  async selectText(search) {
    const key = search.stack
      .slice(1)
      .reduce((key, stackItem, i, stack) => {
        let propIndex = stackItem.propIndex;
        if (i < stack.length - 1) {
          // all indexes except the last are off-by-one when it comes to generating the key.
          propIndex -= 1;
        }
        return key ? key + "." + propIndex : String(propIndex);
      }, "");


    // The root of search data is the list of inputs.
    const { propIndex } = search.stack[0];

    const domBoxRef = this.domBoxRefs[propIndex - 1];

    // wait for the nodes to be shown before trying to select text
    await domBoxRef.current.getTree().showNode(key);

    const objectBox = domBoxRef.current.getTree().findObjectBox(key);
    if (objectBox) {
      const textNode = objectBox.firstChild;
      search.selectText(textNode);
      Dom.scrollIntoCenterView(objectBox);
    }
  }

  search = (text) => {
    if (text.length < 3) {
      return true;
    }

    if (this.currentSearch && this.currentSearch.text !== text) {
      this.currentSearch = null;
    }

    if (!this.currentSearch) {
      const { harModels } = this.props;
      const inputs = harModels.map(({ input }) => input);
      this.currentSearch = new ObjectSearch(text, inputs, false, caseSensitiveCookieName);
    }

    if (this.currentSearch.findNext(text)) {
      this.selectText(this.currentSearch);
      return true;
    }

    this.currentSearch = null;

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
          <SearchBox ref={this.searchRef} search={this.search} />
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
              return <DOMBox ref={this.domBoxRefs[i]} key={`DOMBox${i}`} har={model.input} title={title} />;
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
