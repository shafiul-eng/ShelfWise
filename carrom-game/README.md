# 2D Carrom Game

A Python-based 2D Carrom game built with Pygame featuring realistic physics, scoring system, and 2-player gameplay.

## Features

- 🎯 Interactive carrom board with physics simulation
- 👥 2-player turn-based gameplay
- 💫 Realistic coin movement with friction
- 🏆 Scoring system
- 🎮 Easy-to-use controls
- 🔄 Game reset functionality

## Requirements

- Python 3.7+
- Pygame

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

## How to Play

1. Run the game:
```bash
cd carrom-game
python main.py
```

2. **Controls:**
   - **Move mouse** to position the aim line
   - **Click and drag** to set the power/direction
   - **Release** to hit the striker
   - **Press SPACE** to reset the game

3. **Game Rules:**
   - Players take turns hitting the striker
   - Pocket coins to score points
   - Regular coins = 1 point
   - Red queen (center) = 3 points
   - First player to 5 coins wins!

## Game Mechanics

### Pieces
- **Striker**: The white circle you control (larger)
- **Coins**: Regular coins (black circles) worth 1 point each
- **Red Queen**: Special coin in the center worth 3 points

### Physics
- **Friction**: Coins and striker slow down realistically as they move
- **Collisions**: Coins collide with walls and each other
- **Pockets**: Corners of the board - pocket coins to score
- **Board Boundaries**: Coins bounce off walls with energy loss

## File Structure

```
carrom-game/
├── main.py              # Main game entry point
├── game.py              # Game logic and state management
├── sprites.py           # Game objects (coins, striker, board)
├── physics.py           # Physics calculations and collisions
├── config.py            # Game configuration and constants
├── requirements.txt     # Dependencies
└── README.md           # This file
```

## Customization

Edit `config.py` to customize:
- Board size and colors
- Physics parameters (friction, velocity limits)
- Game rules (winning score, coin points)
- Object sizes

## Future Enhancements

- [ ] AI opponent
- [ ] Sound effects and music
- [ ] Better graphics
- [ ] Difficulty levels
- [ ] Statistics and leaderboards

## License

MIT License

## Author

Created with ❤️ by shafiul-eng
