# Main Game Logic

import pygame
import math
from config import *
from sprites import Board, Coin, Striker
from physics import Vector2, handle_object_collision, COIN_MASS, STRIKER_MASS


class CarromGame:
    """Main game class"""
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption(WINDOW_TITLE)
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        
        # Game state
        self.board = Board()
        self.player1_score = 0
        self.player2_score = 0
        self.current_player = 1
        self.game_over = False
        self.winner = None
        
        # Aiming state
        self.is_aiming = False
        self.aim_start_pos = None
        self.aim_end_pos = None
        self.power = 0
        
        # Turn state
        self.turn_active = False
        self.all_stopped_time = 0
        self.pocketed_coins_this_turn = []
    
    def handle_events(self):
        """Handle user input and window events"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            if event.type == pygame.MOUSEBUTTONDOWN:
                if not self.game_over and not self.turn_active:
                    self.is_aiming = True
                    self.aim_start_pos = Vector2(event.pos[0], event.pos[1])
                    self.aim_end_pos = Vector2(event.pos[0], event.pos[1])
            
            if event.type == pygame.MOUSEMOTION:
                if self.is_aiming:
                    self.aim_end_pos = Vector2(event.pos[0], event.pos[1])
            
            if event.type == pygame.MOUSEBUTTONUP:
                if self.is_aiming:
                    self.is_aiming = False
                    self.execute_strike()
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.reset_game()
        
        return True
    
    def execute_strike(self):
        """Execute the strike based on aim direction and power"""
        if self.aim_start_pos is None or self.aim_end_pos is None:
            return
        
        # Calculate direction
        direction = self.aim_end_pos - self.aim_start_pos
        power = min(direction.length() / 10, MAX_VELOCITY)
        
        if power > 0.5:  # Minimum power to strike
            self.board.striker.hit(self.aim_start_pos + direction, power)
            self.turn_active = True
            self.pocketed_coins_this_turn = []
            self.all_stopped_time = 0
    
    def update(self):
        """Update game state"""
        if self.game_over:
            return
        
        # Update board
        self.board.update()
        
        # Check collisions between striker and coins
        self.check_collisions()
        
        # Check for pocketed coins
        self.check_pocketed_coins()
        
        # Check if all objects have stopped
        if self.turn_active and self.board.get_all_stopped():
            self.all_stopped_time += 1
            
            if self.all_stopped_time > 30:  # Wait 30 frames after stopping
                self.end_turn()
    
    def check_collisions(self):
        """Check and handle collisions between striker and coins"""
        striker = self.board.striker
        
        for coin in self.board.coins:
            if coin.pocketed:
                continue
            
            # Check distance
            distance = striker.pos.distance_to(coin.pos)
            if distance < striker.radius + coin.radius:
                # Collision detected
                striker.velocity, coin.velocity = handle_object_collision(
                    striker.pos, striker.velocity, striker.radius, STRIKER_MASS,
                    coin.pos, coin.velocity, coin.radius, COIN_MASS
                )
    
    def check_pocketed_coins(self):
        """Check for pocketed coins and update score"""
        for coin in self.board.coins:
            if coin.pocketed and coin not in self.pocketed_coins_this_turn:
                self.pocketed_coins_this_turn.append(coin)
                points = coin.get_points()
                
                if self.current_player == 1:
                    self.player1_score += points
                else:
                    self.player2_score += points
                
                # Check win condition
                if self.current_player == 1 and self.player1_score >= WIN_SCORE:
                    self.game_over = True
                    self.winner = 1
                elif self.current_player == 2 and self.player2_score >= WIN_SCORE:
                    self.game_over = True
                    self.winner = 2
    
    def end_turn(self):
        """End current turn and switch player"""
        self.turn_active = False
        
        # Switch player
        self.current_player = 2 if self.current_player == 1 else 1
        
        # Reset striker position for next turn
        self.board.striker.reset()
    
    def reset_game(self):
        """Reset the entire game"""
        self.board.reset()
        self.player1_score = 0
        self.player2_score = 0
        self.current_player = 1
        self.game_over = False
        self.winner = None
        self.turn_active = False
        self.is_aiming = False
        self.pocketed_coins_this_turn = []
    
    def draw(self):
        """Draw everything"""
        self.screen.fill(COLOR_WHITE)
        
        # Draw board
        self.board.draw(self.screen)
        
        # Draw aiming line
        if self.is_aiming and self.aim_start_pos and self.aim_end_pos:
            pygame.draw.line(
                self.screen,
                COLOR_TEXT,
                (int(self.aim_start_pos.x), int(self.aim_start_pos.y)),
                (int(self.aim_end_pos.x), int(self.aim_end_pos.y)),
                2
            )
        
        # Draw UI
        self.draw_ui()
        
        pygame.display.flip()
    
    def draw_ui(self):
        """Draw user interface"""
        # Scores
        score_text = f"P1: {self.player1_score}  |  P2: {self.player2_score}"
        score_surf = self.font.render(score_text, True, COLOR_TEXT)
        self.screen.blit(score_surf, (20, 10))
        
        # Current player
        if not self.game_over:
            player_color = COLOR_PLAYER1 if self.current_player == 1 else COLOR_PLAYER2
            player_text = f"Player {self.current_player}'s Turn"
            player_surf = self.font.render(player_text, True, player_color)
            self.screen.blit(player_surf, (WINDOW_WIDTH - 300, 10))
        
        # Game over message
        if self.game_over:
            winner_text = f"Player {self.winner} Wins! Press SPACE to restart"
            winner_surf = self.font.render(winner_text, True, COLOR_RED)
            text_rect = winner_surf.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
            
            # Draw semi-transparent background
            s = pygame.Surface((WINDOW_WIDTH, 100))
            s.set_alpha(200)
            s.fill(COLOR_WHITE)
            self.screen.blit(s, (0, WINDOW_HEIGHT // 2 - 50))
            
            self.screen.blit(winner_surf, text_rect)
        
        # Instructions
        if not self.turn_active:
            inst_text = "Click and drag to aim, release to hit. Press SPACE to reset."
            inst_surf = self.small_font.render(inst_text, True, (100, 100, 100))
            self.screen.blit(inst_surf, (20, WINDOW_HEIGHT - 30))
    
    def run(self):
        """Main game loop"""
        running = True
        
        while running:
            running = self.handle_events()
            
            self.update()
            self.draw()
            
            self.clock.tick(FPS)
        
        pygame.quit()
