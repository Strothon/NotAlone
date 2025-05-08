from sanic import Blueprint, response
from sanic.exceptions import SanicException
from database import get_conn

users_bp = Blueprint("users", url_prefix="/api/users")

@users_bp.get("/", name="list_users")
async def get_all_users(request):
    async with get_conn(request) as conn:
        users = await conn.fetch("SELECT * FROM users")
        return response.json([
            {
                "id": user["id"],
                "firstName": user["first_name"],
                "lastName": user["last_name"],
                "email": user["email"],
                "joinDate": user["created_at"].strftime("%d-%m-%Y")
            } for user in users
        ])

@users_bp.get("/<user_id:int>", name="get_user")
async def get_user(request, user_id: int):
    async with get_conn(request) as conn:
        user = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
        if not user:
            raise SanicException("User not found", status=404)
            
        return response.json({
            "id": user["id"],
            "firstName": user["first_name"],
            "lastName": user["last_name"],
            "email": user["email"]
        })