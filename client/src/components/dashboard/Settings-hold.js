import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/profile";

const Settings = ({ accounts, deleteAccount }) => {
  if (accounts) {
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
    console.log(accountList);
  }

  return (
    <Fragment>
      <div className="h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-light leading-tight text-gray-900">
              Settings
            </h1>
          </div>
        </header>
        <div>
          <Link to="/edit-profile" className="btn btn-blue">
            Edit Profile
          </Link>
          <Link to="/add-account" className="btn btn-blue">
            Add Account
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

Settings.propTypes = {
  accounts: PropTypes.array.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

export default connect()(Settings);
