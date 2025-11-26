from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# --- KUNCI GUDANG (DATABASE URL) ---
# Nanti URL PostgreSQL dari Supabasce/Neon ditaruh di sini
# Format: postgresql://user:password@host:port/dbname
# Untuk sementara kita pakai SQLite dulu buat tes lokal, nanti tinggal ganti string ini
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:pass@host/db" <--- Nanti pakai ini

# Konfigurasi Engine
# check_same_thread=False cuma perlu buat SQLite. Kalau udah Postgres nanti dihapus argumennya.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Fungsi untuk dipanggil di main.py
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()