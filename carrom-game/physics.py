# Physics Engine for Carrom Game

import math
from config import *

class Vector2:
    """Simple 2D vector class"""
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Vector2(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        return Vector2(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        return Vector2(self.x * scalar, self.y * scalar)
    
    def length(self):
        return math.sqrt(self.x ** 2 + self.y ** 2)
    
    def normalize(self):
        length = self.length()
        if length > 0:
            return Vector2(self.x / length, self.y / length)
        return Vector2(0, 0)
    
    def distance_to(self, other):
        dx = self.x - other.x
        dy = self.y - other.y
        return math.sqrt(dx ** 2 + dy ** 2)
    
    def copy(self):
        return Vector2(self.x, self.y)


def apply_friction(velocity, friction=FRICTION):
    """Apply friction to velocity"""
    length = velocity.length()
    if length < MIN_VELOCITY:
        return Vector2(0, 0)
    
    new_velocity = velocity * friction
    if new_velocity.length() < MIN_VELOCITY:
        return Vector2(0, 0)
    
    return new_velocity


def handle_wall_collision(pos, velocity, radius):
    """Handle collision with board walls"""
    board_left = BOARD_X + BORDER_WIDTH
    board_right = BOARD_X + BOARD_WIDTH - BORDER_WIDTH
    board_top = BOARD_Y + BORDER_WIDTH
    board_bottom = BOARD_Y + BOARD_HEIGHT - BORDER_WIDTH
    
    # Left wall
    if pos.x - radius < board_left:
        pos.x = board_left + radius
        velocity.x = abs(velocity.x) * 0.8
    
    # Right wall
    if pos.x + radius > board_right:
        pos.x = board_right - radius
        velocity.x = -abs(velocity.x) * 0.8
    
    # Top wall
    if pos.y - radius < board_top:
        pos.y = board_top + radius
        velocity.y = abs(velocity.y) * 0.8
    
    # Bottom wall
    if pos.y + radius > board_bottom:
        pos.y = board_bottom - radius
        velocity.y = -abs(velocity.y) * 0.8
    
    return pos, velocity


def check_pocket_collision(pos, radius):
    """Check if object fell into a pocket"""
    for pocket in POCKETS:
        distance = pos.distance_to(Vector2(pocket[0], pocket[1]))
        if distance < POCKET_RADIUS:
            return True
    return False


def handle_object_collision(obj1_pos, obj1_vel, obj1_radius, obj1_mass,
                            obj2_pos, obj2_vel, obj2_radius, obj2_mass):
    """
    Handle collision between two objects using simple physics
    Returns new velocities for both objects
    """
    # Vector from obj1 to obj2
    collision_normal = obj2_pos - obj1_pos
    distance = collision_normal.length()
    
    # Check if collision occurred
    if distance >= obj1_radius + obj2_radius or distance == 0:
        return obj1_vel, obj2_vel
    
    # Normalize collision vector
    collision_normal = collision_normal.normalize()
    
    # Relative velocity
    rel_velocity = obj1_vel - obj2_vel
    
    # Relative velocity along collision normal
    vel_along_normal = rel_velocity.x * collision_normal.x + rel_velocity.y * collision_normal.y
    
    # Do not resolve if velocities are separating
    if vel_along_normal >= 0:
        return obj1_vel, obj2_vel
    
    # Calculate restitution (bounce)
    restitution = 0.7
    
    # Calculate impulse
    j = -(1 + restitution) * vel_along_normal
    j /= (1 / obj1_mass + 1 / obj2_mass)
    
    # Apply impulse
    impulse = collision_normal * j
    
    obj1_vel = obj1_vel + (impulse * (1 / obj1_mass)) * -1
    obj2_vel = obj2_vel + impulse * (1 / obj2_mass)
    
    return obj1_vel, obj2_vel


def update_position(pos, velocity, delta_time=1.0):
    """Update object position based on velocity"""
    pos = pos + (velocity * delta_time)
    return pos
