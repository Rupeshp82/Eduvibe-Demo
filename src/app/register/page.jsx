"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("/api/auth/register", {
        name,
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        router.push("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const { data: session } = useSession();

  //if user is not logged in, redirect to login page
  if (session) {
    router.push("/profile");
  }

  return (
    <>
      <Image
        src={"/woman-working-at-dining-table_0.jpg"}
        width={1920}
        height={1080}
        alt=""
        className="fixed object-cover w-full h-full top-0 z-[-1] blur scale-110 opacity-90"
      />
      <div className="register-container">
        <div className="register-card w-1/3">
          <h2>SIGN UP</h2>
          <form onSubmit={handleRegister}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-signup">
              SIGN UP
            </button>
          </form>
          <p>
            Have an Account? <a href="/login">Login Here!</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
