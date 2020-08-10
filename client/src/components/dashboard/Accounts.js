import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/profile";

const Accounts = ({ accounts, deleteAccount }) => {
  const accountList = accounts.map((acct) => (
    <tr key={acct._id}>
      <td>{acct.brokerage}</td>
      <td>{acct.nickname}</td>
      <td>
        <button
          onClick={() => deleteAccount(acct._id)}
          className="btn btn-blue"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2>Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Brokerage</th>
            <th>Nickname</th>
            <th />
          </tr>
        </thead>
        <tbody>{accountList}</tbody>
      </table>
    </Fragment>
  );
};

Accounts.propTypes = {
  accounts: PropTypes.array.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

export default connect(null, { deleteAccount })(Accounts);
