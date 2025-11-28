from database import SessionLocal
import models
from datetime import datetime

db = SessionLocal()

print("🌱 Mulai menanam data ke Supabase...")

# --- 1. SERVICES (Ada Icon RPG) ---
services = [
    {"title": "AI Content Generator", "description": "Buat konten kilat.", "icon": "ri-sword-fill"},
    {"title": "Smart Editor", "description": "Asisten penulisan cerdas.", "icon": "ri-book-read-fill"},
    {"title": "Image Generation", "description": "Ubah teks jadi gambar.", "icon": "ri-magic-fill"},
    {"title": "PDF Intelligence", "description": "Tanya jawab dokumen PDF.", "icon": "ri-spy-fill"}
]

for item in services:
    exists = db.query(models.DBService).filter_by(title=item["title"]).first()
    if not exists:
        # PENTING: Pastikan kolom icon masuk
        new_svc = models.DBService(title=item["title"], description=item["description"], icon=item["icon"])
        db.add(new_svc)
        print(f"   [+] Service: {item['title']}")

# --- 2. TESTIMONI (Ada Image URL) ---
testimonials = [
    {"name": "Yoga", "role": "Content Creator", "quote": "Gila sih, script video jadi 5 menit beres!", "image_url": None},
    {"name": "Siti", "role": "Mahasiswa", "quote": "Skripsi jadi gampang banget.", "image_url": None},
    {"name": "Pak Nugraha", "role": "CEO", "quote": "Efisiensi naik 200%.", "image_url": None}
]

for item in testimonials:
    exists = db.query(models.DBTestimonial).filter_by(name=item["name"]).first()
    if not exists:
        new_testi = models.DBTestimonial(
            name=item["name"], role=item["role"], quote=item["quote"], 
            image_url=item.get("image_url")
        )
        db.add(new_testi)
        print(f"   [+] Testimoni: {item['name']}")

# --- 3. ARTIKEL (Ada Image URL) ---
articles = [
    {"title": "Cara AI Mengubah Dunia", "category": "Teknologi", "content": "AI bukan ancaman tapi kawan...", "date": datetime.now().strftime("%Y-%m-%d"), "image_url": None},
    {"title": "5 Tools Wajib Mahasiswa", "category": "Edukasi", "content": "Jangan ngaku mahasiswa kalau belum tau ini...", "date": datetime.now().strftime("%Y-%m-%d"), "image_url": None}
]

for item in articles:
    exists = db.query(models.DBArticle).filter_by(title=item["title"]).first()
    if not exists:
        new_art = models.DBArticle(
            title=item["title"], category=item["category"], content=item["content"], 
            date=item["date"], image_url=item.get("image_url")
        )
        db.add(new_art)
        print(f"   [+] Artikel: {item['title']}")

db.commit()
db.close()
print("✅ SELESAI! Data sudah masuk ke Supabase.")