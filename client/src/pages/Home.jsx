import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/post/getposts");
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch posts");
        setPosts(data.posts);
      } catch (err) {
        console.error(err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl font-bold text-gray-700 dark:text-yellow-300">
          Welcome To My Blog
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Explore the dynamic world of technology with me. From insightful
          articles on web development to in-depth tutorials on software
          engineering, my blog is your gateway to discovering the latest trends
          and tools in the realm of programming languages and tech stacks.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {loading && <p className="text-center">Loading posts...</p>}
        {error && <p className="text-center text-red-500">Error loading posts.</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-500">No posts available.</p>
        )}
        {posts.length > 0 && (
          <div className="flex flex-col gap-6 w-full">
            <h2 className="text-2xl font-bold text-center">Recent Posts</h2>
            <div className="flex flex-wrap justify-center items-center gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
