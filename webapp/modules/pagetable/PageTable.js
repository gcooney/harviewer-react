import React from "react";
import PropTypes from "prop-types";

import setState from "../setState";
import booleanFlipper from "../booleanFlipper";

import PageRow from "./PageRow";
import PageInfoRow from "./PageInfoRow";

export default class PageTable extends React.Component {
  constructor(props) {
    super(props);

    const { model } = this.props;
    if (!model || !model.input) {
      this.state = {};
    } else {
      const pages = model.input.log.pages || [];
      this.state = {
        pageRowExpandedState: pages.map((page, i) => false),
      };
    }
  }

  createPageRows(model) {
    const rows = [];

    if (!model || !model.input) {
      return rows;
    }

    const { pages } = model.input.log;

    if (pages) {
      const { pageRowExpandedState } = this.state;

      // Use concat to flatten an array of arrays to a flat array.
      return rows.concat(pages.map((page, i) => {
        const opened = pageRowExpandedState[i];
        const pageRow = <PageRow key={"PageRow" + i} page={page} opened={opened} onClick={this.onPageRowClick.bind(this, i)} />;
        if (!opened) {
          return pageRow;
        }
        return [pageRow, <PageInfoRow key={"PageInfoRow" + i} model={model} page={page} />];
      }));
    }

    return rows;
  }

  onPageRowClick(pageRowIdx) {
    setState(this, {
      pageRowExpandedState: this.state.pageRowExpandedState.map(booleanFlipper(pageRowIdx))
    });
  }

  render() {
    const { model } = this.props;
    const pageRows = this.createPageRows(model);

    return (
      <table className="pageTable" cellPadding="0" cellSpacing="0">
        <tbody>
          {pageRows}
        </tbody>
      </table>
    );
  }
};

PageTable.displayName = "pagetable/PageTable";

PageTable.propTypes = {
  model: PropTypes.object,
};
