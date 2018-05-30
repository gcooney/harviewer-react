import React from "react";
import PropTypes from "prop-types";
import * as Str from "core/string";

function getPageTitle(page) {
  return Str.cropString(page.title, 100);
}

const PageRow = (props) => {
  return (
    <tr className={"pageRow" + (props.opened ? " opened" : "")} onClick={props.onClick}>
      <td width="1%" className="groupName pageCol "><span className="pageName ">{getPageTitle(props.page)}</span></td>
      <td width="15px" className="netOptionsCol netCol "><div className="netOptionsLabel netLabel "></div></td>
    </tr>
  );
};

PageRow.propTypes = {
  onClick: PropTypes.func,
  opened: PropTypes.bool,
  page: PropTypes.object,
};

export default PageRow;
