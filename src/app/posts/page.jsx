"use client";
import Body from "@/components/Body";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Posts = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const { data: session, status } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  const handlePost = (e) => {
    e.preventDefault();
    const content = postContent;
    const userId = user.id;
    const userName = user.name;
    const userEmail = user.email;

    if (!content) {
      return alert("Please enter some content!");
    }
    axios
      .post(window.location.origin + "/api/posts", {
        content,
        userId,
        name: userName,
        email: userEmail,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        e.target[0].value = "";
      })
      .catch((error) => {
        console.error("There was an error posting the content!", error);
      });
  };

  useEffect(() => {
    if (session) {
      axios
        .get(window.location.origin + `/api/posts`)
        .then((response) => {
          //pattern: {userId: [post1, post2]}
          //get all the values from the object and store them in an array
          const postsArray = Object.values(response.data);
          //flatten the array
          const flattenedPosts = postsArray.flat();
          //sort the posts by date
          const sortedPosts = flattenedPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          const jsonPosts = sortedPosts.map((post) => JSON.parse(post));
          console.log(jsonPosts);
          setPosts(jsonPosts);
        })
        .catch((error) => {
          console.error("There was an error fetching the posts!", error);
        });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="profile-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="profile-container flex flex-col items-center mt-8 gap-4">
        <h1>Unauthorized</h1>
        <p>You need to be logged in to view this page.</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    );
  }
  return (
    <Body>
      {/* small size container */}
      <div className="container w-11/12 md:w-3/4 lg:w-1/2 mx-auto">
        <h1 className="text-4xl font-bold text-center">Posts</h1>
        <div className="posts">
          <form className="flex flex-col gap-4 mt-4" onSubmit={handlePost}>
            <textarea
              placeholder="What's on your mind?"
              className="w-full h-24 p-2 border-[1px] border-gray-300 rounded-md"
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/4"
            >
              Post
            </button>
          </form>
          <h3 className="text-2xl font-bold text-black mt-8">All Posts</h3>
          <hr className="border-[1px] border-gray-300 mb-2 mt-4" />
          {posts?.map((post) => (
            <div
              key={post.id}
              className="p-4 border-[1px] border-gray-300 rounded-md mt-4"
            >
              <p>{post.content}</p>
              <div className="flex justify-between mt-4">
                <p>
                  {post.name} ({post.email})
                </p>
                {new Date(post.createdAt).toLocaleDateString() +
                  " " +
                  new Date(post.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {posts?.length === 0 && <p>No posts yet!</p>}
        </div>
      </div>
    </Body>
  );
};

export default Posts;
