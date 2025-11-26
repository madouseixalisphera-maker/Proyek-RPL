const API_BASE_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadTestimonials();
    setupMobileMenu();
    loadArticles(); 
    setupContactForm(); // <-- Fitur Baru!
});

// ===========================
// 1. LOAD LAYANAN (GET)
// ===========================
async function loadServices() {
    const container = document.getElementById('services-container');
    if (!container) return; // Stop kalau bukan di halaman home

    try {
        // UBAH JALUR: Dari file lokal ke API Backend
        const response = await fetch(`${API_BASE_URL}/services`);
        
        if (!response.ok) throw new Error("Gagal fetch data");
        
        const data = await response.json();

        // Bersihkan wadah biar gak dobel
        container.innerHTML = '';

        data.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card service-card fade-in';
            card.innerHTML = `
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error services:", error);
        container.innerHTML = '<p>Gagal memuat data layanan.</p>';
    }
}

// ===========================
// 2. LOAD TESTIMONI (GET)
// ===========================
async function loadTestimonials() {
    const container = document.getElementById('testimoni-container');
    if (!container) return;

    try {
        // UBAH JALUR: Ke API Backend
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        
        if (!response.ok) throw new Error("Gagal fetch data");

        const data = await response.json();

        container.innerHTML = '';

        data.forEach(testi => {
            const card = document.createElement('div');
            card.className = 'card testimoni-card fade-in';
            card.innerHTML = `
                <div class="testimoni-thumbnail"></div>
                <p>"${testi.quote}"</p>
                <h4>- ${testi.name}, <small>${testi.role}</small></h4>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error testimonials:", error);
    }
}

async function loadArticles() {
    const container = document.getElementById('blog-container');
    if (!container) return; // Hanya jalan di halaman blog.html

    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        const data = await response.json();
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">Belum ada artikel terbaru.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('article');
            card.className = 'blog-card fade-in';
            // Kita potong konten biar gak kepanjangan (substring)
            const shortContent = item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content;
            
            card.innerHTML = `
                <div class="blog-thumbnail" style="background-color: #ddd;"></div> 
                <div class="blog-content">
                    <span class="blog-category">${item.category}</span>
                    <h3>${item.title}</h3>
                    <p>${shortContent}</p>
                    <small style="color:#888; display:block; margin-bottom:10px;">📅 ${item.date}</small>
                    <a href="#" class="read-more">Baca Selengkapnya &rarr;</a>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) { console.error("Error articles:", error); }
}

// ===========================
// 3. CONTACT FORM (POST)
// ===========================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah halaman refresh

        // Ambil data dari input HTML
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            text: document.getElementById('message').value
        };

        // Ubah tombol jadi "Mengirim..."
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Mengirim...';
        btn.disabled = true;

        try {
            // KIRIM KE BACKEND
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Pesan berhasil dikirim! Kami akan menghubungi Anda segera.");
                form.reset(); // Kosongkan form
            } else {
                alert("Gagal mengirim pesan. Coba lagi nanti.");
            }
        } catch (error) {
            console.error("Error kirim pesan:", error);
            alert("Terjadi kesalahan koneksi.");
        } finally {
            // Balikin tombol seperti semula
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

// ===========================
// 4. MOBILE MENU (UI)
// ===========================
function setupMobileMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }
}