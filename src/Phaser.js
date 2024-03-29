import Phaser from "phaser";
import ChessScene from "./scenes/ChessScene/ChessScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  height: 640,
  width: 360,
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: ChessScene,
};

const game = new Phaser.Game(config);
export default game;
