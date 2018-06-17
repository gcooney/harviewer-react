import React from "react";
import PropTypes from "prop-types";

class ValidationError extends React.Component {
  render() {
    const { error } = this.props;
    if (!error || !error.errors || !error.errors.length) {
      return null;
    }
    return (
      <table cellPadding="3" cellSpacing="0" className="errorTable">
        <tbody>
          {
            error.errors.map((error, i) => (
              <tr className="errorRow" key={i}>
                <td className="errorProperty"><span>{error.property}</span></td>
                <td className="errorOptions"><div className="errorOptionsTarget">&nbsp;</div></td>
                <td>&nbsp;</td>
                <td className="errorMessage"><span>{error.message}</span></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}

ValidationError.propTypes = {
  error: PropTypes.object,
};

export default ValidationError;
