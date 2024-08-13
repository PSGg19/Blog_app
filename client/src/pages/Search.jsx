import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "none",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      const searchTerm = e.target.value;
      setSidebarData({ ...sidebarData, searchTerm });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
    }
    setShowMore(false);
    // if (posts.length === 9) {
    //   setShowMore(true);
    // } else {
    //   setShowMore(false);
    // }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              SearchTerm:
            </label>
            <TextInput
              placeholder="search...."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label>Category</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="react">React Js</option>
              <option value="uncategorized">uncategorized</option>
              <option value="javascript">Javascript</option>
              <option value="webdev">WebDev</option>
              <option value="python">Python</option>
              <option value="none">none</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results:
        </h1>
        <div className="flex flex-wrap p-3 gap-4 items-center justify-evenly">
          {!loading && posts.length === 0 && <p cl>No Posts Found!</p>}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="text-teal-500 text-lg hover:underline p-7 w-full "
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
