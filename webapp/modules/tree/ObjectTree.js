import React from "react";
import PropTypes from "prop-types";

import Tree, { createUINode } from "./Tree";

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

export function hasChildren(value) {
  return hasProperties(value) && (typeof value === "object");
}

export function populateChildren(uiNode, level) {
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

class ObjectTree extends React.Component {
  render() {
    const { root } = this.props;
    return <Tree root={root} hasChildren={hasChildren} populateChildren={populateChildren} />;
  }
};

ObjectTree.propTypes = {
  root: PropTypes.object,
};

export default ObjectTree;
