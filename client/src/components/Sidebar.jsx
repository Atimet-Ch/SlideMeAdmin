// import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="nav-links">
        <li>
          <NavLink to="/Report" className="nav-link">
            <button>Report</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminAccount" className="nav-link">
            <button>Admin Account</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Permissions" className="nav-link">
            <button>Permissions</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Service" className="nav-link">
            <button>Service</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/User" className="nav-link">
            <button>User</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Notification" className="nav-link">
            <button>Notification</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Setting" className="nav-link">
            <button>Setting</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Ads" className="nav-link">
            <button>Ads</button>
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <p>© 2025 SlideMe</p>
      </div>
    </div>
  );
}
export default Sidebar;
