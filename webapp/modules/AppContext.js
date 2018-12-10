import React, { Component } from "react";
import PropTypes from "prop-types";
import Url from "./core/url";

import Cookies from "./core/cookies";

const DEFAULT_STATE = {
  validate: true,
  expandAll: true,
  previewCols: [],
};

const AppContext = React.createContext(DEFAULT_STATE);

export default AppContext;

export const AppContextConsumer = AppContext.Consumer;

export class AppContextProvider extends Component {
  state = DEFAULT_STATE;

  getDefaultVisibleNetCols() {
    const cols = Cookies.getCookie("previewCols");
    if (cols) {
      // Columns names are separated by a space so, make sure to properly process
      // spaces in the cookie value.
      return unescape(cols.replace(/\+/g, " "))
        .split(" ");
    }
    const defaultVisibleNetCols = [
      "url",
      "status",
      "size",
      "uncompressedSize",
      "timeline",
    ];
    return defaultVisibleNetCols;
  }

  componentDidMount() {
    const expandAll = Url.getURLParameter("expand", window.location.href) === "true";
    const validate = Cookies.getCookie("validate") !== "false";
    const newState = {
      validate,
      expandAll,
      previewCols: this.getDefaultVisibleNetCols(),
    };
    this.setState(newState);
  }

  appendPreview(harObjectOrString) {
  }

  setPreviewCols = (cols, avoidCookies) => {
    if (!cols) {
      cols = this.getDefaultVisibleNetCols();
    }

    // If the parameter is an array, convert it to string.
    if (!Array.isArray(cols)) {
      cols = cols.split(/\s+/);
    }

    // Update cookie
    if (!avoidCookies) {
      Cookies.setCookie("previewCols", cols.join(" "));
    }

    this.setState({
      previewCols: cols,
    });
  }

  setValidate = (validate) => {
    Cookies.setCookie("validate", validate);
    this.setState({ validate });
  }

  render() {
    const { state, setValidate, setPreviewCols } = this;
    return (
      <AppContext.Provider value={{
        ...state,
        setValidate,
        setPreviewCols,
      }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

AppContextProvider.propTypes = {
  children: PropTypes.node,
};
