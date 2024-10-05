function NextButton({ dispatch, answer, isTheLastQuestion }) {
  if (answer === null) return null;

  const dispatchType = isTheLastQuestion ? "finishQuiz" : "nextQuestion";

  return (
    <button
      className="btn btn-ui"
      onClick={() =>
        dispatch({
          type: dispatchType,
        })
      }
    >
      {isTheLastQuestion ? "Finish" : "Next"}
    </button>
  );
}

export default NextButton;
