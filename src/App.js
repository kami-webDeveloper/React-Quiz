import { useEffect, useReducer } from "react";
import Header from "./Components/Header";
import Main from "./Components/Main";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import StartScreen from "./Components/StartScreen";
import Question from "./Components/Question";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import FinishScreen from "./Components/FinishScreen";
import Footer from "./Components/Footer";
import Timer from "./Components/Timer";

const SECS_PER_QUESTION = 20;

function App() {
  const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
  };
  // loading, error, ready, active, finished

  const reducer = function (state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
        return { ...state, status: "error" };
      case "start":
        return {
          ...state,
          status: "active",
          secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        };
      case "newAnswer":
        const question = state.questions.at(state.index);

        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };
      case "nextQuestion":
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        };
      case "finishQuiz":
        return {
          ...state,
          status: "finished",
          highScore:
            state.points > state.highScore ? state.points : state.highScore,
        };
      case "resetQuiz":
        return {
          ...initialState,
          questions: state.questions,
          status: "ready",
          highScore: state.highScore,
        };
      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? "finished" : state.status,
        };
      default:
        throw new Error("Unkown action!");
    }
  };

  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  const isTheLastQuestion = index === numQuestions - 1;

  useEffect(() => {
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              sumPoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                isTheLastQuestion={isTheLastQuestion}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            sumPoints={maxPossiblePoints}
            highscore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
