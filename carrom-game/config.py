# Game Configuration and Constants

# Window Settings
WINDOW_WIDTH = 1000
WINDOW_HEIGHT = 800
WINDOW_TITLE = "2D Carrom Game"
FPS = 60

# Colors
COLOR_BOARD = (220, 180, 100)  # Light brown
COLOR_BORDER = (80, 40, 20)     # Dark brown
COLOR_POCKET = (30, 30, 30)     # Black
COLOR_WHITE = (255, 255, 255)   # White
COLOR_BLACK = (50, 50, 50)      # Dark gray/black
COLOR_RED = (255, 0, 0)         # Red (queen)
COLOR_TEXT = (0, 0, 0)          # Black text
COLOR_PLAYER1 = (100, 200, 255) # Light blue
COLOR_PLAYER2 = (255, 150, 100) # Light orange

# Board Settings
BOARD_WIDTH = 900
BOARD_HEIGHT = 700
BOARD_X = 50
BOARD_Y = 50
BORDER_WIDTH = 30

# Physics
FRICTION = 0.98
STRIKER_MASS = 1.0
COIN_MASS = 0.5
MAX_VELOCITY = 15
MIN_VELOCITY = 0.1

# Game Objects
STRIKER_RADIUS = 8
COIN_RADIUS = 6
POCKET_RADIUS = 15

# Scoring
COIN_POINTS = 1
QUEEN_POINTS = 3
WIN_SCORE = 5

# Game Settings
STRIKER_COLOR = COLOR_WHITE
COIN_COLOR = COLOR_BLACK
QUEEN_COLOR = COLOR_RED

# Pocket Positions (corners)
POCKETS = [
    (BOARD_X + BORDER_WIDTH, BOARD_Y + BORDER_WIDTH),           # Top-left
    (BOARD_X + BOARD_WIDTH - BORDER_WIDTH, BOARD_Y + BORDER_WIDTH),  # Top-right
    (BOARD_X + BORDER_WIDTH, BOARD_Y + BOARD_HEIGHT - BORDER_WIDTH),      # Bottom-left
    (BOARD_X + BOARD_WIDTH - BORDER_WIDTH, BOARD_Y + BOARD_HEIGHT - BORDER_WIDTH)  # Bottom-right
]

# Center positions for coins setup
BOARD_CENTER_X = BOARD_X + BOARD_WIDTH / 2
BOARD_CENTER_Y = BOARD_Y + BOARD_HEIGHT / 2

# Striker starting position
STRIKER_START_X = BOARD_CENTER_X
STRIKER_START_Y = BOARD_Y + BOARD_HEIGHT - 80
