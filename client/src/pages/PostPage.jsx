import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch post");
        setPost(data.posts[0]);
        setError(false);
      } catch (error) {
        console.error(error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.error("Failed to fetch recent posts", error);
      }
    };
    fetchRecentPosts();
  }, []);

  const calculateReadingTime = (text) => {
    const words = text?.split(" ").length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error fetching post data</p>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl m-10 font-serif max-w-2xl lg:text-4xl capitalize mx-auto">
        {post.title}
      </h1>
      <Link to={`/search?category=${post.category}`} className="self-center mt-5">
        <Button pill color="gray" size="xs">
          {post.category}
        </Button>
      </Link>

      <img
        src={post.image}
        alt={post.title || "post image"}
        className="mt-12 p-3 max-h-[600px] w-full object-cover"
      />

      <div className="p-3 flex justify-between border-b-2 border-slate-500 w-full max-w-2xl mx-auto text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{calculateReadingTime(post.content)} mins read</span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="max-w-4xl mx-auto w-full mt-10">
        <CallToAction />
      </div>

      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-2xl mt-5 capitalize font-bold text-gray-500">
          Recent Articles
        </h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
