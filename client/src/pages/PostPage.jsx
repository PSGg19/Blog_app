import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok || !data.posts || data.posts.length === 0) {
          throw new Error("Post not found");
        }

        setPost(data.posts[0]);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setRecentLoading(true);
      try {
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();

        if (res.ok && data.posts) {
          // Exclude the current post if present
          const filtered = data.posts.filter((p) => p.slug !== postSlug);
          setRecentPosts(filtered);
        }
      } catch (error) {
        console.log("Failed to load recent posts:", error);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchRecentPosts();
  }, [postSlug]);

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
        <p className="text-red-500 text-lg">
          ⚠️ Failed to fetch post. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl m-10 font-serif max-w-2xl lg:text-4xl capitalize mx-auto">
        {post.title || "Untitled Post"}
      </h1>

      <Link
        className="self-center mt-5"
        to={`/search?category=${post.category}`}
      >
        <Button pill color="gray" size="xs">
          {post.category}
        </Button>
      </Link>

      <img
        src={post.image || "https://via.placeholder.com/800x400?text=No+Image"}
        alt={post.title}
        className="mt-12 p-3 max-h-[600px] w-full object-cover"
      />

      <div className="p-3 flex justify-between border-b-2 border-slate-500 w-full max-w-2xl mx-auto text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{Math.max((post.content.length / 1000).toFixed(0), 1)} mins read</span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="max-w-4xl mx-auto w-full mt-8">
        <CallToAction />
      </div>

      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5 mt-10">
        <h1 className="text-2xl capitalize font-bold text-gray-500">
          recent articles
        </h1>

        {recentLoading ? (
          <div className="p-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {recentPosts.length > 0 ? (
              recentPosts.map((recent) => (
                <PostCard key={recent._id} post={recent} />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic mt-4">
                No recent posts available.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
