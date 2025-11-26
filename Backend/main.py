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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. PATH DATABASE JSON (Teknik Absolute Path) ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_SERVICES = os.path.join(BASE_DIR, "../data/services.json")
DB_TESTIMONIALS = os.path.join(BASE_DIR, "../data/testimonials.json")
DB_MESSAGES = os.path.join(BASE_DIR, "../data/messages.json")
DB_ARTICLES = os.path.join(BASE_DIR, "../data/articles.json") # <-- BARU: Blog

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
    is_read: Optional[bool] = False 
    timestamp: Optional[str] = None

class Article(BaseModel): # <-- BARU: Blog
    title: str
    category: str
    content: str
    date: Optional[str] = None

class LoginItem(BaseModel): # <-- BARU: Login
    username: str
    password: str

# --- 4. UTIL: BACA & TULIS JSON ---
def load_data(filepath):
    if not os.path.exists(filepath): return []
    with open(filepath, "r") as f: return json.load(f)

def save_data(filepath, data):
    with open(filepath, "w") as f: json.dump(data, f, indent=2)

# ===========================
# ENDPOINTS
# ===========================

# --- A. LOGIN ADMIN (PENTING BUAT DASHBOARD) ---
@app.post("/login")
def login(item: LoginItem):
    # Password sederhana (Hardcoded)
    if item.username == "admin" and item.password == "admin123":
        return {"token": "rahasia-negara", "message": "Login Sukses"}
    raise HTTPException(status_code=401, detail="Password salah bos!")

# --- B. SERVICES ---
@app.get("/services", response_model=List[Service])
def get_services(): return load_data(DB_SERVICES)

@app.post("/services")
def add_service(s: Service):
    data = load_data(DB_SERVICES)
    data.append(s.dict())
    save_data(DB_SERVICES, data)
    return {"msg": "Saved"}

@app.delete("/services/{title}")
def delete_service(title: str):
    data = load_data(DB_SERVICES)
    save_data(DB_SERVICES, [x for x in data if x["title"].lower() != title.lower()])
    return {"msg": "Deleted"}

# --- C. TESTIMONIALS ---
@app.get("/testimonials", response_model=List[Testimonial])
def get_testimonials(): return load_data(DB_TESTIMONIALS)

@app.post("/testimonials")
def add_testimonial(t: Testimonial):
    data = load_data(DB_TESTIMONIALS)
    data.append(t.dict())
    save_data(DB_TESTIMONIALS, data)
    return {"msg": "Saved"}

@app.delete("/testimonials/{name}")
def delete_testimonial(name: str):
    data = load_data(DB_TESTIMONIALS)
    save_data(DB_TESTIMONIALS, [x for x in data if x["name"].lower() != name.lower()])
    return {"msg": "Deleted"}

# --- D. MESSAGES ---
@app.get("/messages")
def get_messages(): return load_data(DB_MESSAGES)

@app.post("/messages")
def send_message(m: Message):
    data = load_data(DB_MESSAGES)
    new_msg = m.dict()
    new_msg['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data.append(new_msg)
    save_data(DB_MESSAGES, data)
    return {"msg": "Sent"}

@app.delete("/messages/{email}") # <-- BARU: Hapus Pesan
def delete_message(email: str):
    data = load_data(DB_MESSAGES)
    save_data(DB_MESSAGES, [x for x in data if x["email"] != email])
    return {"msg": "Deleted"}

# --- E. ARTICLES (BLOG) ---
@app.get("/articles")
def get_articles(): return load_data(DB_ARTICLES)

@app.post("/articles")
def add_article(a: Article):
    data = load_data(DB_ARTICLES)
    new_article = a.dict()
    new_article['date'] = datetime.now().strftime("%Y-%m-%d")
    data.append(new_article)
    save_data(DB_ARTICLES, data)
    return {"msg": "Saved"}

@app.delete("/articles/{title}")
def delete_article(title: str):
    data = load_data(DB_ARTICLES)
    save_data(DB_ARTICLES, [x for x in data if x["title"].lower() != title.lower()])
    return {"msg": "Deleted"}

# --- F. ROOT ---
@app.get("/")
def root(): return {"status": "Backend Full Stack Ready 🚀"}