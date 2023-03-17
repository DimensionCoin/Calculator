import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInterval } from "react-use";
import Headers from "../components/Headers";
import "./Real.css";

const Real = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const paddleWidth = 10;
    const paddleHeight = 60;
    const ballRadius = 5;

    const initialState = {
      player: {
        x: 10,
        y: canvas.height / 2 - paddleHeight / 2,
        dy: 0,
      },
      computer: {
        x: canvas.width - 10 - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        dy: 0,
      },
      ball: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 2,
        dy: 2,
      },
      paddleWidth,
      paddleHeight,
      ballRadius,
    };

    setGameState(initialState);
  }, []);

  useInterval(() => {
    if (!gameState || paused || winner) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameState.player.y += gameState.player.dy;
    gameState.computer.y += gameState.computer.dy;

    gameState.ball.x += gameState.ball.dx;
    gameState.ball.y += gameState.ball.dy;

    // Player paddle movement
    if (gameState.player.y <= 0) {
      gameState.player.y = 0;
    } else if (gameState.player.y + gameState.paddleHeight >= canvas.height) {
      gameState.player.y = canvas.height - gameState.paddleHeight;
    }

    // Computer paddle movement
    gameState.computer.dy = gameState.ball.dy * 0.85;
    if (gameState.computer.y <= 0) {
      gameState.computer.y = 0;
    } else if (gameState.computer.y + gameState.paddleHeight >= canvas.height) {
      gameState.computer.y = canvas.height - gameState.paddleHeight;
    }

    // Ball collision with paddles
    if (
      (gameState.ball.x - gameState.ballRadius <=
        gameState.player.x + gameState.paddleWidth &&
        gameState.ball.y >= gameState.player.y &&
        gameState.ball.y <= gameState.player.y + gameState.paddleHeight) ||
      (gameState.ball.x + gameState.ballRadius >= gameState.computer.x &&
        gameState.ball.y >= gameState.computer.y &&
        gameState.ball.y <= gameState.computer.y + gameState.paddleHeight)
    ) {
      gameState.ball.dx *= -1;
    }

    // Ball collision with top and bottom
    if (
      gameState.ball.y - gameState.ballRadius <= 0 ||
      gameState.ball.y + gameState.ballRadius >= canvas.height
    ) {
      gameState.ball.dy *= -1;
    }

    // Ball goes out of bounds (left or right)
    if (gameState.ball.x - gameState.ballRadius <= 0) {
      setScore((prevScore) => ({
        ...prevScore,
        computer: prevScore.computer + 1,
      }));
      checkWinner("computer");
      resetBall();
    } else if (gameState.ball.x + gameState.ballRadius >= canvas.width) {
      setScore((prevScore) => ({ ...prevScore, player: prevScore.player + 1 }));
      checkWinner("player");
      resetBall();
    }

    // Drawing player, computer paddles, and    // Drawing player, computer paddles, and the ball
    ctx.fillStyle = "white";
    ctx.fillRect(
      gameState.player.x,
      gameState.player.y,
      gameState.paddleWidth,
      gameState.paddleHeight
    );
    ctx.fillRect(
      gameState.computer.x,
      gameState.computer.y,
      gameState.paddleWidth,
      gameState.paddleHeight
    );
    ctx.beginPath();
    ctx.arc(
      gameState.ball.x,
      gameState.ball.y,
      gameState.ballRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    if (gameState.ball.x - gameState.ballRadius <= 0) {
      setScore((prevScore) => ({
        ...prevScore,
        computer: prevScore.computer + 1,
      }));
      resetBall();
    } else if (gameState.ball.x + gameState.ballRadius >= canvas.width) {
      setScore((prevScore) => ({ ...prevScore, player: prevScore.player + 1 }));
      resetBall();
    }

    setGameState({ ...gameState });
  }, 1000 / 60);

  const checkWinner = (player) => {
    if (score[player] >= 9) {
      setWinner(player);
      setPaused(true);
    }
  };

  const resetGame = () => {
    setWinner(null);
    setPaused(false);
    setScore({ player: 0, computer: 0 });
  };

  const resetBall = () => {
    gameState.ball.x = canvasRef.current.width / 2;
    gameState.ball.y = canvasRef.current.height / 2;
    gameState.ball.dx *= -1;
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowUp") {
        setGameState((prevState) => ({
          ...prevState,
          player: {
            ...prevState.player,
            dy: -5,
          },
        }));
      } else if (e.key === "ArrowDown") {
        setGameState((prevState) => ({
          ...prevState,
          player: {
            ...prevState.player,
            dy: 5,
          },
        }));
      }
    },
    [setGameState]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        setGameState((prevState) => ({
          ...prevState,
          player: {
            ...prevState.player,
            dy: 0,
          },
        }));
      }
    },
    [setGameState]
  );

  const handleSpacebar = useCallback(
    (e) => {
      if (e.code === "Space") {
        setPaused(!paused);
      }
    },
    [paused]
  );

  const handleTouchStart = useCallback(
    (direction) => {
      setGameState((prevState) => ({
        ...prevState,
        player: {
          ...prevState.player,
          dy: direction === "up" ? -5 : 5,
        },
      }));
    },
    [setGameState]
  );

  const handleTouchEnd = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      player: {
        ...prevState.player,
        dy: 0,
      },
    }));
  }, [setGameState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleSpacebar);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [gameState, paused, handleKeyDown, handleKeyUp, handleSpacebar]);

  return (
    <div className="retro-bg min-h-screen flex flex-col justify-center items-center">
      <Headers />
      <div className="retro-text mb-4 mt-20">
        Player: {score.player} | Computer: {score.computer}
      </div>
      {winner && (
        <div className="retro-text mb-4">
          {winner === "player" ? "You won!" : "Computer won!"}{" "}
          <button className="btn" onClick={resetGame}>
            Play again
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={320}
        height={480}
        className="border-2 border-green-500"
      ></canvas>
      <div className="button-controller mt-4">
        <button
          className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-md mr-2 focus:outline-none"
          onMouseDown={() => handleTouchStart("up")}
          onMouseUp={handleTouchEnd}
          onTouchStart={() => handleTouchStart("up")}
          onTouchEnd={handleTouchEnd}
        >
          Up
        </button>
        <button
          className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none"
          onMouseDown={() => handleTouchStart("down")}
          onMouseUp={handleTouchEnd}
          onTouchStart={() => handleTouchStart("down")}
          onTouchEnd={handleTouchEnd}
        >
          Down
        </button>
      </div>
    </div>
  );
};

export default Real;
