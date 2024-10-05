import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = `${Math.floor(secondsRemaining / 60)}`.padStart(2, 0);
  const secs = `${secondsRemaining % 60}`.padStart(2, 0);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);

    return () => clearInterval(id);
  }, [dispatch, secondsRemaining]);

  return (
    <div className="timer">
      {mins}:{secs}
    </div>
  );
}

export default Timer;
