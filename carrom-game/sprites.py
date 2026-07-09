# Game Sprites and Objects

import pygame
from physics import Vector2, apply_friction, handle_wall_collision, check_pocket_collision
from config import *


class Coin:
    """Represents a coin on the board"""
    def __init__(self, x, y, is_queen=False):
        self.pos = Vector2(x, y)
        self.velocity = Vector2(0, 0)
        self.radius = COIN_RADIUS
        self.is_queen = is_queen
        self.color = QUEEN_COLOR if is_queen else COIN_COLOR
        self.mass = COIN_MASS
        self.pocketed = False
    
    def update(self):
        """Update coin position and apply physics"""
        if self.pocketed:
            return
        
        # Apply friction
        self.velocity = apply_friction(self.velocity)
        
        # Update position
        self.pos = self.pos + self.velocity
        
        # Handle wall collisions
        self.pos, self.velocity = handle_wall_collision(self.pos, self.velocity, self.radius)
        
        # Check if pocketed
        if check_pocket_collision(self.pos, self.radius):
            self.pocketed = True
    
    def draw(self, surface):
        """Draw coin on surface"""
        if not self.pocketed:
            pygame.draw.circle(surface, self.color, (int(self.pos.x), int(self.pos.y)), self.radius)
            # Draw border
            pygame.draw.circle(surface, COLOR_BORDER, (int(self.pos.x), int(self.pos.y)), self.radius, 2)
    
    def has_stopped(self):
        """Check if coin has stopped moving"""
        return self.velocity.length() < MIN_VELOCITY
    
    def get_points(self):
        """Get points for pocketing this coin"""
        return QUEEN_POINTS if self.is_queen else COIN_POINTS


class Striker:
    """Represents the striker (hitting piece)"""
    def __init__(self, x, y):
        self.pos = Vector2(x, y)
        self.velocity = Vector2(0, 0)
        self.radius = STRIKER_RADIUS
        self.color = STRIKER_COLOR
        self.mass = STRIKER_MASS
        self.pocketed = False
    
    def update(self):
        """Update striker position"""
        if self.pocketed:
            return
        
        # Apply friction
        self.velocity = apply_friction(self.velocity)
        
        # Update position
        self.pos = self.pos + self.velocity
        
        # Handle wall collisions
        self.pos, self.velocity = handle_wall_collision(self.pos, self.velocity, self.radius)
        
        # Check if pocketed (shouldn't normally happen but just in case)
        if check_pocket_collision(self.pos, self.radius):
            self.pocketed = True
    
    def draw(self, surface):
        """Draw striker on surface"""
        if not self.pocketed:
            pygame.draw.circle(surface, self.color, (int(self.pos.x), int(self.pos.y)), self.radius)
            pygame.draw.circle(surface, COLOR_BORDER, (int(self.pos.x), int(self.pos.y)), self.radius, 2)
    
    def has_stopped(self):
        """Check if striker has stopped moving"""
        return self.velocity.length() < MIN_VELOCITY
    
    def reset(self):
        """Reset striker to starting position"""
        self.pos = Vector2(STRIKER_START_X, STRIKER_START_Y)
        self.velocity = Vector2(0, 0)
        self.pocketed = False
    
    def hit(self, target_pos, power):
        """Hit the striker towards target position"""
        direction = (target_pos - self.pos).normalize()
        self.velocity = direction * power


class Board:
    """Represents the carrom board"""
    def __init__(self):
        self.coins = []
        self.striker = None
        self.setup_board()
    
    def setup_board(self):
        """Initialize coins and striker"""
        # Create striker
        self.striker = Striker(STRIKER_START_X, STRIKER_START_Y)
        
        # Create coins in a triangle formation
        self.coins = []
        
        # Red queen in center
        self.coins.append(Coin(BOARD_CENTER_X, BOARD_CENTER_Y, is_queen=True))
        
        # Create regular coins around the queen
        num_rows = 4
        for row in range(num_rows):
            for col in range(row + 1):
                x = BOARD_CENTER_X - (row * COIN_RADIUS * 2.5) + (col * COIN_RADIUS * 2.5)
                y = BOARD_CENTER_Y - 60 + (row * COIN_RADIUS * 2.2)
                
                # Don't place on queen
                if abs(x - BOARD_CENTER_X) > 15 or abs(y - BOARD_CENTER_Y) > 15:
                    self.coins.append(Coin(x, y, is_queen=False))
    
    def draw(self, surface):
        """Draw the board"""
        # Draw board background
        board_rect = pygame.Rect(BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT)
        pygame.draw.rect(surface, COLOR_BOARD, board_rect)
        
        # Draw border
        pygame.draw.rect(surface, COLOR_BORDER, board_rect, BORDER_WIDTH)
        
        # Draw pockets
        for pocket in POCKETS:
            pygame.draw.circle(surface, COLOR_POCKET, pocket, POCKET_RADIUS)
        
        # Draw coins
        for coin in self.coins:
            coin.draw(surface)
        
        # Draw striker
        self.striker.draw(surface)
    
    def update(self):
        """Update all game objects"""
        self.striker.update()
        for coin in self.coins:
            coin.update()
    
    def get_all_stopped(self):
        """Check if all objects have stopped moving"""
        if not self.striker.has_stopped():
            return False
        
        for coin in self.coins:
            if not coin.pocketed and not coin.has_stopped():
                return False
        
        return True
    
    def reset(self):
        """Reset the board"""
        self.setup_board()
