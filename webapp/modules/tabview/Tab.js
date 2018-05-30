import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default createReactClass({
  displayName: "tabview/Tab",

  propTypes: {
    content: PropTypes.node,
    id: PropTypes.string,
    label: PropTypes.string,
    onSelect: PropTypes.func,
    selected: PropTypes.bool,
    title: PropTypes.string,
  },

  updateSelected() {
    const { id, selected } = this.props;
    this.refs.dom.setAttribute("selected", selected);
    this.refs.dom.setAttribute("view", id);
  },

  componentDidMount() {
    this.updateSelected();
  },

  componentDidUpdate() {
    this.updateSelected();
  },

  render() {
    const { title, id, label, content, onSelect } = this.props;
    return (
      <a data-id={id} title={title || id} className={id + "Tab tab"} onClick={onSelect} ref="dom">
        {content || label || id}
      </a>
    );
  },
});
