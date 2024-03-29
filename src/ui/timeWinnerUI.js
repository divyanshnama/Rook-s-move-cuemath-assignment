export default function timeWinnerUI(isWinner) {
  if (isWinner) {
    return `
		<div class="modal">
			<h1>You Won On Time !</h1>
		</div>
		`;
  }
  return `
	<div class="modal">
		<h1>You Lost On Time !</h1>
	</div>
	`;
}
