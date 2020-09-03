import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex w-full h-full relative justify-center">
      <div
        className="z-10 hero w-full h-full bg-cover bg-center absolute"
        style={{ backgroundImage: "url(hero.jpg)" }}
      ></div>
      <div className="flex flex-col self-center content-center z-10">
        <h1 className="text-6xl bg-gray-800 p-12 text-white rounded-md shadow-2xl mb-24 md:text-5xl">
          Start Conversation
        </h1>
        <Link
          className="w-1/3 text-center mx-auto rounded p-2 bg-blue-brand text-3xl text-white"
          to="/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Hero;
