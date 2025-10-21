import Grid from './components/grid.js';
import { createTile } from './components/tile.js';

const GRID_CONTAINER = document.querySelector('.grid-container');
const SCORE_EL = document.getElementById('score');
const BEST_SCORE_EL = document.getElementById('best');
const RESTART_BTN = document.getElementById('restart');
const UNDO_BTN = document.getElementById('undo-btn');

let board = new Array(16).fill(0);
let score = 0;
let bestScore = Number(localStorage.getItem('bestScore')) || 0;

function setupBoardDOM() {
	GRID_CONTAINER.innerHTML = '';
	GRID_CONTAINER.appendChild(Grid());

	const cells = GRID_CONTAINER.querySelectorAll('.cell');
	cells.forEach(cell => {
		cell.style.position = 'relative';
	});
}

function render() {
	SCORE_EL.textContent = String(score);
	BEST_SCORE_EL.textContent = String(Math.max(bestScore, score));
	const cells = GRID_CONTAINER.querySelectorAll('.cell');
	cells.forEach((cell, idx) => {
		const existing = cell.querySelectorAll('.tile');
		existing.forEach(n => n.remove());

		const value = board[idx];
		if (value !== 0) {
			const tile = createTile(value);
			tile.style.position = 'absolute';
			tile.style.top = '0';
			tile.style.left = '0';
			tile.style.width = '100%';
			tile.style.height = '100%';
			cell.appendChild(tile);
		}
	});
}

function randomEmptyIndex() {
	const empties = board.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
	if (empties.length === 0) return -1;
	return empties[Math.floor(Math.random() * empties.length)];
}

function spawnRandom() {
	const idx = randomEmptyIndex();
	if (idx === -1) return false;
	board[idx] = Math.random() < 0.9 ? 2 : 4;
	return true;
}

function rotateLeft(b) {
	const out = new Array(16);
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			out[(3 - c) * 4 + r] = b[r * 4 + c];
		}
	}
	return out;
}

function rotateRight(b) {
	const out = new Array(16);
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			out[c * 4 + (3 - r)] = b[r * 4 + c];
		}
	}
	return out;
}

function slideAndMergeRow(row) {
	const newRow = row.filter(v => v !== 0);
	let gained = 0;
	for (let i = 0; i < newRow.length - 1; i++) {
		if (newRow[i] === newRow[i + 1]) {
			newRow[i] = newRow[i] * 2;
			gained += newRow[i];
			newRow.splice(i + 1, 1);
		}
	}
	while (newRow.length < 4) newRow.push(0);
	return { row: newRow, gained };
}

function moveLeft(b) {
	let moved = false;
	let gained = 0;
	const out = new Array(16);
	for (let r = 0; r < 4; r++) {
		const row = b.slice(r * 4, r * 4 + 4);
		const { row: newRow, gained: g } = slideAndMergeRow(row);
		gained += g;
		for (let c = 0; c < 4; c++) {
			out[r * 4 + c] = newRow[c];
			if (out[r * 4 + c] !== b[r * 4 + c]) moved = true;
		}
	}
	return { board: out, moved, gained };
}

function undoMove() {
	const previousState = JSON.parse(localStorage.getItem('previousState'));
	if (previousState && previousState.board && previousState.score !== undefined) {
		board = previousState.board;
		score = previousState.score;
		render();
		return true;
	}
	return false;
}

function saveCurrentState() {
	const currentState = {
		board: board.slice(),
		score: score
	};
	localStorage.setItem('previousState', JSON.stringify(currentState));
}

function move(direction) {
	let worked = { board: board.slice(), moved: false, gained: 0 };
	if (direction === 'left') {
		worked = moveLeft(board);
	} else if (direction === 'right') {
		const rev = board.slice();
		for (let r = 0; r < 4; r++) {
			rev.splice(r * 4, 4, ...rev.slice(r * 4, r * 4 + 4).reverse());
		}
		const { board: movedBoard, moved, gained } = moveLeft(rev);
		const out = movedBoard.slice();
		for (let r = 0; r < 4; r++) {
			out.splice(r * 4, 4, ...movedBoard.slice(r * 4, r * 4 + 4).reverse());
		}
		worked = { board: out, moved, gained };
	} else if (direction === 'up') {
		const rotated = rotateLeft(board);
		const { board: movedBoard, moved, gained } = moveLeft(rotated);
		const out = rotateRight(movedBoard);
		worked = { board: out, moved, gained };
	} else if (direction === 'down') {
		const rotated = rotateRight(board);
		const { board: movedBoard, moved, gained } = moveLeft(rotated);
		const out = rotateLeft(movedBoard);
		worked = { board: out, moved, gained };
	}
	if (worked.moved) {
		saveCurrentState();
		board = worked.board;
		score += worked.gained;
		bestScore = Math.max(bestScore, score);
		localStorage.setItem('bestScore', bestScore);
		spawnRandom();
		render();
	}
	return worked.moved;
}

function hasMoves(b) {
	if (b.some(v => v === 0)) return true;
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 3; c++) {
			if (b[r * 4 + c] === b[r * 4 + c + 1]) return true;
		}
	}
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 3; r++) {
			if (b[r * 4 + c] === b[(r + 1) * 4 + c]) return true;
		}
	}
	return false;
}

function checkWin(b) {
	return b.some(v => v === 2048);
}

function startGame() {
	board = new Array(16).fill(0);
	score = 0;
	setupBoardDOM();
	spawnRandom();
	spawnRandom();
	render();
}

window.addEventListener('keydown', (e) => {
	const key = e.key;
	let dir = null;
	if (key === 'ArrowLeft') dir = 'left';
	else if (key === 'ArrowRight') dir = 'right';
	else if (key === 'ArrowUp') dir = 'up';
	else if (key === 'ArrowDown') dir = 'down';
	if (dir) {
		e.preventDefault();
		const moved = move(dir);
		if (moved) {
			if (checkWin(board) && localStorage.getItem('hasWon2048') !== 'true') {
				localStorage.setItem('hasWon2048', 'true');
				let overlay = document.createElement('div');
				overlay.classList.add('overlay');

				let message = document.createElement('div');
				message.textContent = 'You Win!';
				message.classList.add('message');

				overlay.appendChild(message);

				GRID_CONTAINER.classList.add('blurred');
				document.body.appendChild(overlay);

				overlay.addEventListener('click', () => {
					document.body.removeChild(overlay);
					GRID_CONTAINER.classList.remove('blurred');
				});
			} else if (!hasMoves(board)) {
				let overlay = document.createElement('div');
				overlay.classList.add('overlay');

				let message = document.createElement('div');
				message.textContent = 'Game Over!';
				message.classList.add('message');

				overlay.appendChild(message);

				GRID_CONTAINER.classList.add('blurred');
				document.body.appendChild(overlay);

				overlay.addEventListener('click', () => {
					document.body.removeChild(overlay);
					GRID_CONTAINER.classList.remove('blurred');
				});
			}
		}
	}
});

let touchStartX = null;
let touchStartY = null;
window.addEventListener('touchstart', (e) => {
	const t = e.changedTouches[0];
	touchStartX = t.clientX;
	touchStartY = t.clientY;
}, { passive: true });
window.addEventListener('touchend', (e) => {
	const t = e.changedTouches[0];
	const dx = t.clientX - touchStartX;
	const dy = t.clientY - touchStartY;
	if (Math.abs(dx) > Math.abs(dy)) {
		if (dx > 30) move('right');
		else if (dx < -30) move('left');
	} else {
		if (dy > 30) move('down');
		else if (dy < -30) move('up');
	}
});

RESTART_BTN.addEventListener('click', () => {
	localStorage.setItem('hasWon2048', 'false');
	startGame();
});

UNDO_BTN.addEventListener('click', () => {
	localStorage.setItem('hasWon2048', 'false');
	undoMove();
});

document.addEventListener('DOMContentLoaded', () => {
	localStorage.setItem('hasWon2048', 'false');
	startGame();
});
