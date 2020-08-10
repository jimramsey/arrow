import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div>
      <Link to="/edit-profile" className="btn btn-blue">
        Edit Profile
      </Link>
      <Link to="/add-account" className="btn btn-blue">
        Add Account
      </Link>
    </div>
  );
};

export default DashboardActions;
