document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadTestimonials();
    setupMobileMenu();
});

async function loadServices() {
    try {
        const container = document.getElementById('services-container');
        
        if (!container) return; 

        const response = await fetch('data/services.json'); 
        const data = await response.json();

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
        console.error("Gagal memuat layanan:", error);
    }
}

async function loadTestimonials() {
    try {
        const container = document.getElementById('testimoni-container');

        if (!container) return;

        const response = await fetch('data/testimonials.json');
        const data = await response.json();

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
        console.error("Gagal memuat testimoni:", error);
    }
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