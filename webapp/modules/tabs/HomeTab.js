import React from "react";
import PropTypes from "prop-types";

import Cookies from "../core/cookies";
import Url from "../core/url";
import AppContext from "../AppContext";
import homeHtml from "raw-loader!./homeTab.html";

// TODO Move me
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

function on(e, selector, listener, context) {
  const { target } = e;
  if (target.matches(selector)) {
    listener.call(context || this, e);
  }
}

export class HomeTab extends React.Component {
  onClick = (e) => {
    on(e, ".example", this.onExampleClick);
    on(e, ".linkAbout", this.onAboutClick);
    on(e, "#appendPreview", this.onPreviewClick);
    on(e, "#validate", this.onValidateClick);
  }

  onExampleClick = (e) => {
    e.preventDefault();
    const { target } = e;
    const har = target.getAttribute("har");
    const href = window.location.href;
    const page = href.split("?")[0];
    window.location = page + "?har=" + har;
  }

  onAboutClick = (e) => {
    e.preventDefault();
    this.props.requestTabChange("About");
  }

  onPreviewClick = (e) => {
    const json = $("#sourceEditor").val();
    const { appendPreview } = this.props;
    appendPreview(json);
  }

  onValidateClick = (e) => {
    e.stopPropagation();
    const checked = e.target.checked;
    Cookies.setCookie("validate", checked);
  }

  render() {
    return (
      <div className="homeBody" dangerouslySetInnerHTML={{ __html: homeHtml }} onClick={this.onClick}></div>
    );
  }
};

HomeTab.propTypes = {
  requestTabChange: PropTypes.func,
};

export default (props) => (
  <AppContext.Consumer>
    {({ appendPreview }) => <HomeTab {...props} appendPreview={appendPreview} />}
  </AppContext.Consumer>
);
