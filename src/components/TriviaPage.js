import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useSocket } from "../contexts/SocketContext";

export default function TriviaPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState();
  const socket = useSocket();
  const [quizName, setQuizName] = useState();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [allAnswersSubmitted, setAllAnswersSubmitted] = useState(false);
  const [playersScore, setPlayersScore] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [quizEnd, setQuizEnd] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const medals = [
    { src: "/trophy.png", alt: "Gold Trophy" },
    { src: "/silver-medal.png", alt: "Silver Medal" },
    { src: "/bronze-medal-2.png", alt: "Bronze Medal" },
  ];

  useEffect(() => {
    console.log(id);
    const fetchQuiz = async () => {
      try {
        // const res = await axios.get(`http://localhost:5000/api/trivia/${id}`);
        const res = await axios.get(
          `http://192.168.1.124:5000/api/trivia/${id}`
        );
        // console.log(res.data);
        setQuizName(res.data.quizName);
        const response = res.data;
        delete response.quizName;
        delete response._id;
        setQuiz(response);
      } catch (err) {
        console.error("Error fetching trivia: ", err);
      }
    };
    fetchQuiz();

    if (socket) {
      console.log("Socket is here");

      socket.on("updatePlayerList", ({ playersList }) => {
        // setPlayersList((playersList) => ({
        //   ...playersList,
        //   pName: pName,
        // }));
        if (Array.isArray(playersList)) {
          setPlayersList(playersList);
        } else console.log("Error in updating player list");

        // const player = { name: pName };
        // setPlayersList([...playersList, player]);
        console.log(playersList);
      });

      socket.on("newQuestion", ({ question, questionId }) => {
        const options = [
          { text: question.correct, isCorrect: true },
          { text: question.opt2, isCorrect: false },
          { text: question.opt3, isCorrect: false },
          { text: question.opt4, isCorrect: false },
        ];
        setShuffledOptions(shuffleArray(options));
        setQuestion({ ...question, questionId });
        setSubmitted(false);
        console.log(question);
      });

      socket.on("questionTimeout", () => {
        // setSubmitted(true); // Mark the question as answered after timeout

        setSubmitted(true);
        setAnswer("ErrorCade7998");
        socket.emit("submitAnswer", {
          roomId: id,
          questionId: question.questionId,
          answer,
          remainingTime,
        });

        // alert(`Time's up for question ${questionId}`);
      });

      socket.on("updateTimer", (time) => {
        setRemainingTime(time);
      });

      socket.on("scoreUpdate", ({ score }) => {
        setScore(score);
      });

      socket.on("quizEnd", ({ scores }) => {
        playersList.sort((a, b) => b.score - a.score);
        setShowScoreboard(false);
        setQuizStarted(false);
        setQuizEnd(true);

        console.log(scores);
        // alert("Quiz ended!");
        // console.log("Final Scores:", scores);
      });

      socket.on("allAnswersSubmitted", () => {
        setAllAnswersSubmitted(true);
        if (question) {
          var questionId = question.questionId;
          // console.log(questionId);
          socket.emit("showScoreboard", { roomId: quizName });
          setShowScoreboard(true);
          startCountdown(15);
          let totalQuestions;
          if (Array.isArray(quiz)) {
            totalQuestions = quiz.length;
          } else if (typeof quiz === "object") {
            totalQuestions = Object.keys(quiz).length;
          }
          console.log("Total questions:" + totalQuestions);
          console.log(questionId);
          if (questionId <= totalQuestions - 1) {
            setTimeout(() => {
              setShowScoreboard(false);
              socket.emit("nextQuestion", { roomId: quizName, questionId });
            }, 15000);
          } else {
            setShowScoreboard(false);
            socket.emit("nextQuestion", { roomId: quizName, questionId });
          }

          // socket.emit("showScoreboard");
        }

        // socket.emit("nextQuestion", { quizName, questionId });
      });

      socket.on("showingScores", ({ playersList }) => {
        const sortedPlayers = [...playersList].sort(
          (a, b) => b.score - a.score
        );
        setPlayersScore(sortedPlayers);
        // console.log(name, score);
      });

      socket.on("quizStart", ({ flag }) => {
        console.log("Quiz started");
        setQuizStarted(flag);
      });

      return () => {
        socket.off("newQuestion");
        socket.off("updatePlayerList");
        socket.off("allAnswersSubmitted");
        socket.off("questionTimeout");
        socket.off("scoreUpdate");
        socket.off("quizEnd");
      };
    }
  }, [id, socket, playersList, question, quizName]);

  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleJoin = () => {
    socket.emit("joinRoom", { roomId: id, playerName });
  };

  const handleStartQuiz = () => {
    socket.emit("startQuiz", id);
  };

  const handleSubmit = (event, option) => {
    event.preventDefault();
    // console.log(option.text);
    // setAnswer(option.text);
    // console.log(answer);
    if (submitted || !question) return;
    socket.emit("submitAnswer", {
      roomId: id,
      questionId: question.questionId,
      answer: option.text,
      remainingTime,
    });
    setSubmitted(true);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="quiz-cointainer">
      {!quizStarted && !quizEnd ? (
        <div>
          <h1 className="join-title">Join the Quiz</h1>
          <div className="join-quiz-container">
            <input
              type="text"
              className="name-input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
            <button onClick={handleJoin}>Join</button>
            <button onClick={handleStartQuiz}>Start Quiz</button>
            {/* <ul> */}
            <div className="player-list">
              {playersList.map((player, index) => (
                <div className="player-names" key={index}>
                  {player.playerName}
                </div>
              ))}
            </div>
            {/* </ul> */}
          </div>
        </div>
      ) : (
        <div>
          {question && !showScoreboard && !quizEnd && (
            <div className="quiz-start-contianer">
              <h1 className="question-title">Question {question.questionId}</h1>
              <p className="question-statement">{question.question}</p>{" "}
              <span className="timer">Timer: {remainingTime} seconds</span>
              {shuffledOptions.map((option, index) => (
                <button key={index} onClick={(e) => handleSubmit(e, option)}>
                  {option.text}
                </button>
              ))}
            </div>
          )}
          {/* <h2>Your Score: {score.score}</h2> */}
        </div>
      )}
      {showScoreboard ? (
        <div className="show-scoreboard-container">
          <h1 className="scoreboard-title">Scoreboard</h1>
          <span className="countdown-question">
            Next Question in {countdown} seconds
          </span>
          <ul className="player-scorecard">
            {playersScore.map((player) => (
              <li key={player.playerName}>
                {player.playerName} : {player.score}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
      {quizEnd ? (
        <div className="quiz-end-container">
          <h1 className="quiz-end-title">Quiz End</h1>
          <ul className="player-scorecard">
            {playersScore
              .map((player, index) => (
                <li key={index}>
                  {index < 3 ? (
                    <img
                      src={medals[index].src}
                      alt={medals[index].alt}
                      className="medal"
                    />
                  ) : (
                    <span className="ranking">{index + 1}</span>
                  )}
                  {player.playerName} : {player.score}
                </li>
              ))
              .sort((a, b) => b.score - a.score)}
          </ul>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
