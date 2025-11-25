from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI()

# --- 1. SETUP CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Buat development. Production nanti diganti domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. PATH DATABASE JSON (Teknik Absolute Path - Keren!) ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_SERVICES = os.path.join(BASE_DIR, "../data/services.json")
DB_TESTIMONIALS = os.path.join(BASE_DIR, "../data/testimonials.json")
DB_MESSAGES = os.path.join(BASE_DIR, "../data/messages.json") # <-- Tambahan

# --- 3. MODEL DATA ---
class Service(BaseModel):
    title: str
    description: str

class Testimonial(BaseModel):
    name: str
    role: str
    quote: str

class Message(BaseModel):
    name: str
    email: str
    text: str
    # Field di bawah ini opsional (diisi otomatis oleh server)
    is_read: Optional[bool] = False 
    timestamp: Optional[str] = None

# --- 4. UTIL: BACA & TULIS JSON ---
def load_data(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as f:
        return json.load(f)

def save_data(filepath, data):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

# ===========================
# ENDPOINTS
# ===========================

# --- 5. ENDPOINT SERVICES ---
@app.get("/services", response_model=List[Service])
def get_services():
    return load_data(DB_SERVICES)

@app.post("/services")
def add_service(service: Service):
    data = load_data(DB_SERVICES)
    data.append(service.dict())
    save_data(DB_SERVICES, data)
    return {"message": "Layanan berhasil ditambahkan!"}

@app.delete("/services/{title}")
def delete_service(title: str):
    data = load_data(DB_SERVICES)
    # Filter case-insensitive
    filtered = [item for item in data if item["title"].lower() != title.lower()]

    if len(filtered) == len(data):
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")

    save_data(DB_SERVICES, filtered)
    return {"message": f"Layanan '{title}' berhasil dihapus"}

# --- 6. ENDPOINT TESTIMONIALS ---
@app.get("/testimonials", response_model=List[Testimonial])
def get_testimonials():
    return load_data(DB_TESTIMONIALS)

@app.post("/testimonials")
def add_testimonial(testi: Testimonial):
    data = load_data(DB_TESTIMONIALS)
    data.append(testi.dict())
    save_data(DB_TESTIMONIALS, data)
    return {"message": "Testimoni berhasil ditambahkan!"}

@app.delete("/testimonials/{name}")
def delete_testimonial(name: str):
    data = load_data(DB_TESTIMONIALS)
    filtered = [item for item in data if item["name"].lower() != name.lower()]
    save_data(DB_TESTIMONIALS, filtered)
    return {"message": "Testimoni dihapus"}

# --- 7. ENDPOINT MESSAGES (TICKETING) ---
@app.post("/messages")
def send_message(msg: Message):
    data = load_data(DB_MESSAGES)
    
    # Isi timestamp dan status otomatis
    new_msg = msg.dict()
    new_msg['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_msg['is_read'] = False
    
    data.append(new_msg)
    save_data(DB_MESSAGES, data)
    return {"message": "Pesan terkirim!"}

@app.get("/messages")
def get_messages():
    return load_data(DB_MESSAGES)

# --- 8. ROOT CHECK ---
@app.get("/")
def root():
    return {"status": "Backend FastAPI berjalan 🚀"}