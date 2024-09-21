import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import DashboardComp from "../components/DashboardComp";
import DashComments from "../components/DashComments";
import DashPosts from "../components/DashPosts";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashUsers from "../components/DashUsers";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('dashboard'); // Default tab set to 'dashboard'

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>

      <div className="flex-1 p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Link
            to="?tab=dashboard"
            className={`text-lg font-semibold ${tab === 'dashboard' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            Dashboard
          </Link>
          <Link
            to="?tab=profile"
            className={`text-lg font-semibold ${tab === 'profile' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            Profile
          </Link>
          <Link
            to="?tab=posts"
            className={`text-lg font-semibold ${tab === 'posts' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            Posts
          </Link>
          <Link
            to="?tab=users"
            className={`text-lg font-semibold ${tab === 'users' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            Users
          </Link>
          <Link
            to="?tab=comments"
            className={`text-lg font-semibold ${tab === 'comments' ? 'text-teal-500' : 'text-gray-500'}`}
          >
            Comments
          </Link>
        </div>

        {/* Render components based on selected tab */}
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
        {tab === 'users' && <DashUsers />}
        {tab === 'comments' && <DashComments />}
        {tab === 'dashboard' && <DashboardComp />}
      </div>
    </div>
  );
}
