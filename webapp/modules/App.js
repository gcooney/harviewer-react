import React from "react";
import PropTypes from "prop-types";

import HarModel from "./preview/harModel";
import Loader from "./preview/harModelLoader";

import homeTabStrings from "amdi18n-loader!./nls/homeTab";
import harViewerStrings from "amdi18n-loader!./nls/harViewer";
import previewTabStrings from "amdi18n-loader!./nls/previewTab";
import domTabStrings from "amdi18n-loader!./nls/domTab";

import AppContext from "./AppContext";
import setState from "./setState";
import buildInfo from "./buildInfo";
import InfoTipHolder from "./InfoTipHolder";
import TabView from "./tabview/TabView";
import AboutTab from "./tabs/AboutTab";
import HomeTab from "./tabs/HomeTab";
import PreviewTab from "./tabs/PreviewTab";
import PreviewList from "./tabs/preview/PreviewList";
import SchemaTab from "./tabs/SchemaTab";

const PREVIEW_TAB_INDEX = 1;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      harModels: [],
      errors: [],
      previewCols: "url status size timeline",
      selectedTabIdx: 0,
      appendPreview: this.appendPreview,
    };
  }

  createAboutTab(harViewerExampleApp) {
    const versionStr = buildInfo.version + "/" + buildInfo.gitVersion;
    const aboutTab = {
      id: "About",
      label: harViewerStrings.aboutTabLabel,
      body: <AboutTab version={versionStr} harViewerExampleApp={harViewerExampleApp} />
    };
    aboutTab.content = (
      <div>{aboutTab.label || aboutTab.id}
        <span className="version"> {versionStr}</span>
      </div>
    );
    return aboutTab;
  }

  createTabs() {
    const { harModels, errors } = this.state;

    let harViewerExampleApp = window.location.href.split("?")[0];
    if (!harViewerExampleApp.endsWith("/")) {
      harViewerExampleApp += "/";
    }

    const tabs = [
      {
        id: "Home",
        label: homeTabStrings.homeTabLabel,
        body: <HomeTab requestTabChange={(tabName) => setState(this, { selectedTabIdx: 3 })} />,
      },
      {
        id: "Preview",
        label: previewTabStrings.previewTabLabel,
        body: <PreviewTab harModels={harModels} errors={errors} />,
      },
      {
        id: "DOM",
        label: domTabStrings.domTabLabel,
      },
      this.createAboutTab(harViewerExampleApp),
      {
        id: "Schema",
        label: harViewerStrings.schemaTabLabel,
        body: <SchemaTab />,
      },
    ];

    return tabs;
  }

  updatePreviewCols() {
    const content = document.getElementById("content");
    content.setAttribute("previewCols", this.state.previewCols);
  }

  appendPreview = (harObjectOrString) => {
    // TODO - get validate from checkbox/cookie value
    const { harModels, errors, validate } = this.state;

    try {
      const model = new HarModel();
      const har = (typeof harObjectOrString === "string") ? HarModel.parse(harObjectOrString, validate) : harObjectOrString;
      model.append(har);
      setState(this, {
        harModels: harModels.concat([model]),
        selectedTabIdx: PREVIEW_TAB_INDEX,
      });
    } catch (err) {
      setState(this, {
        errors: errors.concat(err),
        selectedTabIdx: PREVIEW_TAB_INDEX,
      });
    }
  }

  componentDidMount() {
    this.updatePreviewCols();

    Loader.run((response) => {
      this.appendPreview(response);
    }, (err) => console.error(err));
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
    this.updatePreviewCols();
  }

  render() {
    const { selectedTabIdx, harModels, errors } = this.state;
    const { mode } = this.props;

    return (
      <AppContext.Provider value={this.state}>
        <InfoTipHolder>
          {
            (mode === "preview") ?
              <PreviewList harModels={harModels} errors={errors} /> :
              <TabView tabs={this.createTabs()} selectedTabIdx={selectedTabIdx} id="harView" />
          }
        </InfoTipHolder>
      </AppContext.Provider>
    );
  }
};

App.propTypes = {
  mode: PropTypes.string,
};

export default App;
