const API_BASE_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadTestimonials();
    loadArticles(); 
    setupMobileMenu();
    setupContactForm();
    setupParallax(); 
});

async function loadServices() {
    const container = document.getElementById('services-container');
    if (!container) return; 

    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error("Gagal fetch data");
        const data = await response.json();

        container.innerHTML = '';

        data.forEach(service => {
            const card = document.createElement('div');
            
            card.className = 'card service-card fade-in';
            
            card.innerHTML = `
                <div class="service-icon" style="font-size: 3rem; color: #00d4ff; margin-bottom: 15px;">
                    <i class="${service.icon}"></i>
                </div>

                <h3>${service.title}</h3>
                <p>${service.description}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
    console.error("Error services:", error);
    
    container.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center;">
            <h3 style="color: #ef4444;">⚠️ Gagal Memuat Data</h3>
            <p>Maaf, server sedang dalam perbaikan. Silakan coba lagi nanti.</p>
        </div>
    `;
}
}

async function loadTestimonials() {
    const container = document.getElementById('testimoni-container');
    if (!container) return;

    try {
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
                <h4>- ${testi.name}, <small style="color: #94a3b8;">${testi.role}</small></h4>
            `;
            container.appendChild(card);
        });
    } catch (error) {
    console.error("Error testimonials:", error);
    
    container.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center;">
            <p style="font-style: italic; color: #94a3b8;">"Testimoni tidak dapat ditampilkan saat ini."</p>
        </div>
    `;
}   
}

async function loadArticles() {
    const container = document.getElementById('blog-container');
    if (!container) return; 

    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        const data = await response.json();
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%; color:white;">Belum ada artikel terbaru.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('article');
            card.className = 'blog-card fade-in';
            
            const shortContent = item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content;
            
            card.innerHTML = `
                <div class="blog-thumbnail"></div> 
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
    } catch (error) {
    console.error("Error articles:", error);
    container.innerHTML = `
         <div class="blog-card" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
            <h3>Mode Offline</h3>
            <p>Gagal terhubung ke server artikel.</p>
        </div>
    `;
}
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            text: document.getElementById('message').value
        };

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Mengirim...';
        btn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Pesan berhasil dikirim!");
                form.reset(); 
            } else {
                alert("Gagal mengirim pesan.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan koneksi.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

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

function setupParallax() {
    const nagaBg = document.getElementById('naga-bg');
    
    if (!nagaBg) return;

    let lastScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                let movement = lastScrollY * 0.5; 
                
                let pos1 = 0 + movement;
                let pos2 = 50 + movement;

                nagaBg.style.backgroundPosition = 
                    `0px ${pos1}px, 30px ${pos2}px, 0px ${pos1}px, 30px ${pos2}px`;

                ticking = false;
            });

            ticking = true;
        }
    });
}
