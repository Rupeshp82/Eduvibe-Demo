"use client";
import Body from "@/components/Body";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    axios.get(`https://openlibrary.org/search.json?q=${search}&limit=20`)
    .then((res) => {
      try {
        setBooks(res.data.docs);
      console.log(res.data.docs);
      } catch (error) {
        console.error("There was an error fetching the books!", error);
        setBooks([]);
      }
    })
  };
  useEffect(() => {}, []);
  return (
    <Body>
      <h1 className="text-2xl font-bold text-black text-center">Library</h1>
      {/* search block */}
      <div className="flex justify-center items-center gap-4 mt-4 bg-white p-4 rounded-md shadow-md w-3/4 mx-auto border-[1px] border-gray-300">
        <input
          type="text"
          placeholder="Search for books"
          className="w-1/2 p-2 border-[1px] border-gray-300 rounded-md "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 rounded h-fit p-3"
          onClick={() => handleSearch()}
        >
          Search
        </button>
      </div>
      {/* books block */}
      <div className="flex flex-wrap gap-4 mt-4 flex-row justify-center">
        {books.map((book) => (
          <div
            key={book.key}
            className="w-1/4 p-4 border-[1px] border-gray-300 rounded-md"
          >
            <Image
              src={`https://covers.openlibrary.org/a/id/${book.cover_i}.jpg`}
              width={200}
              height={200}
              alt={book.title}
              loading="lazy"
              className="rounded-md h-60 w-full object-contain"
            />
            <h3 className="text-lg font-bold">{book.title}</h3>
            <p>
              {book.author_name && book.author_name.length > 0
                ? book.author_name.join(", ")
                : "Author not available"}
            </p>
            <p>
              {book.first_publish_year
                ? "Published in " + book.first_publish_year
                : "Publish year not available"}
            </p>
          </div>
        ))}
      </div>
    </Body>
  );
};

export default Library;
