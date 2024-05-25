import React from "react";
import CardList from "../Components/CardList";
import RightCard from "../Components/RightCard";
function Home() {
  return (
    <div className=" mt-44 p-5 w-full">
      <div className=" grid grid-cols-1 gap-2">
        <CardList />
      </div>
    </div>
  );
}

export default Home;
