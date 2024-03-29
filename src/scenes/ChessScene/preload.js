export default function preload() {
  const assetsToLoad = [
    { key: "player", url: "/assets/player-idle.png" },
    { key: "endpoint", url: "/assets/end.png" },
    { key: "grid", url: "/assets/grid.png" },
    { key: "validmove", url: "/assets/validmove.png" },
    { key: "playeravatar", url: "/assets/player-avatar.png" },
    { key: "opponentavatar", url: "/assets/opponent-avatar.png" },
    {
      key: "rexcircularprogressplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogressplugin.min.js",
      type: "script",
    },
  ];

  assetsToLoad.forEach((asset) => {
    switch (asset.type) {
      case "script":
        this.load.plugin(asset.key, asset.url, true);
        break;
      default:
        this.load.image(asset.key, asset.url);
        break;
    }
  });
}
