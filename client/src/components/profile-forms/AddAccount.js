import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addAccount } from "../../actions/profile";

const AddAccount = ({ addAccount, history }) => {
  const [formData, setFormData] = useState({
    brokerage: "",
    nickname: "",
  });

  const { brokerage, nickname } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  return (
    <Fragment>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              addAccount(formData, history);
            }}
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="brokerage"
                name="brokerage"
                value={brokerage}
                onChange={(e) => onChange(e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="text"
                placeholder="nickname"
                name="nickname"
                value={nickname}
                onChange={(e) => onChange(e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button type="submit" className="btn btn-blue">
              Add Account
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

AddAccount.propTypes = {
  addAccount: PropTypes.func.isRequired,
};

export default connect(null, { addAccount })(AddAccount);
