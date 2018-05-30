import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import NetTable from "../nettable/NetTable";

const PageInfoRow = createReactClass({
  displayName: "pagetable/PageInfoRow",

  propTypes: {
    model: PropTypes.object,
    page: PropTypes.object,
  },

  shouldComponentUpdate(nextProps, nextState) {
    const { model, page } = this.props;
    console.log(!(model === nextProps.model && page === nextProps.page));
    return !(model === nextProps.model && page === nextProps.page);
  },

  render() {
    const { model, page } = this.props;
    return (
      <tr className="pageInfoRow">
        <td colSpan="2" className="pageInfoCol">
          <NetTable model={model} page={page} />
        </td>
      </tr>
    );
  },
});

export default PageInfoRow;
