import React from "react";
import PropTypes from "prop-types";

import Representations from "./TreeRepresentations";
import * as Css from "../core/css";
import * as Dom from "../core/dom";
import * as Events from "../core/events";

export function createUINode(type, name, value, hasChildren, level) {
  const representation = Representations.getRep(value);

  return {
    name,
    value,
    type,
    rowClass: "memberRow-" + type,
    open: false,
    level,
    indent: level * 16,
    hasChildren,
    children: null,
    representation,
  };
};

class Tree extends React.Component {
  constructor(props) {
    super(props);

    const { root } = this.props;
    const uiTree = this.getUITree("ROOT", root);

    this.state = {
      uiTree,
    };
  }

  componentDidMount() {
    this.toggleNode("0");
  }

  getUITree(name, object, level) {
    if (!level) {
      level = 0;
    }

    const { hasChildren, populateChildren } = this.props;
    const uiNode = createUINode("dom", name, object, hasChildren(object), level);
    populateChildren(uiNode, level + 1);

    return uiNode;
  }

  toggleNode(key) {
    const { uiTree } = this.state;

    const parts = key.split(".");
    const uiNode = parts.reduce((uiNode, part) => {
      const { children } = uiNode;
      return children[part];
    }, uiTree);

    if (!uiNode.open) {
      const { populateChildren } = this.props;
      populateChildren(uiNode, uiNode.level + 1);
      uiNode.open = true;
    } else {
      uiNode.children = [];
      uiNode.open = false;
    }

    this.setState(Object.assign({}, uiTree));
  }

  onClick = (e) => {
    if (!Events.isLeftClick(e)) {
      return;
    }

    const row = Dom.getAncestorByClass(e.target, "memberRow");
    const label = Dom.getAncestorByClass(e.target, "memberLabel");
    if (label && Css.hasClass(row, "hasChildren")) {
      this.toggleNode(row.dataset.key);
    }
  }

  renderRows(uiNode, runningKey, rows) {
    const makeKey = (i) => {
      if (runningKey) {
        return runningKey + "." + i;
      }
      return String(i);
    };
    runningKey = runningKey || "";
    rows = rows || [];

    const { hasChildren } = this.props;

    // console.log("renderRows", uiNode, runningKey, rows);
    (uiNode.children || []).forEach((child, i) => {
      const { level } = child;
      const hasChildrenClass = hasChildren(child.value) ? "hasChildren" : "";
      const openClass = child.open ? "opened" : "";
      const key = makeKey(i);
      // console.log(key);
      const row = (
        <tr key={key} data-key={key} level={level} className={`memberRow ${child.type}Row ${hasChildrenClass} ${openClass}`}>
          <td style={{ paddingLeft: `${child.indent}px` }} className="memberLabelCell">
            <span className={`memberLabel ${child.type}Label`}>{child.name}</span></td>
          <td className="memberValueCell"><child.representation type={child.type} value={child.value} /></td>
        </tr>
      );
      rows.push(row);
      if (hasChildren && child.open) {
        this.renderRows(child, key, rows);
      }
    });
    return rows;
  }

  render() {
    const { uiTree } = this.state;
    return (
      <table cellPadding="0" cellSpacing="0" className="domTable" onClick={this.onClick}>
        <tbody>
          {this.renderRows(uiTree)}
        </tbody>
      </table>
    );
  }
};

Tree.propTypes = {
  root: PropTypes.object,
  hasChildren: PropTypes.func,
  populateChildren: PropTypes.func,
};

export default Tree;
