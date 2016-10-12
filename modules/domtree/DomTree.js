import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

function paddingLeft(padding) {
  return {
    paddingLeft: padding + "px"
  };
}

const ObjectBox = (props) => {
  const trClassName = [
    "memberRow",
    "domRow",
    props.hasChildren ? "hasChildren" : "",
    props.opened ? " opened" : ""
  ].join(" ");
  const objectBoxClassName = "objectBox objectBox-" + props.type;
  return (
    <tr level={props.level} className={trClassName}>
      <td style={paddingLeft(props.level * 16)} className="memberLabelCell">
        <span className="memberLabel domLabel">{props.objectKey}</span>
      </td>
      <td className="memberValueCell">
        <div className={objectBoxClassName}>{props.getDisplayString(props.objectValue)}</div>
      </td>
    </tr>
  );
};
ObjectBox.propTypes = {
  hasChildren: PropTypes.bool,
  opened: PropTypes.bool,
  level: PropTypes.number,
  objectKey: PropTypes.string,
  objectValue: PropTypes.object,
  type: PropTypes.string,
  getDisplayString: PropTypes.func.isRequired,
};

const ObjectBoxString = (props) => {
  const props2 = Object.assign({}, {
    type: "string",
    getDisplayString: value => value
  }, props);
  return <ObjectBox { ...props2 } />;
};
ObjectBoxString.propTypes = {};

const ObjectBoxObject = (props) => {
  const props2 = Object.assign({}, {
    type: "object",
    getDisplayString: value => "Object",
    hasChildren: Object.keys(props.objectValue[props.objectKey]).length > 0
  }, props);
  return <ObjectBox { ...props2 } />;
};
ObjectBoxObject.propTypes = {
  objectKey: PropTypes.string,
  objectValue: PropTypes.object,
};

const ObjectBoxArray = (props) => {
  const props2 = Object.assign({}, {
    type: "array",
    getDisplayString: value => `Array[$value.length]`,
    hasChildren: props.objectValue[props.objectKey].length > 0
  }, props);
  return <ObjectBox { ...props2 } />;
};
ObjectBoxArray.propTypes = {
  objectKey: PropTypes.string,
  objectValue: PropTypes.object,
};

export default createReactClass({
  displayName: "DomTree",

  propTypes: {
    model: PropTypes.object,
  },

  render() {
    const { model } = this.props;
    const har = model.input;
    return (
      <table cellPadding="0" cellSpacing="0" className="domTable">
        <tbody>
          <ObjectBoxObject level={0} objectKey="log" objectValue={har} />
        </tbody>
      </table>
    );
  }
});
