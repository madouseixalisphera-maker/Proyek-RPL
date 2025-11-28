from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# --- KUNCI GUDANG (DATABASE URL) ---

# 1. MATIKAN SQLite (Kasih pagar # di depannya)
# SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

# 2. HIDUPKAN PostgreSQL (Hapus pagar # dan ISI URL SUPABASE KAMU)
# Ganti teks "postgresql://..." di bawah dengan URL asli dari Dashboard Supabase kamu
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.qzwtounybkqwpqvgzzih:rasyagg24275@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# 3. HAPUS ARGUMEN SQLite
# Hapus bagian 'connect_args={"check_same_thread": False}' karena PostgreSQL tidak butuh itu.
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()