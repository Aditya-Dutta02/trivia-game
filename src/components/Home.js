import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleClick = (choice) => {
    if (choice === "create") {
      navigate("/create");
    }
  };
  return (
    <div className="component">
      <div className="title">
        <h1>Trivia Game</h1>
        <p>by Aditya Dutta</p>
      </div>
      <div className="choice">
        {/* <input
          type="button"
          value="Create your own Trivia"
          onClick={handleClick("create")}
        /> */}
        <Link className="create-btn" to="/create">
          Create
        </Link>
        <Link className="choose-btn" to="/choose">
          Choose
        </Link>
      </div>
    </div>
  );
}
