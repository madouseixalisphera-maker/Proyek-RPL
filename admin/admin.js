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
    if(id === 'blog') loadArticles(); // 
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

// ==========================
// 2. SERVICES (FULL CRUD)
// ==========================
async function loadServices() {
    const data = await (await fetch(`${API_URL}/services`)).json();
    let html = '';
    data.forEach(item => {
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeDesc = encodeURIComponent(item.description); // Aman dari karakter aneh
        
        html += `
            <tr>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>
                    <button class="btn-primary" style="background:#f39c12; padding:5px 10px;" 
                        onclick="editModeSvc('${safeTitle}', '${safeDesc}')">Edit</button>
                    <button class="btn-delete" onclick="delService('${safeTitle}')">Hapus</button>
                </td>
            </tr>`;
    });
    document.getElementById('tbl-services').innerHTML = html;
}

async function addService() {
    await fetch(`${API_URL}/services`, { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            title: document.getElementById('svc-title').value,
            description: document.getElementById('svc-desc').value
        })});
    alert('Sukses'); resetFormSvc(); loadServices();
}

// --- LOGIKA EDIT SERVICE ---
function editModeSvc(title, encodedDesc) {
    const desc = decodeURIComponent(encodedDesc);
    document.getElementById('svc-title').value = title;
    document.getElementById('svc-desc').value = desc;
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
            title: document.getElementById('svc-title').value,
            description: document.getElementById('svc-desc').value
        })
    });
    alert('Layanan Diupdate!'); resetFormSvc(); loadServices();
}

function resetFormSvc() {
    document.getElementById('svc-title').value = '';
    document.getElementById('svc-desc').value = '';
    document.getElementById('original-title-svc').value = '';
    document.getElementById('form-title-svc').innerText = "Tambah Layanan";
    document.getElementById('btn-cancel-svc').style.display = 'none';
    document.getElementById('btn-group-svc').innerHTML = `<button class="btn-primary" onclick="addService()">+ Simpan Layanan</button>`;
}

async function delService(title) { if(confirm('Hapus?')) { await fetch(`${API_URL}/services/${title}`, {method:'DELETE'}); loadServices(); } }
// ==========================================
// 3. BLOG / ARTIKEL (FULL CRUD: ADD, EDIT, DELETE)
// ==========================================

async function loadArticles() {
    const data = await (await fetch(`${API_URL}/articles`)).json();
    let html = '';
    data.forEach(item => {
        // Kita escape tanda petik biar gak error pas masuk function
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeCat = item.category.replace(/'/g, "\\'");
        // Encode konten agar aman dikirim lewat parameter function
        const safeContent = encodeURIComponent(item.content);

        html += `
            <tr>
                <td>${item.date}</td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>
                    <button class="btn-primary" style="background:#f39c12; padding:5px 10px;" 
                        onclick="editModeBlog('${safeTitle}', '${safeCat}', '${safeContent}')">Edit</button>
                    
                    <button class="btn-delete" onclick="delArticle('${safeTitle}')">Hapus</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('tbl-blog').innerHTML = html;
}

// --- Mode Tambah Baru ---
async function addArticle() {
    await fetch(`${API_URL}/articles`, { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            title: document.getElementById('blog-title').value,
            category: document.getElementById('blog-cat').value,
            content: document.getElementById('blog-content').value
        })
    });
    alert('Artikel Terbit!'); 
    resetFormBlog(); // Bersihkan form
    loadArticles();
}

// --- Mode Persiapan Edit (Isi Form) ---
function editModeBlog(title, cat, encodedContent) {
    // Decode konten yang tadi di-encode
    const content = decodeURIComponent(encodedContent);

    // Isi form dengan data lama
    document.getElementById('blog-title').value = title;
    document.getElementById('blog-cat').value = cat;
    document.getElementById('blog-content').value = content;
    
    // Simpan judul asli (buat kunci pencarian di backend)
    document.getElementById('original-title-blog').value = title;

    // Ubah Tampilan Form
    document.getElementById('form-title-blog').innerText = "Edit Artikel";
    document.getElementById('btn-cancel-blog').style.display = 'inline-block';
    
    // Ganti tombol Simpan jadi tombol Update
    document.getElementById('btn-group-blog').innerHTML = `
        <button class="btn-primary" style="background:#27ae60;" onclick="updateArticle()">💾 Simpan Perubahan</button>
    `;
    
    // Scroll ke atas biar admin sadar form sudah terisi
    document.querySelector('.form-box').scrollIntoView({behavior: 'smooth'});
}

// --- Eksekusi Update ke Backend ---
async function updateArticle() {
    const originalTitle = document.getElementById('original-title-blog').value;
    
    await fetch(`${API_URL}/articles/${originalTitle}`, { 
        method: 'PUT', // Pakai method PUT
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            title: document.getElementById('blog-title').value, // Judul baru (bisa diedit)
            category: document.getElementById('blog-cat').value,
            content: document.getElementById('blog-content').value
        })
    });
    
    alert('Artikel Berhasil Diupdate!');
    resetFormBlog(); // Reset form ke mode tambah
    loadArticles();
}

// --- Batal Edit / Reset Form ---
function resetFormBlog() {
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-cat').value = '';
    document.getElementById('blog-content').value = '';
    document.getElementById('original-title-blog').value = '';
    
    document.getElementById('form-title-blog').innerText = "Tulis Artikel Baru";
    document.getElementById('btn-cancel-blog').style.display = 'none';
    
    // Balikin tombol jadi "Terbitkan"
    document.getElementById('btn-group-blog').innerHTML = `
        <button class="btn-primary" onclick="addArticle()">+ Terbitkan Artikel</button>
    `;
}

async function delArticle(title) { 
    if(confirm('Hapus Artikel?')) { 
        await fetch(`${API_URL}/articles/${title}`, {method:'DELETE'}); 
        loadArticles(); 
    } 
}
// ==========================
// 4. TESTIMONI (FULL CRUD)
// ==========================
async function loadTestimonials() {
    const data = await (await fetch(`${API_URL}/testimonials`)).json();
    let html = '';
    data.forEach(item => {
        const safeName = item.name.replace(/'/g, "\\'");
        const safeRole = item.role.replace(/'/g, "\\'");
        const safeQuote = encodeURIComponent(item.quote);

        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.role}</td>
                <td>"${item.quote}"</td>
                <td>
                    <button class="btn-primary" style="background:#f39c12; padding:5px 10px;" 
                        onclick="editModeTesti('${safeName}', '${safeRole}', '${safeQuote}')">Edit</button>
                    <button class="btn-delete" onclick="delTesti('${safeName}')">Hapus</button>
                </td>
            </tr>`;
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
    alert('Sukses'); resetFormTesti(); loadTestimonials();
}

// --- LOGIKA EDIT TESTIMONI ---
function editModeTesti(name, role, encodedQuote) {
    const quote = decodeURIComponent(encodedQuote);
    document.getElementById('testi-name').value = name;
    document.getElementById('testi-role').value = role;
    document.getElementById('testi-quote').value = quote;
    document.getElementById('original-name-testi').value = name;

    document.getElementById('form-title-testi').innerText = "Edit Testimoni";
    document.getElementById('btn-cancel-testi').style.display = 'inline-block';
    document.getElementById('btn-group-testi').innerHTML = `<button class="btn-primary" style="background:#27ae60;" onclick="updateTesti()">💾 Simpan Perubahan</button>`;
    document.querySelector('#testimonials .form-box').scrollIntoView({behavior: 'smooth'});
}

async function updateTesti() {
    const originalName = document.getElementById('original-name-testi').value;
    await fetch(`${API_URL}/testimonials/${originalName}`, { 
        method: 'PUT', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: document.getElementById('testi-name').value,
            role: document.getElementById('testi-role').value,
            quote: document.getElementById('testi-quote').value
        })
    });
    alert('Testimoni Diupdate!'); resetFormTesti(); loadTestimonials();
}

function resetFormTesti() {
    document.getElementById('testi-name').value = '';
    document.getElementById('testi-role').value = '';
    document.getElementById('testi-quote').value = '';
    document.getElementById('original-name-testi').value = '';
    document.getElementById('form-title-testi').innerText = "Tambah Testimoni";
    document.getElementById('btn-cancel-testi').style.display = 'none';
    document.getElementById('btn-group-testi').innerHTML = `<button class="btn-primary" onclick="addTesti()">+ Simpan Testimoni</button>`;
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