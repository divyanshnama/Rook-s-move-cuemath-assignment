import setWinnerUI from "../../ui/setWinnerUI";
import socket from "../../socket";

function updateLoaders(gameState, playerLoader, opponentLoader) {
  const loaderAlpha = gameState.playerMove
    ? { player: 1, opponent: 0 }
    : { player: 0, opponent: 1 };
  playerLoader.alpha = loaderAlpha.player;
  opponentLoader.alpha = loaderAlpha.opponent;
  const loaderValue = gameState.loader / 30;
  playerLoader.value = gameState.playerMove ? loaderValue : 0;
  opponentLoader.value = gameState.playerMove ? 0 : loaderValue;
}

export default function update(gameState) {
  updateLoaders(gameState, this.playerLoader, this.opponentLoader);

  if (gameState.playerMove && gameState.loader >= 30 && !gameState.gameEnd) {
    gameState.gameEnd = true;
    socket.emit("lost-time", gameState.gameCode);
  }

  this.endpoint.angle += 0.5; // Adjust the rotation speed as needed

  if (gameState.validMoves.length > 0 && !gameState.movesOverlay) {
    const grp = this.add.group();
    gameState.validMoves.forEach((move) => {
      const pos = getRenderPosition(move, { x: 4.5, y: 4.5 });
      const moveSign = this.add
        .sprite(pos.x, pos.y, "validmove")
        .setInteractive();
      moveSign.setOrigin(0, 0);
      moveSign.on("pointerdown", (ptr) => {
        gameState.moveTo = pos.chessSquare;
        gameState.validMoves = [];
        gameState.moving = true;
        grp.clear(true);
        gameState.movesOverlay = false;
        socket.emit("player-moved", gameState.gameCode, gameState.moveTo);

        clearInterval(this?.timer);
        gameState.loader = 0;
        this.timer = setInterval(() => {
          if (gameState.loader === 30) {
            clearInterval(this?.timer);
            return;
          }
          gameState.loader += 1;
        }, 1000);
      });
      grp.add(moveSign);
    });
    gameState.movesOverlay = true;
  }

  if (gameState.moveTo && gameState.moving) {
    const currPos = { x: this.rook.x, y: this.rook.y };
    const updatePos = getRenderPosition(gameState.moveTo, { x: 6, y: 5.5 });
    this.rook.x -= currPos.x > updatePos.x ? 1 : 0;
    this.rook.y += currPos.y < updatePos.y ? 1 : 0;

    if (currPos.x === updatePos.x && currPos.y === updatePos.y) {
      gameState.moving = false;
      gameState.currentPosition = updatePos.chessSquare;
      if (gameState.gameEnd) {
        setWinnerUI(gameState.isWinner);
      }
    }
  }
}

function getRenderPosition(chessSquare, { x = 0, y = 0 } = {}) {
  const size = 40;
  const padding = 20;
  const verticalGap = 4;
  const center = { x, y };
  const xCoord = padding + ((chessSquare - 1) % 8) * size + center.x;
  const yCoord =
    verticalGap * size + parseInt((chessSquare - 1) / 8) * size + center.y;
  return { chessSquare, x: xCoord, y: yCoord };
}
