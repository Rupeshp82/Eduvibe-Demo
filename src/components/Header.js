"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  const logout = async () => {
    await signOut();
  };
  return (
    <header className="fixed w-full top-0 flex justify-around border-b-[1px] py-4 align-middle bg-white cursor-pointer">
      <div onClick={() => router.push("/")}>
        <h1 className="text-2xl font-bold text-black">EduVibe</h1>
      </div>
      <div className="hidden md:flex items-center">
        <nav className="flex justify-between gap-6 items-center flex-row">
          <Link href="/" className="text-gray-900 hover:text-gray-500">
            Home
          </Link>
          <Link href="/profile" className="text-gray-900 hover:text-gray-500">
            Profile
          </Link>
          <Link href="/posts" className="text-gray-900 hover:text-gray-500">
            Posts
          </Link>
          <Link
            href="/library"
            className="text-gray-900 hover:text-gray-500"
          >
            Library
          </Link>
          <Link
            href="/findFriends"
            className="text-gray-900 hover:text-gray-500"
          >
            Find Friends
          </Link>
          <Link
            href="/calendar"
            className="text-gray-900 hover:text-gray-500"
          >
            Calender
          </Link>
          <Link
            href="/studyGroup"
            className="text-gray-900 hover:text-gray-500"
          >
            Study Groups
          </Link>
          <Link href="/about" className="text-gray-900 hover:text-gray-500">
            About Us
          </Link>
        </nav>
      </div>
      {!session ? (
        <ul className="flex justify-between gap-3 items-center">
          <li>
            <Link
              href="/register"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="text-gray-900 hover:text-gray-500 font-bold"
            >
              Login
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="flex justify-between gap-3 items-center">
          <li>
            <button
              onClick={() => logout()}
              className="text-gray-900 hover:text-gray-500 font-bold"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
