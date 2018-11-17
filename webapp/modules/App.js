import React from "react";
import PropTypes from "prop-types";

import * as Events from "./core/events";
import * as Url from "./core/url";
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
import DOMTab from "./tabs/dom/DOMTab";
import PreviewList from "./tabs/preview/PreviewList";
import SchemaTab from "./tabs/SchemaTab";

const PREVIEW_TAB_INDEX = 1;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.tabView = React.createRef();

    this.state = {
      harModels: [],
      errors: [],
      previewCols: "url status size timeline",
      selectedTabIdx: 0,
      appendPreview: this.appendPreview,
      validate: true,
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
        body: <DOMTab />,
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
    const { container } = this.props;
    container.setAttribute("previewCols", this.state.previewCols);
  }

  loadHar(url, settings) {
    settings = settings || {};
    return Loader.load(this, url,
      settings.jsonp,
      settings.jsonpCallback,
      settings.success,
      settings.ajaxError);
  }

  loadArchives(hars, harps, callbackName, callback, errorCallback, doneCallback) {
    const self = this;
    return Loader.loadArchives(hars, harps, callbackName, function(jsonString) {
      self.appendPreview(jsonString);
      if (callback) {
        callback.apply(this, arguments);
      }
    }, errorCallback, doneCallback);
  }

  appendPreview = (harObjectOrString) => {
    // TODO - get validate from checkbox/cookie value
    const { harModels, errors } = this.state;

    // TODO - don't go poking in the URL. Get the loader to pass back whether we should validate based on URL.
    let { validate } = this.state;
    const { mode } = this.props;
    const isPreview = (mode === "preview");
    if (isPreview) {
      if (Url.getURLParameter("validate") === "false") {
        validate = false;
      }
    }

    try {
      const model = new HarModel();
      const har = HarModel.parse(harObjectOrString, validate);
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

  appendError = (err) => {
    const { errors } = this.state;
    setState(this, {
      errors: errors.concat(err),
      selectedTabIdx: PREVIEW_TAB_INDEX,
    });
  }

  componentDidMount() {
    const { container } = this.props;
    container.repObject = this;
    Events.fireEvent(container, "onViewerPreInit");
    Events.fireEvent(container, "onViewerInit");

    this.updatePreviewCols();

    Loader.run(this.appendPreview, (jqXHR, textStatus, errorThrown) => this.appendError({
      property: jqXHR.statusText,
      message: jqXHR.url,
    }));
  }

  componentWillUnmount() {
    const { container } = this.props;
    container.repObject = null;
  }

  componentDidUpdate(prevProps, prevState) {
    this.updatePreviewCols();
  }

  getTab(name) {
    return this.tabView.current.getTab(name);
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
              <TabView ref={this.tabView} tabs={this.createTabs()} selectedTabIdx={selectedTabIdx} id="harView" />
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
