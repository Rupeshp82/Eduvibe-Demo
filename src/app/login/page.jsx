"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Response from signIn:", res); // Log the response to inspect its structure

      if (res?.error) {
        console.error("Authentication error:", res.error);
        alert(res.error); // Display the error message to the user
      } else {
        console.log("Authentication successful:", res);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

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
          <h2>LOG IN</h2>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-signup">
              LOG IN
            </button>
          </form>
          <p>
            Don&apos;t have an Account? <a href="/register">Register Here!</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
