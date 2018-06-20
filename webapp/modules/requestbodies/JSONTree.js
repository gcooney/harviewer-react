import React from "react";
import PropTypes from "prop-types";

import Tree, { createUINode } from "./Tree";
import { canDecode, decode } from "./decoder";
import * as Mime from "../core/mime";

function hasProperties(ob) {
  if (typeof ob === "string") {
    return false;
  }
  try {
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line guard-for-in
    for (let name in ob) {
      return true;
    }
  } catch (e) {
  }
  return false;
}

function hasChildren(value) {
  return hasProperties(value) && (typeof value === "object");
}

function populateChildren(uiNode, level) {
  const object = uiNode.value;
  const children = uiNode.children = [];
  for (let p in object) {
    if (object.hasOwnProperty(p)) {
      const propObj = object[p];
      if (typeof propObj !== "function") {
        const child = createUINode("dom", p, propObj, hasChildren(propObj), level);
        children.push(child);
      }
    }
  }
}

function getRoot(entry) {
  const { content } = entry.response;
  const jsonStr = decode(content.text, content.encoding);
  return JSON.parse(jsonStr);
}

class JSONTree extends React.Component {
  render() {
    const { entry } = this.props;
    const root = getRoot(entry);
    return <Tree root={root} hasChildren={hasChildren} populateChildren={populateChildren} />;
  }
};

JSONTree.propTypes = {
  entry: PropTypes.object,
};

JSONTree.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  const mimeType = Mime.extractMimeType(content.mimeType || "");
  return ["application/json"].indexOf(mimeType) > -1;
};

export default JSONTree;
