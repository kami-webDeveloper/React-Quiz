function FinishScreen({ points, sumPoints, highscore, dispatch }) {
  const percentage = (points / sumPoints) * 100;

  let emoji;
  percentage === 100 && (emoji = "🥇");
  if (percentage >= 80 && percentage < 100) emoji = "🥳";
  if (percentage >= 50 && percentage < 80) emoji = "😁";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  percentage === 0 && (emoji = "🤦‍♂️");

  return (
    <>
      <p className="result">
        <strong>{emoji}</strong> You scored <strong>{points}</strong> out of{" "}
        {sumPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "resetQuiz" })}
      >
        Restart quiz
      </button>
    </>
  );
}

export default FinishScreen;
