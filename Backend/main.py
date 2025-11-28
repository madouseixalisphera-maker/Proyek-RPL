from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

# --- IMPORT MODULAR ---
import models
import schemas
from database import engine, get_db

# Bikin Tabel (Bypass Check)
models.Base.metadata.create_all(bind=engine, checkfirst=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# ENDPOINTS
# ===========================

# --- LOGIN ---
@app.post("/login")
def login(item: schemas.LoginItem):
    if item.username == "Arassya" and item.password == "#akusayangadmin1":
        return {"token": "rahasia-negara", "message": "Login Sukses"}
    raise HTTPException(status_code=401, detail="Password salah bos!")

# --- SERVICES ---
@app.get("/services", response_model=List[schemas.Service])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.DBService).all()

@app.post("/services")
def add_service(s: schemas.Service, db: Session = Depends(get_db)):
    # Pastikan 'icon' masuk ke database
    db_service = models.DBService(title=s.title, description=s.description, icon=s.icon)
    try:
        db.add(db_service)
        db.commit()
    except:
        raise HTTPException(400, "Judul ada")
    return {"msg": "Saved"}

@app.put("/services/{original_title}")
def update_service(original_title: str, s: schemas.Service, db: Session = Depends(get_db)):
    item = db.query(models.DBService).filter(models.DBService.title == original_title).first()
    if not item: raise HTTPException(404, "Not Found")
    item.title = s.title
    item.description = s.description
    item.icon = s.icon # Update Icon juga
    db.commit()
    return {"msg": "Updated"}

@app.delete("/services/{title}")
def delete_service(title: str, db: Session = Depends(get_db)):
    db.query(models.DBService).filter(models.DBService.title == title).delete()
    db.commit()
    return {"msg": "Deleted"}

# --- TESTIMONI ---
@app.get("/testimonials", response_model=List[schemas.Testimonial])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(models.DBTestimonial).all()

@app.post("/testimonials")
def add_testimonial(t: schemas.Testimonial, db: Session = Depends(get_db)):
    # Tambah image_url
    db_testi = models.DBTestimonial(name=t.name, role=t.role, quote=t.quote, image_url=t.image_url)
    try:
        db.add(db_testi)
        db.commit()
    except:
        raise HTTPException(400, "Nama ada")
    return {"msg": "Saved"}

@app.put("/testimonials/{original_name}")
def update_testimonial(original_name: str, t: schemas.Testimonial, db: Session = Depends(get_db)):
    item = db.query(models.DBTestimonial).filter(models.DBTestimonial.name == original_name).first()
    if not item: raise HTTPException(404, "Not Found")
    item.name = t.name
    item.role = t.role
    item.quote = t.quote
    item.image_url = t.image_url # Update Image
    db.commit()
    return {"msg": "Updated"}

@app.delete("/testimonials/{name}")
def delete_testimonial(name: str, db: Session = Depends(get_db)):
    db.query(models.DBTestimonial).filter(models.DBTestimonial.name == name).delete()
    db.commit()
    return {"msg": "Deleted"}

# --- MESSAGES ---
@app.get("/messages", response_model=List[schemas.Message])
def get_messages(db: Session = Depends(get_db)):
    return db.query(models.DBMessage).all()

@app.post("/messages")
def send_message(m: schemas.Message, db: Session = Depends(get_db)):
    new_msg = models.DBMessage(
        name=m.name, email=m.email, text=m.text,
        is_read=False, timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(new_msg)
    db.commit()
    return {"msg": "Sent"}

@app.put("/messages/{email}")
def mark_read(email: str, db: Session = Depends(get_db)):
    item = db.query(models.DBMessage).filter(models.DBMessage.email == email).first()
    if item:
        item.is_read = True
        db.commit()
        return {"msg": "Read"}
    raise HTTPException(404, "Not Found")

@app.delete("/messages/{email}")
def delete_message(email: str, db: Session = Depends(get_db)):
    db.query(models.DBMessage).filter(models.DBMessage.email == email).delete()
    db.commit()
    return {"msg": "Deleted"}

# --- ARTICLES ---
@app.get("/articles", response_model=List[schemas.Article])
def get_articles(db: Session = Depends(get_db)):
    return db.query(models.DBArticle).all()

@app.post("/articles")
def add_article(a: schemas.Article, db: Session = Depends(get_db)):
    new_art = models.DBArticle(
        title=a.title, category=a.category, content=a.content,
        date=datetime.now().strftime("%Y-%m-%d"),
        image_url=a.image_url # Tambah image_url
    )
    try:
        db.add(new_art)
        db.commit()
    except:
        raise HTTPException(400, "Judul Sama")
    return {"msg": "Saved"}

@app.put("/articles/{original_title}")
def update_article(original_title: str, a: schemas.Article, db: Session = Depends(get_db)):
    item = db.query(models.DBArticle).filter(models.DBArticle.title == original_title).first()
    if not item: raise HTTPException(404, "Not Found")
    item.title = a.title
    item.category = a.category
    item.content = a.content
    item.image_url = a.image_url # Update Image
    db.commit()
    return {"msg": "Updated"}

@app.delete("/articles/{title}")
def delete_article(title: str, db: Session = Depends(get_db)):
    db.query(models.DBArticle).filter(models.DBArticle.title == title).delete()
    db.commit()
    return {"msg": "Deleted"}

@app.get("/")
def root(): return {"status": "Backend Modular Ready 🚀"}