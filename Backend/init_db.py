from database import engine
import models

print("🔄 Sedang menghubungkan ke Database...")

# 1. Hapus metadata lama (biar fresh)
# models.Base.metadata.drop_all(bind=engine) 
# (Baris di atas saya matikan dulu, takutnya nanti kepakai pas data udah ada)

# 2. Buat Tabel Baru
print("🔨 Sedang membuat tabel di Supabase...")
models.Base.metadata.create_all(bind=engine)

print("✅ SELESAI! Cek dashboard Supabase sekarang.")