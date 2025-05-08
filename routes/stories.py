from sanic import Blueprint, response
from sanic.exceptions import SanicException
from database import get_conn

stories_bp = Blueprint("stories", url_prefix="/api/stories")  # Name defined here


@stories_bp.post("/", name="create_story")
async def submit_story(request):
    data = request.json
    required_fields = ["content", "author_info"]
    
    if not all(field in data for field in required_fields):
        raise SanicException("Missing required fields", status=400)

    async with get_conn(request) as conn:
        try:
            await conn.execute(
                "INSERT INTO stories (content, author_info) VALUES ($1, $2)",
                data["content"],
                data["author_info"]
            )
            return response.json({"message": "Story submitted successfully"}, status=201)
        except Exception as e:
            raise SanicException("Failed to submit story", status=500)

@stories_bp.get("/", name="list_stories")
async def get_stories(request):
    async with get_conn(request) as conn:
        stories = await conn.fetch("""
            SELECT id, content, author_info, created_at, is_approved 
            FROM stories 
            ORDER BY created_at DESC
        """)
        return response.json([
            {
                "id": s["id"],
                "content": s["content"],
                "author_info": s["author_info"],
                "created_at": s["created_at"].isoformat(),
                "is_approved": s["is_approved"]
            } for s in stories
        ])

@stories_bp.patch("/<story_id:int>", name="approve_story")
async def approve_story(request, story_id: int):
    async with get_conn(request) as conn:
        result = await conn.execute("""
            UPDATE stories 
            SET is_approved = TRUE 
            WHERE id = $1
        """, story_id)
        
        if result == "UPDATE 0":
            raise SanicException("Story not found", status=404)
            
        return response.json({"message": "Story approved successfully"})

@stories_bp.get("/approved", name="approved_stories")
async def get_approved_stories(request):
    async with get_conn(request) as conn:
        stories = await conn.fetch("""
            SELECT content, author_info 
            FROM stories 
            WHERE is_approved = TRUE
            ORDER BY created_at DESC
        """)
        return response.json([
            {"content": s["content"], "author_info": s["author_info"]} 
            for s in stories
        ])
    
@stories_bp.get("/combined")
async def get_combined_stories(request):
    async with get_conn(request) as conn:
        # Get dynamic stories from database
        db_stories = await conn.fetch("""
            SELECT id, content, author_info, created_at 
            FROM stories 
            WHERE is_approved = TRUE
            ORDER BY created_at DESC
        """)
        
        # Static stories (keep your existing ones)
        static_stories = [
            {
                "content": "I stayed in an abusive relationship where I was subjected to violence for 18 years...",
                "author_info": "Survivor / 36 Years Old"
            },
        ]
        
        return response.json({
            "static_stories": static_stories,
            "dynamic_stories": [
                {"content": s["content"], "author_info": s["author_info"]} 
                for s in db_stories
            ]
        })