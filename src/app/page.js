"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="home">
      {/* <header>
      <nav>
        <ul>
          <li><a href="/how-to-study-together">How to Study Together</a></li>
          <li><a href="/community-events">Community events</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header> */}
      <Image
        width={1920}
        height={1080}
        src={"/woman-working-at-dining-table_0.jpg"}
        alt=""
        className="fixed object-cover w-full h-full top-0 z-[-1] blur scale-110 opacity-90"
      />
      <main className="mt-[10%]">
        <h1 className="text-4xl font-bold text-center text-blue-500 p-4 cursor-pointer">
          Welcome to EduVibe
        </h1>
        <p className="text-lg text-center text-gray-100 p-4">
          Your go-to app for academic and social integration.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/friends")}
          >
            <p className="text-white">Join Study Together</p>
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/profile")}
          >
            <p className="text-white">Go To App</p>
          </button>
        </div>
        {/* <div className="flex justify-center gap-4 items-center flex-row rounded-full px-4 py-2 bg-gray-100 w-max mx-auto mt-4">
          <div className="bg-green-500 rounded-full h-4 w-4"></div>
          <p className="text-lg text-center text-gray-700">
            Online users{" "}
            <b className="text-lg text-center text-gray-700">2312</b>
          </p>
        </div> */}
      </main>
    </div>
  );
}
