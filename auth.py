from sanic import Blueprint, json
from sanic.exceptions import SanicException
from sanic.log import logger
import bcrypt
import jwt
import asyncpg
import re
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", url_prefix="/api/auth")  # Changed from "/auth"

# --------------------------
# Validation Utilities
# --------------------------
def validate_email(email: str) -> bool:
    """Validate email format using regex"""
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email))

def validate_password_complexity(password: str) -> bool:
    """Ensure password meets complexity requirements"""
    return len(password) >= 8 and any(c.isupper() for c in password)

# --------------------------
# JWT Operations
# --------------------------
def create_jwt_token(user_id: int, config: dict) -> str:
    """Generate JWT token with expiration"""
    return jwt.encode(
        {
            'sub': user_id,
            'exp': datetime.utcnow() + timedelta(hours=config.JWT_EXPIRATION)
        },
        config.JWT_SECRET,
        algorithm='HS256'
    )

# --------------------------
# Authentication Endpoints
# --------------------------
@auth_bp.post('/register')
async def register_user(request):
    """User registration endpoint"""
    data = request.json
    required_fields = ['firstName', 'lastName', 'email', 'password', 'phone', 'birthDate', 'gender']
    
    # Validate input
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        raise SanicException(f"Missing fields: {', '.join(missing)}", status_code=400)
    
    if not validate_email(data['email']):
        raise SanicException("Invalid email format", status_code=400)
    
    if not validate_password_complexity(data['password']):
        raise SanicException("Password must be at least 8 characters with one uppercase letter", status_code=400)
    
    try:
        # Hash password
        hashed_pw = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()
        
        async with request.app.ctx.pool.acquire() as conn:
            user = await conn.fetchrow(
                """
                INSERT INTO users (
                    first_name, last_name, email, password_hash,
                    phone, birth_date, gender
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, email, first_name, last_name, is_admin
                """,
                data['firstName'],
                data['lastName'],
                data['email'].lower(),
                hashed_pw,
                data['phone'],
                datetime.strptime(data['birthDate'], '%Y-%m-%d').date(),
                data['gender']
            )
            
        return json({
            'success': True,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'firstName': user['first_name'],
                'lastName': user['last_name']
            }
        }, status=201)
        
    except asyncpg.UniqueViolationError:
        raise SanicException("Email already exists", status_code=409)
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise SanicException("Internal server error", status_code=500)

@auth_bp.post('/login')
async def authenticate_user(request):
    """User login endpoint"""
    data = request.json
    
    if not data or 'email' not in data or 'password' not in data:
        raise SanicException("Email and password required", status_code=400)
    
    try:
        async with request.app.ctx.pool.acquire() as conn:
            user = await conn.fetchrow(
                "SELECT id, password_hash, first_name, last_name, is_admin FROM users WHERE email = $1",
                data['email'].lower()
            )
        
        if not user or not bcrypt.checkpw(data['password'].encode(), user['password_hash'].encode()):
            raise SanicException("Invalid credentials", status_code=401)
            
        token = create_jwt_token(user['id'], request.app.config)
        
        return json({
            'access_token': token,
            'user': {
                'id': user['id'],
                'firstName': user['first_name'],
                'lastName': user['last_name'],
                'isAdmin': user['is_admin']
            }
        })
        
    except SanicException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise SanicException("Authentication failed", status_code=500)

@auth_bp.post('/logout')
async def revoke_token(request):
    """Enhanced logout endpoint"""
    # If using JWT blacklist, add token to blacklist here
    # Example: await add_to_blacklist(request.token)
    
    return json(
        {'message': 'Logout successful'}, 
        headers={
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store'
        }
    )