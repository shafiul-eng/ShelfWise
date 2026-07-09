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
# Clone the repository
git clone https://github.com/shafiul-eng/carrom-game.git
cd carrom-game

# Install dependencies
pip install -r requirements.txt
```

## How to Play

1. Run the game:
```bash
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
   - If you pocket the red queen coin, you get bonus points

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

### Module Descriptions

- **main.py**: Entry point that launches the game
- **game.py**: Contains `CarromGame` class managing game state, turns, scoring, and turn-based logic
- **sprites.py**: Contains `Coin`, `Striker`, and `Board` classes for game objects
- **physics.py**: Vector math, friction, collision detection, and physics calculations
- **config.py**: All game constants (colors, sizes, physics parameters)

## Game States

1. **Aiming**: Click and drag to aim the striker
2. **Striking**: Release to hit coins
3. **Moving**: Objects move with physics simulation
4. **Turn End**: All objects stop, turn switches to next player
5. **Game Over**: When a player reaches 5 points

## Customization

Edit `config.py` to customize:
- Board size and colors
- Physics parameters (friction, velocity limits)
- Game rules (winning score, coin points)
- Object sizes

## Future Enhancements

- [ ] AI opponent
- [ ] Sound effects and music
- [ ] Animation improvements
- [ ] Difficulty levels
- [ ] Multiplayer online
- [ ] Better graphics and sprites
- [ ] Power meter visualization
- [ ] Statistics and leaderboards

## Physics Explanation

The game implements simplified 2D physics:

- **Friction**: Each frame, velocities are multiplied by a friction factor (0.98)
- **Collisions**: When objects collide, velocities are exchanged based on mass and direction
- **Wall Bouncing**: Objects reverse velocity component perpendicular to wall
- **Stopping**: Objects stop when velocity falls below minimum threshold

## License

MIT License - Feel free to modify and distribute

## Author

Created with ❤️ by shafiul-eng

## Support

If you encounter any issues or have suggestions, please create an issue on GitHub.
