import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ChooseTrivia() {
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    const getQuizList = async () => {
      try {
        const res = await axios.get("http://192.168.1.124:5000/api/quizList");
        console.log(quizList);
        setQuizList(res.data);
      } catch {
        console.log("Error adding data");
      }
    };
    getQuizList();
  }, []);

  return (
    <div className="choose-container">
      <h1>Choose Trivia</h1>
      <div>
        {quizList.map((item, index) => (
          <div className="trivia-list" key={index}>
            <Link to={`/trivia/${item.quizName}`}>{item.quizName}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
