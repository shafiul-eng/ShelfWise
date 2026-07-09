#!/usr/bin/env python3
"""
2D Carrom Game
A Python-based carrom game built with Pygame featuring realistic physics,
scoring system, and 2-player turn-based gameplay.

Run this file to start the game.
"""

from game import CarromGame


def main():
    """Main entry point"""
    game = CarromGame()
    game.run()


if __name__ == "__main__":
    main()
