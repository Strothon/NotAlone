from sanic import Sanic, response
from sanic.log import logger
from sanic.exceptions import SanicException
import os
from config import Config
from database import init_db
from auth import auth_bp
from routes.users import users_bp
from routes.stories import stories_bp

app = Sanic("NotAlone")
app.config.update_config(Config)

# Register blueprints (no name parameter needed here)
app.blueprint(auth_bp)
app.blueprint(users_bp)
app.blueprint(stories_bp)

# Frontend configuration
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

# Static file serving with explicit unique names
app.static("/css", os.path.join(FRONTEND_DIR, "css"), name="static_css")
app.static("/js", os.path.join(FRONTEND_DIR, "js"), name="static_js")
app.static("/img", os.path.join(FRONTEND_DIR, "img"), name="static_img")
app.static("/owl", os.path.join(FRONTEND_DIR, "owl"), name="static_owl")
app.static("/makaleler", os.path.join(FRONTEND_DIR, "makaleler"), name="static_makaleler")
app.static("/", FRONTEND_DIR, name="static_root", strict_slashes=True)

async def serve_html(request, subdirectory: str, filename: str):
    """Centralized HTML file serving"""
    file_path = os.path.join(FRONTEND_DIR, subdirectory, filename)
    if not os.path.exists(file_path):
        raise SanicException(f"File not found: {filename}", status=404)
    return await response.file(file_path)

# HTML Routes with explicit unique names
@app.get("/", name="route_root")
@app.get("/home", name="route_home")
async def home(request):
    return await serve_html(request, "html", "home.html")

@app.get("/blog", name="route_blog")
async def blog(request):
    return await serve_html(request, "html", "blog.html")

@app.get("/adminpanel", name="route_admin_panel")
async def admin_panel(request):
    return await serve_html(request, "adminPanel", "adminpanel.html")

@app.get("/userpanel", name="route_user_panel")
async def user_panel(request):
    return await serve_html(request, "userpanel", "userpanel.html")

@app.get("/forum", name="route_forum")
async def forum(request):
    return await serve_html(request, "html", "forum.html")

# Database initialization
@app.listener('before_server_start')
async def setup_db(app, loop):
    await init_db(app, app.config)

@app.get("/stories", name="stories_route")
async def stories(request):
    return await serve_html(request, "html", "stories.html")

if __name__ == "__main__":
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
        workers=Config.WORKERS
    )