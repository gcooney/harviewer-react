import React from "react";

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      harModels: [],
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
    const { harModels } = this.state;

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
        body: <PreviewTab harModels={harModels} />,
      },
      {
        id: "DOM",
        label: domTabStrings.domTabLabel,
      },
      this.createAboutTab(harViewerExampleApp),
      {
        id: "Schema",
        label: harViewerStrings.schemaTabLabel,
      }
    ];

    return tabs;
  }

  updatePreviewCols() {
    const content = document.getElementById("content");
    content.setAttribute("previewCols", this.state.previewCols);
  }

  appendPreview = (harObjectOrString) => {
    const { harModels } = this.state;
    const model = new HarModel();
    const har = (typeof harObjectOrString === "string") ? JSON.parse(harObjectOrString) : harObjectOrString;
    model.append(har);
    setState(this, {
      harModels: harModels.concat([model]),
      selectedTabIdx: 1,
    });
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
    console.log(prevProps, prevState);
    this.updatePreviewCols();
  }

  render() {
    const { selectedTabIdx } = this.state;

    const tabs = this.createTabs();
    return (
      <AppContext.Provider value={this.state}>
        <InfoTipHolder>
          <TabView tabs={tabs} selectedTabIdx={selectedTabIdx} id="harView" />
        </InfoTipHolder>
      </AppContext.Provider>
    );
  }
};
