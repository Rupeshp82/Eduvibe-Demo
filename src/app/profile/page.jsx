"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
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
        .get(window.location.origin + `/api/posts/${session.user?.id}`)
        .then((response) => {
          setPosts(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the posts!", error);
        });
    }
  }, [session]);
  useEffect(() => {
    if (session) {
      axios
        .get(window.location.origin + "/api/users")
        .then((response) => {
          const users = Object.values(response.data);
          //inside users array, if session.user.friends includes the user.email, then add current user to the users state
          const filteredUsers = users.filter((user) => {
            return session.user.friends.includes(user.email);
          });

          setUsers(filteredUsers);
        })
        .catch((error) => {
          console.error("There was an error fetching the users!", error);
          setUsers([]);
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
    <div className="profile-container">
      {user && (
        <div className="profile-header">
          <div className="profile-info">
            <b>{user.name}</b>
            <p>{user.email}</p>
          </div>
        </div>
      )}
      <div className="profile-tabs">
        <button onClick={() => setActiveTab("posts")}>Posts</button>
        <button onClick={() => setActiveTab("friends")}>Friends</button>
      </div>
      <div className="profile-content">
        {activeTab === "posts" && (
          <div className="posts">
            <form
              className="flex flex-col gap-4 mt-4"
              onSubmit={(e) => handlePost(e)}
            >
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
            <h3 className="text-2xl font-bold text-black mt-8">Your Posts</h3>
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
        )}
        {activeTab === "friends" && (
          <div>
            <h3 className="text-2xl font-bold">Your Friends</h3>
            {users?.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-4 p-4 border-[1px] border-gray-300 rounded-md mt-4"
              >
                <div className="flex items-center gap-4 w-full justify-between">
                  <div className="flex items-center gap-4 w-fill">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  {session.user.friends.includes(user.email) ? (
                    // message friend
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        router.push(`/friends/${user.id}-${session.user.id}`);
                      }}
                    >
                      Message
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        handleAddFriend(user.email);
                      }}
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
