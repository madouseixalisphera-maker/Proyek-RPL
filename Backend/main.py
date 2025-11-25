from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI()

# --- 1. SETUP CORS (Supaya Frontend HTML bisa akses Backend ini) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Di production nanti ganti dengan domain kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. LOKASI DATABASE JSON ---
# Kita mundur satu folder (..) karena folder data ada di luar folder backend
DB_SERVICES = "../data/services.json"
DB_TESTIMONIALS = "../data/testimonials.json"

# --- 3. MODEL DATA (Pydantic) ---
# Ini validasi data: Judul & Deskripsi wajib berupa teks
class Service(BaseModel):
    title: str
    description: str

class Testimonial(BaseModel):
    name: str
    role: str
    quote: str

# --- 4. FUNGSI BANTUAN BACA/TULIS JSON ---
def load_data(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def save_data(filepath, data):
    with open(filepath, "w") as f:
        # indent=2 biar file JSON-nya rapi (gak satu baris panjang)
        json.dump(data, f, indent=2)

# --- 5. ENDPOINT API (SERVICES) ---

# GET: Ambil semua layanan
@app.get("/services", response_model=List[Service])
def get_services():
    return load_data(DB_SERVICES)

# POST: Tambah layanan baru
@app.post("/services")
def add_service(service: Service):
    data = load_data(DB_SERVICES)
    # Ubah objek Service ke dictionary biar bisa disimpan JSON
    data.append(service.dict())
    save_data(DB_SERVICES, data)
    return {"message": "Layanan berhasil ditambahkan!"}

# DELETE: Hapus layanan berdasarkan judul (Simple version)
@app.delete("/services/{title}")
def delete_service(title: str):
    data = load_data(DB_SERVICES)
    # Cari data yang judulnya BUKAN title yang mau dihapus (Filter)
    new_data = [item for item in data if item["title"].lower() != title.lower()]
    
    if len(new_data) == len(data):
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    
    save_data(DB_SERVICES, new_data)
    return {"message": f"Layanan '{title}' berhasil dihapus"}

# --- 6. ENDPOINT API (TESTIMONIALS) ---

@app.get("/testimonials", response_model=List[Testimonial])
def get_testimonials():
    return load_data(DB_TESTIMONIALS)

@app.post("/testimonials")
def add_testimonial(testi: Testimonial):
    data = load_data(DB_TESTIMONIALS)
    data.append(testi.dict())
    save_data(DB_TESTIMONIALS, data)
    return {"message": "Testimoni berhasil ditambahkan!"}

# --- 7. HOME (Cek Server Nyala) ---
@app.get("/")
def read_root():
    return {"status": "Backend FastAPI Berjalan Kencang! 🚀"}