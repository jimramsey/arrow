import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { getTotals } from "../../actions/trade";
// import { getCurrentProfile } from "../../actions/profile";

const Navbar = ({ auth: { user, isAuthenticated, loading }, logout }) => {
  const currentLocation = useLocation();
  const authLinks = (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 hidden"
                  src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg"
                  alt="Workflow logo"
                />
                <i className="far fa-arrow-alt-circle-up h-8 w-8 text-4xl text-blue-500"></i>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline">
                  <Link
                    to="/dashboard"
                    className={`nav-item focus:outline-none focus:text-white ${
                      currentLocation.pathname === "/dashboard"
                        ? "nav-item-on"
                        : ""
                    }`}
                  >
                    Dashboard{" "}
                  </Link>
                  <Link
                    to="/trades"
                    className={`nav-item focus:outline-none focus:text-white ${
                      currentLocation.pathname === "/trades"
                        ? "nav-item-on"
                        : ""
                    }`}
                  >
                    Trades
                  </Link>
                  <Link
                    to="/add-trade"
                    className="ml-4 bg-blue-500 hover:bg-blue-700 text-white text-xs font-medium py-1 px-4 rounded-full"
                  >
                    <i className="fas fa-plus mr-1"></i> Add Trade
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex md:ml-6 items-baseline">
                <div className="ml-3 relative">
                  <div>
                    <span className="text-left px-2 py-2 text-sm text-white">
                      <i className="fas fa-user pr-1"></i>{" "}
                      {user ? user.name : ""}
                    </span>{" "}
                    |
                    <Link
                      to="/settings"
                      className="text-left px-2 py-2 text-sm text-blue-500 hover:underline"
                    >
                      Settings
                    </Link>{" "}
                    |
                    <button
                      onClick={logout}
                      className="text-left px-2 py-2 text-sm text-blue-500 hover:cursor-pointer hover:underline"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );

  const guestLinks = (
    <div className="hidden">
      <Link to="/register">Register</Link>
      <br />
      <Link to="/login">Login</Link>
    </div>
  );
  return (
    <div>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
