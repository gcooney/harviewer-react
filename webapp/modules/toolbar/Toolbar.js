import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export const Button = (props) => {
  return (
    <span
      ref={props.buttonRef}
      title={props.title}
      className="toolbarButton text"
      onClick={props.command}
      >
      {props.children}
    </span>
  );
};

Button.propTypes = {
  buttonRef: PropTypes.string,
  children: PropTypes.node,
  command: PropTypes.func,
  title: PropTypes.string,
};

export default createReactClass({
  displayName: "",

  propTypes: {
    children: PropTypes.array,
  },

  createToolbarButton(title, text) {
    const props = { title, text };
    return <Button {...props} />;
  },
  createToolbarItems(children) {
    const style = { color: "gray" };
    return children.reduce((items, child, i) => {
      if (items.length > 0) {
        const span = <span key={"toolbarSeparator" + i} style={style} className="toolbarSeparator ">|</span>;
        items.push(span);
      }
      items.push(child);
      return items;
    }, []);
  },

  render() {
    return (
      <div className="toolbar ">
        {this.createToolbarItems(this.props.children || [])}
      </div>
    );
  }
});
