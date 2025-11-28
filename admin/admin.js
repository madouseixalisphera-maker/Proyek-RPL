const API_URL = "https://proyek-rpl.onrender.com"; 

const SUPABASE_URL = "https://qzwtounybkqwpqvgzzih.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6d3RvdW55Ymtxd3Bxdmd6emloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTI4MDQsImV4cCI6MjA3OTg4ODgwNH0.ffnqYb474sJm9VNu2Cur-dUQ0_A9aR2bmjIHy1KrSAs"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


async function handleLogin(event) {
    event.preventDefault();
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
            sessionStorage.setItem('admin_token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert("Login Gagal! Cek username/password.");
        }
    } catch (err) { 
        alert("Gagal koneksi ke Backend! " + err); 
        console.error(err);
    }
}

function logout() {
    sessionStorage.removeItem('admin_token');
    window.location.href = 'login.html';
}

const currentPage = window.location.pathname;
const isDashboard = document.getElementById('dashboard'); 

if (isDashboard && !sessionStorage.getItem('admin_token')) {
    window.location.href = 'login.html';
} 
else if (currentPage.includes('login.html') && sessionStorage.getItem('admin_token')) {
    window.location.href = 'dashboard.html';
}

if (isDashboard) {
    loadStats();
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


async function uploadImage(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    const file = fileInput.files[0];
    
    if (!file) return null; 

    const fileName = `img_${Date.now()}_${file.name.replace(/\s/g, '_')}`;

    const { data, error } = await supabaseClient.storage
        .from('image')
        .upload(fileName, file);

    if (error) {
        console.error("Upload Error:", error);
        alert("Gagal upload gambar: " + error.message);
        return null;
    }

    const { data: urlData } = supabaseClient.storage.from('image').getPublicUrl(fileName);
    return urlData.publicUrl;
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


async function loadServices() {
    const data = await (await fetch(`${API_URL}/services`)).json();
    let html = '';
    data.forEach(item => {
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeDesc = encodeURIComponent(item.description);
        const safeIcon = item.icon; 
        
        html += `
            <tr>
                <td style="font-size: 1.5rem; text-align:center;"><i class="${item.icon}"></i></td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>
                    <button class="btn-primary" style="background:#f39c12; padding:5px 10px;" 
                        onclick="editModeSvc('${safeTitle}', '${safeDesc}', '${safeIcon}')">Edit</button>
                    <button class="btn-delete" onclick="delService('${safeTitle}')">Hapus</button>
                </td>
            </tr>`;
    });
    document.getElementById('tbl-services').innerHTML = html;
}


async function addService() {
    await fetch(`${API_URL}/services`, { 
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
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
    document.getElementById('svc-icon').selectedIndex = 0;
    document.getElementById('original-title-svc').value = '';
    document.getElementById('form-title-svc').innerText = "Tambah Layanan";
    document.getElementById('btn-cancel-svc').style.display = 'none';
    document.getElementById('btn-group-svc').innerHTML = `<button class="btn-primary" onclick="addService()">+ Simpan Layanan</button>`;
}
async function delService(t) { 
    if(confirm('Hapus?')) { await fetch(`${API_URL}/services/${t}`, {method:'DELETE'}); loadServices(); }
}


async function loadArticles() {
    const data = await (await fetch(`${API_URL}/articles`)).json();
    let html = '';
    data.forEach(item => {
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeCat = item.category.replace(/'/g, "\\'");
        const safeContent = encodeURIComponent(item.content);
        
        const imgDisplay = item.image_url 
            ? `<img src="${item.image_url}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">` 
            : `<span style="color:#ccc">No Img</span>`;

        html += `
            <tr>
                <td>${item.date}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${imgDisplay}
                        <span>${item.title}</span>
                    </div>
                </td>
                <td>${item.category}</td>
                <td>
                    <button class="btn-primary" style="background:#f39c12; padding:5px 10px;" 
                        onclick="editModeBlog('${safeTitle}', '${safeCat}', '${safeContent}')">Edit</button>
                    <button class="btn-delete" onclick="delArticle('${safeTitle}')">Hapus</button>
                </td>
            </tr>`;
    });
    document.getElementById('tbl-blog').innerHTML = html;
}


async function addArticle() {
    const title = document.getElementById('blog-title').value.trim();
    const cat = document.getElementById('blog-cat').value.trim();
    const content = document.getElementById('blog-content').value.trim();

    if (!title || !cat || !content) {
        alert("⚠️ Judul, Kategori, dan Isi Artikel wajib diisi!");
        return;
    }

    const btn = document.querySelector('#btn-group-blog button');
}

function editModeBlog(title, cat, encodedContent) {
    const content = decodeURIComponent(encodedContent);
    document.getElementById('blog-title').value = title;
    document.getElementById('blog-cat').value = cat;
    document.getElementById('blog-content').value = content;
    document.getElementById('original-title-blog').value = title;
    
    document.getElementById('form-title-blog').innerText = "Edit Artikel";
    document.getElementById('btn-cancel-blog').style.display = 'inline-block';
    document.getElementById('btn-group-blog').innerHTML = `<button class="btn-primary" style="background:#27ae60;" onclick="updateArticle()">💾 Simpan Perubahan</button>`;
    document.querySelector('#blog .form-box').scrollIntoView({behavior: 'smooth'});
}


async function updateArticle() {
    const ot = document.getElementById('original-title-blog').value;
    
    let imgUrl = null;
    const fileInput = document.getElementById('blog-img');
    if(fileInput.files.length > 0) {
        imgUrl = await uploadImage('blog-img');
    }

    const bodyData = {
        title: document.getElementById('blog-title').value,
        category: document.getElementById('blog-cat').value,
        content: document.getElementById('blog-content').value
    };
    if (imgUrl) bodyData.image_url = imgUrl;

    await fetch(`${API_URL}/articles/${ot}`, { 
        method: 'PUT', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(bodyData)
    });
    alert('Updated!'); resetFormBlog(); loadArticles();
}

function resetFormBlog() {
    document.getElementById('blog-title').value = ''; document.getElementById('blog-cat').value = ''; document.getElementById('blog-content').value = '';
    document.getElementById('blog-img').value = '';
    document.getElementById('original-title-blog').value = '';
    document.getElementById('form-title-blog').innerText = "Tulis Artikel Baru";
    document.getElementById('btn-cancel-blog').style.display = 'none';
    document.getElementById('btn-group-blog').innerHTML = `<button class="btn-primary" onclick="addArticle()">+ Terbitkan Artikel</button>`;
}
async function delArticle(t) { if(confirm('Hapus?')) { await fetch(`${API_URL}/articles/${t}`, {method:'DELETE'}); loadArticles(); }}


async function loadTestimonials() {
    const data = await (await fetch(`${API_URL}/testimonials`)).json();
    let html = '';
    data.forEach(item => {
        const safeName = item.name.replace(/'/g, "\\'");
        const safeRole = item.role.replace(/'/g, "\\'");
        const safeQuote = encodeURIComponent(item.quote);
        
        const imgDisplay = item.image_url 
            ? `<img src="${item.image_url}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` 
            : `<div style="width:40px; height:40px; background:#ccc; border-radius:50%;"></div>`;

        html += `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${imgDisplay}
                        <span>${item.name}</span>
                    </div>
                </td>
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
    const name = document.getElementById('testi-name').value.trim();
    const role = document.getElementById('testi-role').value.trim();
    const quote = document.getElementById('testi-quote').value.trim();


    if (!name || !role || !quote) {
        alert("⚠️ Mohon isi Nama, Jabatan, dan Kutipan sebelum menyimpan!");
        return; 
    }

    const btn = document.querySelector('#btn-group-testi button');
    btn.innerText = "Mengupload..."; btn.disabled = true;


    const imgUrl = await uploadImage('testi-img');

    await fetch(`${API_URL}/testimonials`, { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: name, 
            role: role,
            quote: quote,
            image_url: imgUrl
        })
    });
    
    alert('Sukses'); 
    resetFormTesti(); 
    loadTestimonials();
    btn.innerText = "+ Simpan Testimoni"; 
    btn.disabled = false;
}

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
    const on = document.getElementById('original-name-testi').value;
    
    let imgUrl = null;
    const fileInput = document.getElementById('testi-img');
    if(fileInput.files.length > 0) {
        imgUrl = await uploadImage('testi-img');
    }

    const bodyData = {
        name: document.getElementById('testi-name').value,
        role: document.getElementById('testi-role').value,
        quote: document.getElementById('testi-quote').value
    };
    if (imgUrl) bodyData.image_url = imgUrl;

    await fetch(`${API_URL}/testimonials/${on}`, { method: 'PUT', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(bodyData)
    });
    alert('Updated!'); resetFormTesti(); loadTestimonials();
}

function resetFormTesti() {
    document.getElementById('testi-name').value = ''; document.getElementById('testi-role').value = ''; document.getElementById('testi-quote').value = '';
    document.getElementById('testi-img').value = '';
    document.getElementById('original-name-testi').value = '';
    document.getElementById('form-title-testi').innerText = "Tambah Testimoni";
    document.getElementById('btn-cancel-testi').style.display = 'none';
    document.getElementById('btn-group-testi').innerHTML = `<button class="btn-primary" onclick="addTesti()">+ Simpan Testimoni</button>`;
}
async function delTesti(n) { if(confirm('Hapus?')) { await fetch(`${API_URL}/testimonials/${n}`, {method:'DELETE'}); loadTestimonials(); }}


async function loadMessages() {
    const data = await (await fetch(`${API_URL}/messages`)).json();
    let html = '';
    data.forEach(item => {
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


async function delMsg(email) { 
    if(confirm('Hapus Pesan?')) { await fetch(`${API_URL}/messages/${email}`, {method:'DELETE'}); loadMessages(); } 
}