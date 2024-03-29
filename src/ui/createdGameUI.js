export default function createGameUI(roomCode) {
  return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Chess Game Waiting</title>
			<style>
				* {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
				}
				body {
					font-family: Arial, sans-serif;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100vh;
					background-color: #f0f0f0;
				}
				.container {
					text-align: center;
					padding: 20px;
					border-radius: 8px;
					background-color: #ffffff;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
				h1 {
					font-size: 24px;
					margin-bottom: 10px;
				}
				.game-code {
					font-size: 18px;
					color: #333333;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h1>Waiting For 2<sup>nd</sup> Player</h1>
				<p class="game-code">Game Code: ${roomCode}</p>
			</div>
		</body>
		</html>
	`;
}
