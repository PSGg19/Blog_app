import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  return (
    // Main container with responsive flex layout, border, rounded corners, and height
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-between
    items-center rounded-tl-3xl rounded-br-3xl text-center h-[400px]">

      {/* Left Section: Text and Button */}
      <div className="flex-1 justify-center flex flex-col">
        {/* Heading */}
        <h2 className="text-2xl">Want to learn more about javascript</h2>
        
        {/* Subtext */}
        <p className="text-gray-500 my-5">
          checkout these resources with 100 javascript projects
        </p>

        {/* Button with gradient and rounded corners */}
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          {/* External GitHub link opens in new tab */}
          <a
            href="https://github.com/PSGg19"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Projects
          </a>
        </Button>
      </div>

      {/* Right Section: Image */}
      <div className="p-7 flex-1">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmy3YIzU0SxjvZNNJJT9UpfeBXRk23lZ10yWYorrH83Q&s"
          className="w-[500px] h-[300]" 
          alt="JavaScript Projects Preview" 
        />
      </div>
    </div>
  );
}
