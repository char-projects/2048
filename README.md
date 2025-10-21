A prettier version of 2048
=====================================

A browser-based implementation of the popular 2048 puzzle game built with HTML, CSS, and JavaScript

### Game Overview

2048 is a sliding tile puzzle game where players combine numbered tiles to reach the target tile of 2048. The game is played on a 4×4 grid, and with every move, a new tile (either 2 or 4) appears in a random empty spot on the board. It starts with two tiles randomly placed on the grid.

### Controls

Players use the keyboard arrow keys to slide all tiles in one of four directions:
- **Up Arrow** (↑): Slide all tiles upward
- **Down Arrow** (↓): Slide all tiles downward  
- **Left Arrow** (←): Slide all tiles to the left
- **Right Arrow** (→): Slide all tiles to the right

### Game Logic

When tiles move, they slide as far as possible in the chosen direction until they reach the edge of the grid or collide with another tile. If two tiles with the same number collide during a move, they merge into one tile with a value equal to their sum (e.g., 2 + 2 = 4, 4 + 4 = 8, etc.). Each merge contributes to the player's score.

After every valid move (one that changes the board state), a new tile with a value of 2 (90% probability) or 4 (10% probability) spawns in a random empty cell.

### Objective

The primary goal is to create a tile with the value of **2048** by strategically merging tiles. However, players can continue beyond 2048 to achieve even higher scores. The game ends when no valid moves remain—when the grid is full and no adjacent tiles can be merged.

### Strategy Tips

Success requires planning ahead and maintaining open spaces. My favorite strategy is the snake strategy, where the highest-value tile is kept in the bottom-right corner of the grid. Then, you arrange the next highest tiles to the left of it, continuing in a snake-like pattern starting from the bottom row, then up to the next one (this time filling it from left to right), and so on.

### Clone the project:
```bash
git clone https://github.com/char-projects/2048.git
cd 2048
```

### Options to run it:
- Python 3 built-in server (works cross-platform):

```bash
cd /path/to/2048
python3 -m http.server 8000
# open http://localhost:8000/ex00/index.html
```

- Node (npx http-server):

```bash
cd /path/to/2048
npx http-server -p 8000
# open http://localhost:8000/ex00/index.html
```

- VS Code Live Server: right-click `ex00/index.html` → "Open with Live Server".
