import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from apps.api.app.config import get_settings

logger = logging.getLogger("suraksha.database")
settings = get_settings()

database_url = settings.DATABASE_URL

# Exclusively configure Supabase PostgreSQL as database
if not database_url and settings.SUPABASE_URL:
    ref = settings.SUPABASE_URL.replace("https://", "").replace("http://", "").split(".")[0]
    db_pass = getattr(settings, "SUPABASE_DB_PASSWORD", "") or "postgres"
    database_url = f"postgresql://postgres:{db_pass}@db.{ref}.supabase.co:5432/postgres"

if not database_url:
    database_url = "postgresql+psycopg2://postgres:postgres@db.tngtkjozfhjnwvsjnyw.supabase.co:5432/postgres"

# Normalize Supabase / PostgreSQL URLs for SQLAlchemy psycopg2 driver
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif database_url.startswith("postgresql://") and not database_url.startswith("postgresql+"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg2://", 1)

engine_kwargs = {}
if database_url.startswith("sqlite"):
    logger.warning("DATABASE_URL was set to SQLite. Per project requirements, Supabase PostgreSQL is the sole database.")
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Optimized for Supabase PostgreSQL direct & pooler connections
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_recycle"] = 300
    connect_args = {}
    if "supabase" in database_url and "sslmode" not in database_url:
        connect_args["sslmode"] = "require"
    if connect_args:
        engine_kwargs["connect_args"] = connect_args

try:
    engine = create_engine(database_url, **engine_kwargs)
except Exception as e:
    logger.error(f"Failed to initialize Supabase engine with URL {database_url}: {e}")
    # Fallback to postgresql url placeholder if error
    engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/postgres")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
