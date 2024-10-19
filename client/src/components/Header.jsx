import React, { useState, useEffect } from "react";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice"; // Redux action to toggle theme

export default function Header() {
  // Access current user data from Redux store
  const { currentUser } = useSelector((state) => state.user);
  // Get the current pathname and location
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch(); // Dispatch Redux actions
  const { theme } = useSelector((state) => state.theme); // Get current theme from Redux store
  const [searchTerm, setSearchTerm] = useState(""); // State to handle search term
  const navigate = useNavigate(); // Navigate to different routes

  // Update search term from URL query parameter when the location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm); // Set the search term in the URL
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`); // Navigate to the search results page with the updated query
  };

  return (
    <Navbar className="border-b-2">
      {/* Logo and Branding */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text:sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Prahlad's
        </span>
        Blogs
      </Link>

      {/* Search Form (visible on larger screens) */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={IoIosSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state on input change
        />
        {/* Mobile Search Button */}
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <IoIosSearch />
        </Button>
      </form>

      <div className="flex gap-2 md:order-2">
        {/* Theme Toggle Button */}
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())} // Dispatch theme toggle action
        >
          {theme === "light" ? <FaMoon /> : <FaSun />} {/* Display sun/moon icon based on current theme */}
        </Button>

        {/* User Authentication and Profile Dropdown */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
              {/* Link to the user's profile page */}
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Divider />
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              {/* Link to sign-out */}
              <Link to={"/sign-in"}>
                <Dropdown.Item>SignOut</Dropdown.Item>
              </Link>
            </Dropdown.Header>
          </Dropdown>
        ) : (
          {/* Display Sign-In Button if user is not logged in */}
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToPink" outline>
              Sign in
            </Button>
          </Link>
        )}
        {/* Navbar Toggle (for mobile view) */}
        <Navbar.Toggle />
      </div>

      {/* Navbar Collapse for navigation links */}
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
