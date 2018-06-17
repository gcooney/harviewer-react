import React from "react";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";

import setState from "../setState";
import Stats from "../Stats";
import PageTimeline from "../pagetimeline/PageTimeline";
import PreviewTabToolbar from "./PreviewTabToolbar";
import PreviewList from "./preview/PreviewList";

class PreviewTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timelineVisible: false,
      statsVisible: false,
    };
  }

  onDownloadClick(e) {
    e.preventDefault();
    // TODO find out which model to copy.
    const { harModels } = this.props;
    const model = harModels[0];
    const json = model ? model.toJSON() : "";
    const blob = new Blob([json], { type: "text/plain;charset=" + document.characterSet });
    saveAs(blob, "netData.har");
  }

  onStatsClick(e) {
    e.preventDefault();
    setState(this, {
      statsVisible: !this.state.statsVisible,
    });
  }

  onTimelineClick(e) {
    e.preventDefault();
    setState(this, {
      timelineVisible: !this.state.timelineVisible,
    });
  }

  onClearClick(e) {
    e.preventDefault();
    const href = window.location.href;
    const index = href.indexOf("?");
    window.location = href.substr(0, index);
  }

  findPagelessEntries(har) {
    const { pages, entries } = har.log;

    let pageIds = {};
    if (pages && pages.length > 0) {
      pageIds = pages.reduce((ids, page) => {
        if (page.id) {
          ids[page.id] = 1;
        }
        return ids;
      }, {});
    } else {
      // No pages, so all entries are pageless
      return entries;
    }

    if (entries && entries.length > 0) {
      return entries.filter((e) => {
        if (!e.pageref) {
          // pageless
          return true;
        }
        // pageless if there isn't a matching page.id
        return !pageIds || !pageIds[e.pageref];
      });
    }

    return null;
  }

  render() {
    const { harModels, errors } = this.props;

    if (!harModels) {
      return <div></div>;
    }

    const page = null;
    const clickHandlers = {
      onStatsClick: this.onStatsClick,
      onTimelineClick: this.onTimelineClick,
      onClearClick: this.onClearClick,
      onDownloadClick: this.onDownloadClick,
    };

    return (
      <div>
        <div className="previewToolbar">
          <PreviewTabToolbar {...clickHandlers} />
        </div>
        <div className="previewTimeline">
          {this.state.timelineVisible ? <PageTimeline model={model} page={page} /> : ""}
        </div>
        <div className="previewStats">
          {this.state.statsVisible ? <Stats /> : ""}
        </div>
        <PreviewList harModels={harModels} errors={errors} />
      </div>
    );
  }
};

PreviewTab.propTypes = {
  harModels: PropTypes.array,
  errors: PropTypes.array,
};

export default PreviewTab;
