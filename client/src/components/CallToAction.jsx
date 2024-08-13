import { Button } from "flowbite-react";
import React from "react";

export default function CallToAction() {
  
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-between
    items-center rounded-tl-3xl rounded-br-3xl text-center h-[400px]">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about javascript</h2>
        <p className="text-gray-500 my-5">checkout these resources with 100 javascript projects</p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://github.com/Ankitkumar95993"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmy3YIzU0SxjvZNNJJT9UpfeBXRk23lZ10yWYorrH83Q&s"
        className="w-[500px] h-[300]" />
      </div>
    </div>
  );
}
