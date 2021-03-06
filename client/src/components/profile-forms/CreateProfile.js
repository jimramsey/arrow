import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {
  const [formData, setFormData] = useState({
    status: "",
  });

  const [displayStatus, toggleStatus] = useState(false);

  const { status } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history);
  };

  return (
    <Fragment>
      <section>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <form className="mt-8" onSubmit={(e) => onSubmit(e)}>
              <button
                className="btn btn-blue"
                type="button"
                onClick={() => toggleStatus(!displayStatus)}
              >
                Show status
              </button>
              {displayStatus && (
                <Fragment>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="status"
                      name="status"
                      value={status}
                      onChange={(e) => onChange(e)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </Fragment>
              )}

              <button type="submit" className="btn btn-blue">
                Save
              </button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
};

export default connect(null, { createProfile })(withRouter(CreateProfile));
