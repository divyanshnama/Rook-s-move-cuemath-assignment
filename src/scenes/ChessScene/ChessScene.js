import Phaser from "phaser";
import socket from "../../socket";
import create from "./create";
import preload from "./preload";
import update from "./update";

const gameState = {
  gameCode: null,
  playerMove: true,
  currentPosition: 8,
  validMoves: [],
  moveTo: 8,
  moving: false,
  movesOverlay: false,
  gameEnd: false,
  isWinner: null,
  loader: 0,
  timer: null,
};

const ChessScene = new Phaser.Scene();

// Bind preload, create, and update functions to gameState
ChessScene.preload = preload.bind(ChessScene, gameState);
ChessScene.create = create.bind(ChessScene, gameState);
ChessScene.update = update.bind(ChessScene, gameState);

// Handle socket events
socket.on("ready", (payload) => {
  gameState.gameCode = payload.gameCode;
  gameState.playerMove = payload.playerMove;

  // Setup timer
  gameState.loader = 0;
  gameState.timer = setInterval(() => {
    if (gameState.loader === 30) {
      clearInterval(gameState.timer);
      return;
    }
    gameState.loader += 1;
  }, 1000);

  socket.off("ready");
});

socket.on("opponent-moved", (moveTo) => {
  gameState.moveTo = moveTo;
  gameState.moving = true;

  // Restart timer
  clearInterval(gameState.timer);
  gameState.loader = 0;
  gameState.timer = setInterval(() => {
    if (gameState.loader === 30) {
      clearInterval(gameState.timer);
      return;
    }
    gameState.loader += 1;
  }, 1000);
});

socket.on("ready-next-move", (move) => {
  gameState.playerMove = move.playerMove;
});

socket.on("win", (winnerId) => {
  gameState.gameEnd = true;
  gameState.isWinner = winnerId === socket.id;
  clearInterval(gameState.timer);
});

export default ChessScene;
