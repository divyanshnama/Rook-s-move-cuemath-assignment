const express = require("express");
const app = express();
const http = require("http");
const { Server: Socket } = require("socket.io");
const { v4: uuid } = require("uuid");

const server = http.createServer(app);
const io = new Socket(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const GAMES = {};

app.use(express.static("../dist"));

io.on("connection", (client) => {
  client.on("create-game", () => {
    const roomName = uuid().split("-")[0];
    client.join(roomName);
    client.emit("game-created", roomName);
    client.gameCode = roomName;
  });

  client.on("disconnect", () => {
    handleDisconnect(client);
  });

  client.on("join-game", (gameCode) => {
    handleJoinGame(client, gameCode);
  });

  client.on("player-moved", (gameCode, moveTo) => {
    handlePlayerMove(client, gameCode, moveTo);
  });

  client.on("lost-time", (gameCode) => {
    handleLostTime(gameCode);
  });
});

function handleDisconnect(client) {
  const gameCode = client.gameCode;
  if (gameCode && GAMES[gameCode]) {
    const { currentPlayer, nextPlayer } = GAMES[gameCode];
    const winnerId = currentPlayer === client.id ? nextPlayer : currentPlayer;
    io.to(gameCode).emit("win", winnerId);
    delete GAMES[gameCode];
  }
}

function handleJoinGame(client, gameCode) {
  const roomExists = io.sockets.adapter.rooms.has(gameCode);
  if (roomExists) {
    client.join(gameCode);
    client.gameCode = gameCode;
    const players = Array.from(io.sockets.adapter.rooms.get(gameCode));
    createGame(players, gameCode);
    players.forEach((player) => {
      const gameData = {
        playerMove: GAMES[gameCode].currentPlayer === player,
        gameCode,
      };
      io.to(player).emit("ready", gameData);
    });
  } else {
    client.emit("wrong-code");
  }
}

function handlePlayerMove(client, gameCode, moveTo) {
  const allValidMoves = getValidMoves(GAMES[gameCode].currentRookPosition);
  if (!allValidMoves.includes(parseInt(moveTo))) return;

  if (parseInt(moveTo) === 57) {
    io.to(gameCode).emit("win", GAMES[gameCode].currentPlayer);
  }

  io.to(GAMES[gameCode].nextPlayer).emit("opponent-moved", moveTo);

  const temp = GAMES[gameCode].nextPlayer;
  GAMES[gameCode].nextPlayer = GAMES[gameCode].currentPlayer;
  GAMES[gameCode].currentPlayer = temp;
  GAMES[gameCode].currentRookPosition = moveTo;

  const players = Array.from(io.sockets.adapter.rooms.get(gameCode));
  players.forEach((player) => {
    const gameData = {
      playerMove: GAMES[gameCode].currentPlayer === player,
    };
    io.to(player).emit("ready-next-move", gameData);
  });
}

function handleLostTime(gameCode) {
  if (!gameCode || !GAMES[gameCode]) return;
  const winner = GAMES[gameCode].nextPlayer;
  io.to(gameCode).emit("time-win", winner);
  delete GAMES[gameCode];
}

function createGame(players, gameCode) {
  GAMES[gameCode] = {
    currentPlayer: players[0],
    nextPlayer: players[1],
    currentRookPosition: 8,
  };
}

function getValidMoves(currentPosition) {
  const validMoves = [];
  for (let i = currentPosition - 1; i <= 64; i--) {
    if (i < 1 || i % 8 === 0) break;
    validMoves.push(i);
  }
  for (let i = currentPosition + 8; i <= 64; i += 8) {
    validMoves.push(i);
  }
  return validMoves;
}

server.listen(3000, () => {
  console.log("Server active on port 3000");
});
