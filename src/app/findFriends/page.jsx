"use client";
import Body from "@/components/Body";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [users, setUsers] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      axios
        .get(window.location.origin + "/api/users")
        .then((response) => {
          const users = Object.values(response.data);
          setUsers(users);
        })
        .catch((error) => {
          console.error("There was an error fetching the users!", error);
          setUsers([]);
        });
    }
  }, [session]);

  const handleAddFriend = (friendEmail) => {
    axios
      .post(window.location.origin + "/api/friends", {
        userEmail: session.user.email,
        friendEmail,
      })
      .then((response) => {
        alert("Friend added successfully!");
      })
      .catch((error) => {
        console.error("There was an error adding the friend!", error);
      });
  };

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
      <div className="find-friends">
        <h1 className="text-2xl font-bold">Find Friends</h1>
        <ul className="flex flex-col gap-4 mt-4 w-full">
          {users.map((user) => (
            <li
              key={user.email}
              className="flex items-center gap-4 p-4 border-[1px] border-gray-300 rounded-md"
            >
              <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex items-center gap-4 w-fill">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                {session.user?.friends?.includes(user.email) ? (
                  <p>Friend</p>
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
        </ul>
      </div>
    </Body>
  );
};

export default Page;
