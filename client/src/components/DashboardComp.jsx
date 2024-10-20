import React, { useState, useEffect } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  // Getting current user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State declarations
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  // Fetching data only if current user is an admin
  useEffect(() => {
    if (!currentUser.isAdmin) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.oneMonthUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPost);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };

    fetchUsers();
    fetchComments();
    fetchPosts();
  }, [currentUser]);

  return (
    <div className="p-3 mx-auto">
      {/* Top stats cards section */}
      <div className="flex-wrap flex gap-5 justify-center">
        {/* Total Users Card */}
        <StatsCard
          title="Total Users"
          total={totalUsers}
          lastMonth={lastMonthUsers}
          icon={<HiOutlineUserGroup className="bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg" />}
        />

        {/* Total Comments Card */}
        <StatsCard
          title="Total Comments"
          total={totalComments}
          lastMonth={lastMonthComments}
          icon={<HiAnnotation className="bg-indigo-500 text-white rounded-full text-5xl p-3 shadow-lg" />}
        />

        {/* Total Posts Card */}
        <StatsCard
          title="Total Posts"
          total={totalPosts}
          lastMonth={lastMonthPosts}
          icon={<HiDocumentText className="bg-lime-500 text-white rounded-full text-5xl p-3 shadow-lg" />}
        />
      </div>

      {/* Recent Lists: Users, Comments, Posts */}
      <div className="flex flex-wrap gap-5 mx-auto justify-center py-3">
        <RecentTable
          title="Recent Users"
          link="/dashboard?tab=users"
          headers={["User image", "Username"]}
          rows={users.map((user) => [
            <img
              src={user.profilePicture}
              alt="user"
              className="w-10 h-10 rounded-full bg-gray-500"
            />,
            user.username,
          ])}
        />

        <RecentTable
          title="Recent Comments"
          link="/dashboard?tab=comments"
          headers={["Comment content", "Likes"]}
          rows={comments.map((comment) => [
            <p className="line-clamp-2">{comment.content}</p>,
            comment.numberOfLikes,
          ])}
        />

        <RecentTable
          title="Recent Posts"
          link="/dashboard?tab=posts"
          headers={["Post Image", "Post Title", "Category"]}
          rows={posts.map((post) => [
            <img
              src={post.image}
              alt="post"
              className="w-14 h-10 rounded-md bg-gray-500"
            />,
            post.title,
            post.category,
          ])}
        />
      </div>
    </div>
  );
}

// ✅ Reusable Stats Card Component
const StatsCard = ({ title, total, lastMonth, icon }) => (
  <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
    <div className="flex justify-between">
      <div>
        <h3 className="text-gray-500 text-md uppercase">{title}</h3>
        <p className="text-2xl">{total}</p>
      </div>
      {icon}
    </div>
    <div className="flex gap-4">
      <span className="text-green-500 flex items-center">
        <HiArrowNarrowUp />
        {lastMonth}
      </span>
      <div className="text-gray-500">Last Month</div>
    </div>
  </div>
);

// ✅ Reusable Recent Table Component
const RecentTable = ({ title, link, headers, rows }) => (
  <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
    <div className="flex justify-between p-3 text-sm font-semibold">
      <h1 className="text-center p-2">{title}</h1>
      <Button outline gradientDuoTone="purpleToPink">
        <Link to={link}>See All</Link>
      </Button>
    </div>
    <Table hoverable>
      <Table.Head>
        {headers.map((head, idx) => (
          <Table.HeadCell key={idx}>{head}</Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="divide-y">
        {rows.map((cells, index) => (
          <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            {cells.map((cell, i) => (
              <Table.Cell key={i}>{cell}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
