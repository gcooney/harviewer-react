import React from "react";
import PropTypes from "prop-types";

import * as Url from "./core/url";
import HarModel from "./preview/harModel";
import Loader from "./preview/harModelLoader";

import homeTabStrings from "amdi18n-loader!./nls/homeTab";
import harViewerStrings from "amdi18n-loader!./nls/harViewer";
import previewTabStrings from "amdi18n-loader!./nls/previewTab";
import domTabStrings from "amdi18n-loader!./nls/domTab";

import deferred from "./deferred";
import AppContext from "./AppContext";
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

    this._onPreInitDeferred = deferred();
    this.onPreInit = this._onPreInitDeferred.promise;
    this._onInitDeferred = deferred();
    this.onInit = this._onInitDeferred.promise;

    this.state = {
      harModels: [],
      errors: [],
      selectedTabIdx: 0,
      appendPreview: this.appendPreview,
      tabs: ["Home", "Preview", "DOM", "About", "Schema"],
      showTabBar: true,
    };
  }

  componentDidMount() {
    const { container } = this.props;
    container.repObject = this;

    this._onPreInitDeferred.resolve(this);
    this._onInitDeferred.resolve(this);

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

  createAboutTab() {
    const versionStr = buildInfo.version + "/" + buildInfo.gitVersion;

    let harViewerDemoUrl = window.location.href.split("?")[0];
    if (!harViewerDemoUrl.endsWith("/")) {
      harViewerDemoUrl += "/";
    }

    const aboutTab = {
      id: "About",
      label: harViewerStrings.aboutTabLabel,
      body: <AboutTab version={versionStr} harViewerDemoUrl={harViewerDemoUrl} />,
    };

    aboutTab.content = (
      <div>{aboutTab.label || aboutTab.id}
        <span className="version"> {versionStr}</span>
      </div>
    );

    return aboutTab;
  }

  createTabs() {
    const { harModels, errors, tabs } = this.state;

    const tabInfo = [
      {
        id: "Home",
        label: homeTabStrings.homeTabLabel,
        body: <HomeTab requestTabChange={this.setSelectedTab} appendPreview={this.appendPreview} />,
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
      this.createAboutTab(),
      {
        id: "Schema",
        label: harViewerStrings.schemaTabLabel,
        body: <SchemaTab />,
      },
    ];

    this.tabs = tabInfo.filter((info) => tabs.includes(info.id));

    return this.tabs;
  }

  updatePreviewCols() {
    const { container } = this.props;
    container.setAttribute("previewCols", (this.context.previewCols || []).join(" "));
  }

  setPreviewColumns(cols, avoidCookies) {
    this.context.setPreviewCols(cols, avoidCookies);
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
    return Loader.loadArchives(hars, harps, callbackName, function(jsonString, ...rest) {
      self.appendPreview(jsonString);
      if (callback) {
        callback.apply(this, jsonString, ...rest);
      }
    }, errorCallback, doneCallback);
  }

  isPreviewMode() {
    const { mode } = this.props;
    return (mode === "preview");
  }

  appendPreview = (harObjectOrString) => {
    // TODO - get validate from checkbox/cookie value
    const { harModels, errors } = this.state;

    // TODO - don't go poking in the URL. Get the loader to pass back whether we should validate based on URL.
    let { validate } = this.context;

    if (this.isPreviewMode()) {
      if (Url.getURLParameter("validate") === "false") {
        validate = false;
      }
    }

    try {
      const model = new HarModel();
      const har = HarModel.parse(harObjectOrString, validate);
      model.append(har);
      this.setState({
        harModels: harModels.concat([model]),
        selectedTabIdx: PREVIEW_TAB_INDEX,
      });
    } catch (err) {
      const { errors: newErrors } = err;
      this.setState({
        errors: errors.concat(newErrors),
        selectedTabIdx: PREVIEW_TAB_INDEX,
      });
    }
  }

  appendError = (err) => {
    const { errors } = this.state;
    this.setState({
      errors: errors.concat(err),
      selectedTabIdx: PREVIEW_TAB_INDEX,
    });
  }

  getTab(name) {
    return this.tabView.current.getTab(name);
  }

  setSelectedTab = (selectedTabIdx) => {
    if (typeof selectedTabIdx === "string") {
      selectedTabIdx = this.tabs.findIndex(({ id }) => id === selectedTabIdx);
    }
    this.setState({ selectedTabIdx });
  }

  removeTab(name) {
    this.setState(({ tabs }) => ({
      tabs: tabs.filter((n) => n !== name),
    }));
  }

  showTabBar(showTabBar) {
    this.setState({
      showTabBar,
    });
  }

  render() {
    const { selectedTabIdx, harModels, errors, showTabBar } = this.state;

    return (
      <InfoTipHolder>
        {
          (this.isPreviewMode())
            ? <PreviewList harModels={harModels} errors={errors} />
            : <TabView
              id="harView"
              ref={this.tabView}
              tabs={this.createTabs()}
              selectedTabIdx={selectedTabIdx}
              showTabBar={showTabBar}
              onSelectedTabChange={this.setSelectedTab}
            />
        }
      </InfoTipHolder>
    );
  }
};

App.propTypes = {
  container: PropTypes.instanceOf(HTMLElement),
  mode: PropTypes.string,
};

App.contextType = AppContext;

export default App;
