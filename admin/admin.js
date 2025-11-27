const API_URL = "http://127.0.0.1:8000";

// ===========================
// 1. LOGIKA AUTH (LOGIN & LOGOUT)
// ===========================

// Fungsi Login (Dipanggil dari login.html)
async function handleLogin(event) {
    event.preventDefault(); // Mencegah reload form
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: u, password: p})
        });
        
        if (res.ok) {
            const data = await res.json();
            sessionStorage.setItem('admin_token', data.token); // Simpan token
            window.location.href = 'dashboard.html'; // Pindah halaman
        } else {
            alert("Login Gagal! Username/Password salah.");
        }
    } catch (err) { 
        alert("Gagal koneksi ke server Backend!"); 
        console.error(err);
    }
}

// Fungsi Logout
function logout() {
    sessionStorage.removeItem('admin_token');
    window.location.href = 'login.html';
}

// ===========================
// 2. CEK HALAMAN (ROUTER SEDERHANA)
// ===========================

// Cek kita lagi di halaman mana?
const currentPage = window.location.pathname;

// A. JIKA DI HALAMAN DASHBOARD
if (currentPage.includes('dashboard.html')) {
    
    // 1. Proteksi: Kalau gak ada token, tendang ke login
    if (!sessionStorage.getItem('admin_token')) {
        window.location.href = 'login.html';
    }

    // 2. Jalankan fungsi Dashboard
    // (Ini kode dashboard lama kamu, ditaruh di dalam blok IF ini biar gak error di login)
    initDashboard(); 
}

// B. JIKA DI HALAMAN LOGIN
if (currentPage.includes('login.html')) {
    // Kalau sudah login, langsung lempar ke dashboard (biar gak login ulang)
    if (sessionStorage.getItem('admin_token')) {
        window.location.href = 'dashboard.html';
    }
}

// ===========================
// 3. FUNGSI-FUNGSI DASHBOARD
// ===========================

function initDashboard() {
    loadStats(); // Load data awal
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
    
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if(id === 'dashboard') loadStats();
    if(id === 'services') loadServices();
    if(id === 'blog') loadArticles();
    if(id === 'testimonials') loadTestimonials();
    if(id === 'messages') loadMessages();
}

async function loadStats() {
    try {
        const s = await (await fetch(`${API_URL}/services`)).json();
        const a = await (await fetch(`${API_URL}/articles`)).json();
        const t = await (await fetch(`${API_URL}/testimonials`)).json();
        const m = await (await fetch(`${API_URL}/messages`)).json();
        
        document.getElementById('count-services').innerText = s.length;
        document.getElementById('count-articles').innerText = a.length;
        document.getElementById('count-testimoni').innerText = t.length;
        document.getElementById('count-messages').innerText = m.length;
    } catch (e) { console.log("Gagal load stats", e); }
}

// --- SERVICES ---
async function loadServices() {
    const data = await (await fetch(`${API_URL}/services`)).json();
    let html = '';
    data.forEach(item => {
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeDesc = encodeURIComponent(item.description);
        // Kita kirim juga data icon ke fungsi edit
        const safeIcon = item.icon; 
        
        html += `
            <tr>
                <td style="font-size: 1.5rem; text-align:center;"><i class="${item.icon}"></i></td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>
                    <button class="btn-primary" onclick="editModeSvc('${safeTitle}', '${safeDesc}', '${safeIcon}')">Edit</button>
                    <button class="btn-delete" onclick="delService('${safeTitle}')">Hapus</button>
                </td>
            </tr>`;
    });
    document.getElementById('tbl-services').innerHTML = html;
}

async function addService() {
    await fetch(`${API_URL}/services`, { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            // KIRIM DATA ICON
            icon: document.getElementById('svc-icon').value,
            title: document.getElementById('svc-title').value,
            description: document.getElementById('svc-desc').value
        })
    });
    alert('Sukses'); resetFormSvc(); loadServices();
}

function editModeSvc(title, encodedDesc, icon) {
    const desc = decodeURIComponent(encodedDesc);
    document.getElementById('svc-title').value = title;
    document.getElementById('svc-desc').value = desc;
    // Set dropdown icon sesuai data lama
    document.getElementById('svc-icon').value = icon; 
    
    document.getElementById('original-title-svc').value = title;
    document.getElementById('form-title-svc').innerText = "Edit Layanan";
    document.getElementById('btn-cancel-svc').style.display = 'inline-block';
    document.getElementById('btn-group-svc').innerHTML = `<button class="btn-primary" style="background:#27ae60;" onclick="updateService()">💾 Simpan Perubahan</button>`;
    document.querySelector('#services .form-box').scrollIntoView({behavior: 'smooth'});
}

async function updateService() {
    const originalTitle = document.getElementById('original-title-svc').value;
    await fetch(`${API_URL}/services/${originalTitle}`, { 
        method: 'PUT', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            // UPDATE DATA ICON JUGA
            icon: document.getElementById('svc-icon').value,
            title: document.getElementById('svc-title').value,
            description: document.getElementById('svc-desc').value
        })
    });
    alert('Layanan Diupdate!'); resetFormSvc(); loadServices();
}

function resetFormSvc() {
    document.getElementById('svc-title').value = '';
    document.getElementById('svc-desc').value = '';
    document.getElementById('svc-icon').selectedIndex = 0; // Reset icon ke pilihan pertama
    document.getElementById('original-title-svc').value = '';
    document.getElementById('form-title-svc').innerText = "Tambah Layanan";
    document.getElementById('btn-cancel-svc').style.display = 'none';
    document.getElementById('btn-group-svc').innerHTML = `<button class="btn-primary" onclick="addService()">+ Simpan Layanan</button>`;
}
async function delService(t) { if(confirm('Hapus?')) { await fetch(`${API_URL}/services/${t}`, {method:'DELETE'}); loadServices(); }}


// --- ARTIKEL ---
async function loadArticles() {
    const data = await (await fetch(`${API_URL}/articles`)).json();
    let html = '';
    data.forEach(item => {
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeCat = item.category.replace(/'/g, "\\'");
        const safeContent = encodeURIComponent(item.content);
        html += `<tr><td>${item.date}</td><td>${item.title}</td><td>${item.category}</td><td>
        <button class="btn-primary" onclick="editModeBlog('${safeTitle}', '${safeCat}', '${safeContent}')">Edit</button>
        <button class="btn-delete" onclick="delArticle('${safeTitle}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-blog').innerHTML = html;
}
async function addArticle() {
    await fetch(`${API_URL}/articles`, { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ title: document.getElementById('blog-title').value, category: document.getElementById('blog-cat').value, content: document.getElementById('blog-content').value })});
    alert('Terbit!'); resetFormBlog(); loadArticles();
}
// ... (Copas fungsi editModeBlog, updateArticle, resetFormBlog, delArticle dari kode lamamu) ...
function editModeBlog(title, cat, encodedContent) {
    const content = decodeURIComponent(encodedContent);
    document.getElementById('blog-title').value = title;
    document.getElementById('blog-cat').value = cat;
    document.getElementById('blog-content').value = content;
    document.getElementById('original-title-blog').value = title;
    document.getElementById('form-title-blog').innerText = "Edit Artikel";
    document.getElementById('btn-cancel-blog').style.display = 'inline-block';
    document.getElementById('btn-group-blog').innerHTML = `<button class="btn-primary" style="background:#27ae60;" onclick="updateArticle()">💾 Simpan Perubahan</button>`;
}
async function updateArticle() {
    const ot = document.getElementById('original-title-blog').value;
    await fetch(`${API_URL}/articles/${ot}`, { method: 'PUT', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ title: document.getElementById('blog-title').value, category: document.getElementById('blog-cat').value, content: document.getElementById('blog-content').value })});
    alert('Updated!'); resetFormBlog(); loadArticles();
}
function resetFormBlog() {
    document.getElementById('blog-title').value = ''; document.getElementById('blog-cat').value = ''; document.getElementById('blog-content').value = '';
    document.getElementById('form-title-blog').innerText = "Tulis Artikel";
    document.getElementById('btn-cancel-blog').style.display = 'none';
    document.getElementById('btn-group-blog').innerHTML = `<button class="btn-primary" onclick="addArticle()">+ Terbitkan</button>`;
}
async function delArticle(t) { if(confirm('Hapus?')) { await fetch(`${API_URL}/articles/${t}`, {method:'DELETE'}); loadArticles(); }}


// --- TESTIMONI ---
async function loadTestimonials() {
    const data = await (await fetch(`${API_URL}/testimonials`)).json();
    let html = '';
    data.forEach(item => {
        const safeName = item.name.replace(/'/g, "\\'");
        const safeRole = item.role.replace(/'/g, "\\'");
        const safeQuote = encodeURIComponent(item.quote);
        html += `<tr><td>${item.name}</td><td>${item.role}</td><td>"${item.quote}"</td><td>
        <button class="btn-primary" onclick="editModeTesti('${safeName}', '${safeRole}', '${safeQuote}')">Edit</button>
        <button class="btn-delete" onclick="delTesti('${safeName}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-testi').innerHTML = html;
}
async function addTesti() {
    await fetch(`${API_URL}/testimonials`, { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: document.getElementById('testi-name').value, role: document.getElementById('testi-role').value, quote: document.getElementById('testi-quote').value })});
    alert('Sukses'); resetFormTesti(); loadTestimonials();
}
// ... (Copas fungsi editModeTesti, updateTesti, resetFormTesti, delTesti dari kode lamamu) ...
function editModeTesti(name, role, encodedQuote) {
    const quote = decodeURIComponent(encodedQuote);
    document.getElementById('testi-name').value = name;
    document.getElementById('testi-role').value = role;
    document.getElementById('testi-quote').value = quote;
    document.getElementById('original-name-testi').value = name;
    document.getElementById('form-title-testi').innerText = "Edit Testimoni";
    document.getElementById('btn-cancel-testi').style.display = 'inline-block';
    document.getElementById('btn-group-testi').innerHTML = `<button class="btn-primary" style="background:#27ae60;" onclick="updateTesti()">💾 Simpan Perubahan</button>`;
}
async function updateTesti() {
    const on = document.getElementById('original-name-testi').value;
    await fetch(`${API_URL}/testimonials/${on}`, { method: 'PUT', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: document.getElementById('testi-name').value, role: document.getElementById('testi-role').value, quote: document.getElementById('testi-quote').value })});
    alert('Updated!'); resetFormTesti(); loadTestimonials();
}
function resetFormTesti() {
    document.getElementById('testi-name').value = ''; document.getElementById('testi-role').value = ''; document.getElementById('testi-quote').value = '';
    document.getElementById('form-title-testi').innerText = "Tambah Testimoni";
    document.getElementById('btn-cancel-testi').style.display = 'none';
    document.getElementById('btn-group-testi').innerHTML = `<button class="btn-primary" onclick="addTesti()">+ Simpan</button>`;
}
async function delTesti(n) { if(confirm('Hapus?')) { await fetch(`${API_URL}/testimonials/${n}`, {method:'DELETE'}); loadTestimonials(); }}


// --- MESSAGES ---
async function loadMessages() {
    const data = await (await fetch(`${API_URL}/messages`)).json();
    let html = '';
    data.forEach(item => {
        // Logika sederhana: kalau is_read = true, kasih warna abu-abu
        const style = item.is_read ? 'background:#f0f0f0; color:#888;' : 'font-weight:bold;';
        const statusBtn = item.is_read ? '<span>✅ Dibaca</span>' : `<button class="btn-primary" onclick="markRead('${item.email}')">Tandai Baca</button>`;
        
        html += `<tr style="${style}"><td>${item.timestamp}</td><td><b>${item.name}</b><br>${item.email}</td><td>${item.text}</td>
        <td>${statusBtn} <button class="btn-delete" onclick="delMsg('${item.email}')">Hapus</button></td></tr>`;
    });
    document.getElementById('tbl-messages').innerHTML = html;
}
async function markRead(email) {
    await fetch(`${API_URL}/messages/${email}`, { method: 'PUT' });
    loadMessages();
}
async function delMsg(email) { if(confirm('Hapus Pesan?')) { await fetch(`${API_URL}/messages/${email}`, {method:'DELETE'}); loadMessages(); } }