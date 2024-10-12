import React from "react";

const Button = () => {
  return (
    <button className="text-white relative px-8 py-2 rounded-md bg-orange-200 isolation-auto z-10 border-2 border-lime-500\n        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full  before:bg-orange-500 before:-z-10  before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
      Filter
    </button>
  );
};

export default Button;
