import React, { Component } from "react";
import PropTypes from "prop-types";

import Cookies from "./core/cookies";

const DEFAULT_STATE = {
  validate: true,
};

const AppContext = React.createContext(DEFAULT_STATE);

export default AppContext;

export const AppContextConsumer = AppContext.Consumer;

export class AppContextProvider extends Component {
  state = DEFAULT_STATE;

  componentDidMount() {
    this.setState({
      validate: Cookies.getCookie("validate") !== "false",
    });
  }

  appendPreview(harObjectOrString) {

  }

  setValidate = (validate) => {
    Cookies.setCookie("validate", validate);
    this.setState({ validate });
  }

  render() {
    const { state, setValidate } = this;
    return (
      <AppContext.Provider value={{
        ...state,
        setValidate,
      }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

AppContextProvider.propTypes = {
  children: PropTypes.node,
};
