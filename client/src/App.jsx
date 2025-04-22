import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import User from "./pages/UserF/User";
import Ads from "./pages/AdsF/Ads";
import Admin from "./pages/AdminF/Admin";
import Permissions from "./pages/PermissionsF/Permissions";
import Notification from "./pages/NotificationF/Notification";
import Setting from "./pages/SettingF/Setting";
import Report from "./pages/ReportF/Report";
import Service from "./pages/ServiceF/Service";

function App() {
  return (
    <Router>
      <div className="app">
        <div className="main-layout">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Report />} />
              <Route path="/Report" element={<Report />} />
              <Route path="/AdminAccount" element={<Admin />} />
              <Route path="/Permissions" element={<Permissions />} />
              <Route path="/Service" element={<Service />} />
              <Route path="/User" element={<User />} />
              <Route path="/Notification" element={<Notification />} />
              <Route path="/Setting" element={<Setting />} />
              <Route path="/Ads" element={<Ads />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
