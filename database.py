import asyncpg
import json
from datetime import datetime

async def init_db(app, config):
    """Initialize database connection pool"""
    try:
        app.ctx.pool = await asyncpg.create_pool(
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            database=config.DB_NAME,
            host=config.DB_HOST
        )

        async with app.ctx.pool.acquire() as connection:
            # Create users table
            await connection.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    phone VARCHAR(20),
                    birth_date DATE,
                    gender VARCHAR(20),
                    is_admin BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Create stories table (corrected comment syntax)
            await connection.execute("""
                CREATE TABLE IF NOT EXISTS stories (
                    id SERIAL PRIMARY KEY,
                    content TEXT NOT NULL,
                    author_info VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_approved BOOLEAN DEFAULT FALSE  -- For moderation
                )
            """)
            
        print("Database initialized successfully")

    except Exception as e:
        print(f"Database initialization error: {str(e)}")
        raise e

async def get_users(conn):
    """Get all users from database"""
    return await conn.fetch(
        "SELECT first_name, last_name, email, phone, created_at FROM users ORDER BY created_at DESC"
    )

def get_conn(request):
    return request.app.ctx.pool.acquire()