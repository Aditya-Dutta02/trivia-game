import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CreateTrivia() {
  const [quizName, setQuizname] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [questionStatement, setQuestionStatement] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [index, setIndex] = useState(0);
  const [upload, setUpload] = useState({});
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");

  const submitData = async (upload) => {
    console.log("Uploading data");
    console.log(upload);
    try {
      const res = await axios.post("http://localhost:5000/api/trivia", upload);
      alert("Quiz Data Uploaded");
      console.log(res);
    } catch {
      console.log("Error adding data");
    }
  };

  const handleAdd = (index, e) => {
    e.preventDefault();
    const newUpload = {
      ...upload,
      [index + 1]: {
        question: questionStatement,
        correct: correctAnswer,
        opt2,
        opt3,
        opt4,
      },
    };
    // console.log(newUpload);
    setUpload((prevUpload) => ({
      ...upload,
      ...newUpload,
    }));
    setIndex(index + 1);
    setQuestionStatement("");
    setCorrectAnswer("");
    setOpt2("");
    setOpt3("");
    setOpt4("");
    console.log(upload);
  };

  useEffect(() => {
    setUpload((upload) => ({
      ...upload,
      quizName: quizName,
    }));
    // console.log(quizName);
  }, [quizName]);

  return (
    <div className="trivia-container">
      <h1>Create your Quiz</h1>
      <form className="quiz-form">
        <div className="quiz-details">
          <div>
            <label for="quiz-name">Quiz Name : </label>
            <input
              type="text"
              id="quiz-name"
              placeholder="Enter Quiz Name"
              value={quizName}
              onChange={(e) => setQuizname(e.target.value)}
            />
          </div>
          {/* <div>
            <label for="questionNo">Number of Questions : </label>
            <input
              type="number"
              id="questionNo"
              value={numQuestions}
              onChange={(e) => {
                setNumQuestions(e.target.value);
              }}
            />
          </div> */}
        </div>
        <div className="question-block" key={index}>
          <div className="question-stmt-div">
            <label for="question">Question {index + 1}</label>
            <textarea
              type="text"
              id="question"
              rows={4}
              cols={80}
              value={questionStatement}
              onChange={(e) => setQuestionStatement(e.target.value)}
            />
          </div>
          <div className="correct-ans-div">
            <div>
              <label for="correct-ans">Correct Answer : </label>
              <input
                type="text"
                id="correct-ans"
                placeholder="Enter correct answer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              />
            </div>
            <div>
              <label for="opt2">Option 2 : </label>
              <input
                type="text"
                id="opt2"
                placeholder="Enter option 2"
                value={opt2}
                onChange={(e) => setOpt2(e.target.value)}
              />
            </div>
          </div>
          <div className="options-div">
            <div>
              <label for="opt3">Option 3 : </label>
              <input
                type="text"
                id="opt3"
                placeholder="Enter option 3"
                value={opt3}
                onChange={(e) => setOpt3(e.target.value)}
              />
            </div>
            <div>
              <label for="opt4">Option 4 : </label>
              <input
                type="text"
                id="opt4"
                placeholder="Enter option 4"
                value={opt4}
                onChange={(e) => setOpt4(e.target.value)}
              />
            </div>
          </div>
          <div>
            <input
              type="button"
              onClick={(e) => handleAdd(index, e)}
              value="Add"
              className="add-btn"
            />
          </div>
        </div>
        <button
          className="submit-btn"
          type="submit"
          onClick={() => submitData(upload)}
        >
          Submit
        </button>
      </form>
      <div className="back">
        <Link className="back-btn" to="/">
          Back
        </Link>
      </div>
    </div>
  );
}
