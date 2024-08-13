import React from "react";

import { TechstackList } from "../utils/TeckstackList";

const Techstack = () => {
  return (
    <div className="container mx-auto p-4" id="techstack">
      <div>
        <h2 className="text-2xl md:text-4xl mt-3 mb-1 text-center uppercase">
          Technologies Stack
        </h2>
        <hr className="my-4" />
        <p className="pb-3 text-center">
          👉 including programming Languages, frameworks, databases, front-end
          and back-end tools, and APIs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {TechstackList.map((tech) => (
          <div left key={tech._id}>
            <div className="bg-white shadow-md rounded-full p-4 group hover:bg-teal-500 transition-colors duration-300">
              <div className="flex justify-center items-center">
                <div className="mr-2">
                  <tech.icon className="text-4xl group-hover:text-white transition-colors duration-300 "  />
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-black group-hover:text-white transition-colors duration-300">
                    {tech.name}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Techstack;
