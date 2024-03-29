export default function setWinnerUI(isWinner) {
  const winColor = "#3dd771"; // Green color for winning message
  const loseColor = "#f44336"; // Red color for losing message

  const winUI = `
        <div class="modal" style="color: ${winColor};">
            <h1>You Won!</h1>
        </div>
    `;

  const loseUI = `
        <div class="modal" style="color: ${loseColor};">
            <h1>You Lost!</h1>
        </div>
    `;

  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  backdrop.innerHTML = isWinner ? winUI : loseUI;
  document.body.appendChild(backdrop);
}
