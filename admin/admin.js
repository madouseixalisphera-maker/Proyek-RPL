const API_URL = "http://127.0.0.1:8000";

// PROTEKSI LOGIN
if (!localStorage.getItem('admin_token')) window.location.href = 'login.html';

// NAVIGASI
function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
    
    // Update active menu style
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active'); // Highlight menu yg diklik

    // Load data sesuai tab
    if(id === 'dashboard') loadStats();
    if(id === 'services') loadServices();
    if(id === 'blog') loadArticles(); // BARU
    if(id === 'testimonials') loadTestimonials();
    if(id === 'messages') loadMessages();
}

// 1. STATS
async function loadStats() {
    const s = await (await fetch(`${API_URL}/services`)).json();
    const a = await (await fetch(`${API_URL}/articles`)).json();
    const t = await (await fetch(`${API_URL}/testimonials`)).json();
    const m = await (await fetch(`${API_URL}/messages`)).json();
    
    document.getElementById('count-services').innerText = s.length;
    document.getElementById('count-articles').innerText = a.length;
    document.getElementById('count-testimoni').innerText = t.length;
    document.getElementById('count-messages').innerText = m.length;
}

// 2. SERVICES
async function loadServices() {
    const data = await (await fetch(`${API_URL}/services`)).json();
    let html = '';
    data.forEach(item => {
        html += `<tr><td>${item.title}</td><td>${item.description}</td>
        <td><button class="btn-delete" onclick="delService('${item.title}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-services').innerHTML = html;
}
async function addService() {
    await fetch(`${API_URL}/services`, { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            title: document.getElementById('svc-title').value,
            description: document.getElementById('svc-desc').value
        })});
    alert('Sukses'); loadServices();
}
async function delService(title) { if(confirm('Hapus?')) { await fetch(`${API_URL}/services/${title}`, {method:'DELETE'}); loadServices(); } }

// 3. BLOG / ARTIKEL (BARU)
async function loadArticles() {
    const data = await (await fetch(`${API_URL}/articles`)).json();
    let html = '';
    data.forEach(item => {
        html += `<tr><td>${item.date}</td><td>${item.title}</td><td>${item.category}</td>
        <td><button class="btn-delete" onclick="delArticle('${item.title}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-blog').innerHTML = html;
}
async function addArticle() {
    await fetch(`${API_URL}/articles`, { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            title: document.getElementById('blog-title').value,
            category: document.getElementById('blog-cat').value,
            content: document.getElementById('blog-content').value
        })});
    alert('Artikel Terbit!'); loadArticles();
}
async function delArticle(title) { if(confirm('Hapus Artikel?')) { await fetch(`${API_URL}/articles/${title}`, {method:'DELETE'}); loadArticles(); } }

// 4. TESTIMONI
async function loadTestimonials() {
    const data = await (await fetch(`${API_URL}/testimonials`)).json();
    let html = '';
    data.forEach(item => {
        html += `<tr><td>${item.name}</td><td>${item.role}</td><td>"${item.quote}"</td>
        <td><button class="btn-delete" onclick="delTesti('${item.name}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-testi').innerHTML = html;
}
async function addTesti() {
    await fetch(`${API_URL}/testimonials`, { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: document.getElementById('testi-name').value,
            role: document.getElementById('testi-role').value,
            quote: document.getElementById('testi-quote').value
        })});
    alert('Sukses'); loadTestimonials();
}
async function delTesti(name) { if(confirm('Hapus?')) { await fetch(`${API_URL}/testimonials/${name}`, {method:'DELETE'}); loadTestimonials(); } }

// 5. MESSAGES
async function loadMessages() {
    const data = await (await fetch(`${API_URL}/messages`)).json();
    let html = '';
    data.forEach(item => {
        html += `<tr><td>${item.timestamp}</td><td><b>${item.name}</b><br>${item.email}</td><td>${item.text}</td>
        <td><button class="btn-delete" onclick="delMsg('${item.email}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-messages').innerHTML = html;
}
async function delMsg(email) { if(confirm('Hapus Pesan?')) { await fetch(`${API_URL}/messages/${email}`, {method:'DELETE'}); loadMessages(); } }

function logout() { localStorage.removeItem('admin_token'); window.location.href='login.html'; }

// Init
loadStats();