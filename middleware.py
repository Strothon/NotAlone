from functools import wraps
from sanic.response import json
import jwt

def auth_required(f):
    @wraps(f)
    async def decorated_function(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return json({'message': 'Missing authentication token'}, status=401)
            
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(
                token,
                request.app.config.SECRET_KEY,
                algorithms=['HS256']
            )
            request.ctx.user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return json({'message': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return json({'message': 'Invalid token'}, status=401)
            
        return await f(request, *args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    async def decorated_function(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return json({'message': 'Missing authentication token'}, status=401)
            
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(
                token,
                request.app.config.SECRET_KEY,
                algorithms=['HS256']
            )
            user_id = payload['user_id']
            
            # Check if user is admin
            async with request.app.ctx.pool.acquire() as connection:
                user = await connection.fetchrow(
                    "SELECT is_admin FROM users WHERE id = $1",
                    user_id
                )
                
                if not user or not user['is_admin']:
                    return json({'message': 'Admin access required'}, status=403)
                
            request.ctx.user_id = user_id
        except jwt.ExpiredSignatureError:
            return json({'message': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return json({'message': 'Invalid token'}, status=401)
            
        return await f(request, *args, **kwargs)
    return decorated_function