import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const timerRef = useRef(null);
  const beepRef = useRef(null);

  useEffect(() => {
    if (timeLeft === 0) {
      beepRef.current.play();
      setTimeout(() => {
        const next = isSession ? breakLength : sessionLength;
        setTimeLeft(next * 60);
        setIsSession(!isSession);
      }, 1000);
    }
  }, [timeLeft, isSession]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const increment = (setter, value, limit, id) => {
    if (isRunning) return;
    if (value < 60) setter(value + 1);
    if (id === "session-increment") setTimeLeft((value + 1) * 60);
  };

  const decrement = (setter, value, id) => {
    if (isRunning) return;
    if (value > 1) setter(value - 1);
    if (id === "session-decrement") setTimeLeft((value - 1) * 60);
  };

  return (
    <div className="container">
      <h1>Pomodoro Clock</h1>
      <div className="settings">
        <div className="length-control">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => decrement(setBreakLength, breakLength, "break-decrement")}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => increment(setBreakLength, breakLength, 60, "break-increment")}>+</button>
        </div>
        <div className="length-control">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => decrement(setSessionLength, sessionLength, "session-decrement")}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => increment(setSessionLength, sessionLength, 60, "session-increment")}>+</button>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <div className="controls">
        <button id="start_stop" onClick={handleStartStop}>Start / Stop</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>

      <audio
        id="beep"
        preload="auto"
        ref={beepRef}
        src="https://www.soundjay.com/button/beep-07.wav"
      />
    </div>
  );
}
