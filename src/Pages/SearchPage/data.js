import minesweeper from '../../assets/image/minesweeper.jpg'
import chess from '../../assets/image/chess.jpg'
import caro from '../../assets/image/caro.jpg'
import fastfinger from '../../assets/image/fastfinger.jpg'
import snake from '../../assets/image/snake.jpg'
import memorygame from '../../assets/image/memorygame.jpg'
import sudoku from '../../assets/image/sudoku.jpg'
import wordle from '../../assets/image/wordle.jpg'

export const games = [
    {
        "id": 1,
        "name": "Minesweeper",
        "description": "Use logic to uncover all the safe tiles and flag hidden mines. A classic puzzle game that challenges your deduction skills.",
        "source": minesweeper,
        "category": "Puzzle",
        "tags": ["time", "brain", "skill", "offline"]
    },
    {
        "id": 2,
        "name": "Chess",
        "description": "Play the timeless strategy game of kings. Outsmart your opponent with clever tactics and sharp planning in this two-player classic.",
        "source": chess,
        "category": "Board",
        "tags": ["multiplayer", "competitive", "brain", "offline", "online", "time"]
    },
    {
        "id": 3,
        "name": "Sudoku",
        "description": "A logic-based number placement game. Fill in the 9x9 grid so each column, row, and 3x3 box contains all digits from 1 to 9.",
        "source": sudoku,
        "category": "Puzzle",
        "tags": ["brain", "relaxing", "offline", "time"]
    },
    {
        "id": 4,
        "name": "Wordle",
        "description": "Guess the secret 5-letter word in six attempts. Every guess gives you clues—can you crack the code before your chances run out?",
        "source": wordle,
        "category": "Word",
        "tags": ["brain", "simple", "keyboard", "relaxing", "offline"]
    },
    {
        "id": 5,
        "name": "FastFinger",
        "description": "How fast can you react? Put your typing speed and accuracy to the test in this adrenaline-pumping reflex game.",
        "source": fastfinger,
        "category": "Arcade",
        "tags": ["keyboard", "time", "skill", "offline"]
    },
    {
        "id": 6,
        "name": "SnakeGame",
        "description": "Guide the snake to collect food and grow longer, but be careful not to crash into yourself or the wall. A retro arcade classic!",
        "source": snake,
        "category": "Arcade",
        "tags": ["relaxing", "offline", "simple"]
    },
    {
        "id": 7,
        "name": "Caro",
        "description": "A quick and fun game for two players. Take turns placing Xs and Os on a 3x3 grid—be the first to make a line!",
        "source": caro,
        "category": "Board",
        "tags": ["skill", "time", "brain", "competitive", "multiplayer", "online", "offline"]
    },
    {
        "id": 8,
        "name": "MemoryGame",
        "description": "Flip cards and find matching pairs. Sharpen your memory as you try to remember the location of each symbol or image.",
        "source": memorygame,
        "category": "Educational",
        "tags": ["brain", "time", "simple", "offline"]
    }
];
