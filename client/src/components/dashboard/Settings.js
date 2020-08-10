import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Accounts from "./Accounts";
import { getCurrentProfile, deleteUser } from "../../actions/profile";

const Settings = ({
  getCurrentProfile,
  deleteUser,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-light leading-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                {profile !== null ? (
                  <Fragment>
                    <DashboardActions />
                    <Accounts accounts={profile.accounts} />
                    <div>
                      <button
                        className="btn btn-blue"
                        onClick={() => deleteUser()}
                      >
                        Permanently delete your ArrowTracker account
                      </button>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <p>You have not yet created a profile.</p>
                    <Link to="/create-profile" className="btn btn-blue">
                      Create Profile
                    </Link>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
};

Settings.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteUser })(
  Settings
);
