import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import DashboardComp from "../components/DashboardComp";
import DashComments from "../components/DashComments";
import DashPosts from "../components/DashPosts";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashUsers from "../components/DashUsers";

export default function Dashboard() {
  const location = useLocation();
  
  // Get the 'tab' parameter from URL search params
  const tabFromUrl = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("tab") || 'dashboard'; // Default to 'dashboard' if no tab is specified
  }, [location.search]);

  const [tab, setTab] = useState(tabFromUrl);

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  const tabLinks = [
    { name: "Dashboard", value: "dashboard" },
    { name: "Profile", value: "profile" },
    { name: "Posts", value: "posts" },
    { name: "Users", value: "users" },
    { name: "Comments", value: "comments" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>

      <div className="flex-1 p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {tabLinks.map(({ name, value }) => (
            <Link
              key={value}
              to={`?tab=${value}`}
              className={`text-lg font-semibold ${tab === value ? 'text-teal-500' : 'text-gray-500'}`}
              aria-selected={tab === value ? "true" : "false"}
            >
              {name}
            </Link>
          ))}
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
