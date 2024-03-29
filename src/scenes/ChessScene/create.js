import Phaser from "phaser";

export default function create(gameState) {
  const { width, height } = this.sys.game.config;

  // Grid
  const gridTop = this.add.sprite(0, 0, "grid").setOrigin(0, 0);
  gridTop.displayWidth = width;
  gridTop.displayHeight = height / 2;

  const gridBottom = this.add.sprite(0, height / 2, "grid").setOrigin(0, 0);
  gridBottom.displayWidth = width;
  gridBottom.displayHeight = height / 2;

  // Boxes
  const boxSize = 40;
  const padding = 20;
  let createBox = true;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (createBox) {
        const sqr = this.add
          .rectangle(
            i * boxSize + padding,
            j * boxSize + 160,
            boxSize,
            boxSize,
            0xffffff,
            0.15
          )
          .setOrigin(0, 0);
      }
      if (j !== 7) {
        createBox = !createBox;
      }
    }
  }

  // Rook
  const pos = getRenderPosition(8, { x: 6, y: 5.5 });
  this.rook = this.add
    .sprite(pos.x, pos.y, "player")
    .setInteractive()
    .setOrigin(0, 0);

  // Endpoint
  this.endpoint = this.add
    .sprite(padding + 22, 12 * boxSize - 18, "endpoint")
    .setOrigin(0.5, 0.5);

  // Avatars
  this.add.sprite(160, 568, "playeravatar").setOrigin(0, 0);
  this.add.sprite(155, 32, "opponentavatar").setOrigin(0, 0);

  // Loaders
  this.playerLoader = this.add
    .rexCircularProgress({
      x: 155,
      y: 563,
      radius: 28,
      trackColor: 0x2a2a2a,
      barColor: 0x3dd771,
      value: 0.0,
    })
    .setOrigin(0, 0);

  this.opponentLoader = this.add
    .rexCircularProgress({
      x: 150,
      y: 27,
      radius: 25,
      trackColor: 0x2a2a2a,
      barColor: 0x3dd771,
      value: 0.0,
    })
    .setOrigin(0, 0);

  // Pointers
  this.rook.on("pointerdown", function (ptr) {
    if (gameState.moving || !gameState.playerMove) return;
    gameState.validMoves = getValidMoves(gameState.currentPosition);
  });
}

function getRenderPosition(chessSquare, centerPadding) {
  const size = 40;
  const padding = 20;
  const verticalGap = 4;
  const x = padding + ((chessSquare - 1) % 8) * size + (centerPadding?.x || 0);
  const y =
    verticalGap * size +
    Math.floor((chessSquare - 1) / 8) * size +
    (centerPadding?.y || 0);
  return { x, y };
}

function getValidMoves(currentPosition) {
  const validMoves = [];
  for (let i = currentPosition - 1; i >= 1; i--) {
    if (i % 8 === 0) break;
    validMoves.push(i);
  }
  for (let i = currentPosition + 8; i <= 64; i += 8) {
    validMoves.push(i);
  }
  return validMoves;
}
