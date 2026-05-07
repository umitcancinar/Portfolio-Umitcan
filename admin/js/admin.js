/* ===========================================
   APPLE-INSPIRED ADMIN PANEL - admin.js
   =========================================== */
'use strict';

const ADMIN = {
    API: 'http://localhost:3001/api',
    token: null,
    user: null,
    currentPage: 'dashboard',
    isLoginPage: !!document.querySelector('.login-body'),
};

/* ===========================================
   1. THEME MANAGEMENT
   =========================================== */
const Theme = {
    init() {
        const theme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
        this.set(theme);
        this._bind();
    },
    set(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    },
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        this.set(current === 'dark' ? 'light' : 'dark');
    },
    _bind() {
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
        window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) this.set(e.matches ? 'dark' : 'light');
        });
    }
};

/* ===========================================
   2. TOAST NOTIFICATIONS
   =========================================== */
const Toast = {
    container: null,
    init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.id = 'toastContainer';
            this.container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.container);
        }
    },
    show(msg, type = 'info', duration = 3500) {
        if (!this.container) this.init();
        const el = document.createElement('div');
        el.className = 'toast ' + type;
        const icons = { success: '\u2713', error: '\u2715', info: '\u2139' };
        el.innerHTML = '<span>' + (icons[type] || '\u2139') + '</span><span>' + msg + '</span>';
        this.container.appendChild(el);
        setTimeout(() => {
            el.classList.add('hiding');
            setTimeout(() => el.remove(), 300);
        }, duration);
    }
};

/* ===========================================
   3. API CLIENT
   =========================================== */
const API = {
    async request(endpoint, options = {}) {
        const url = ADMIN.API + endpoint;
        const config = { headers: {}, ...options };
        if (ADMIN.token) config.headers['Authorization'] = 'Bearer ' + ADMIN.token;
        if (!(options.body instanceof FormData)) config.headers['Content-Type'] = 'application/json';
        try {
            const res = await fetch(url, config);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || 'HTTP ' + res.status + ': istek basarisiz');
            return data;
        } catch (err) {
            if (err.message === 'Failed to fetch') throw new Error('Sunucuya baglanilamadi. Backend calisiyor mu?');
            throw err;
        }
    },
    get(endpoint) { return this.request(endpoint); },
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    del(endpoint) { return this.request(endpoint, { method: 'DELETE' }); },
    upload(endpoint, formData) { return this.request(endpoint, { method: 'POST', body: formData }); },
};

/* ===========================================
   4. AUTHENTICATION
   =========================================== */
const Auth = {
    init() {
        ADMIN.token = localStorage.getItem('admin_token');
        ADMIN.user = JSON.parse(localStorage.getItem('admin_user') || 'null');
        if (ADMIN.isLoginPage) { this._bindLogin(); return; }
        if (!ADMIN.token) { window.location.href = 'login.html'; return; }
        this._verify().catch(() => { this._clear(); window.location.href = 'login.html'; });
        this._bindLogout();
    },
    async _verify() {
        try {
            const data = await API.post('/auth/verify');
            if (data.valid && data.user) {
                ADMIN.user = data.user;
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                const av = document.getElementById('topbarAvatar');
                const un = document.getElementById('topbarUsername');
                if (av) av.textContent = (data.user.username || 'A').charAt(0).toUpperCase();
                if (un) un.textContent = data.user.username || 'Admin';
            }
        } catch (err) { this._clear(); window.location.href = 'login.html'; }
    },
    _bindLogin() {
        const form = document.getElementById('loginForm');
        const err = document.getElementById('loginError');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('loginBtn');
            const user = document.getElementById('email').value.trim();
            const pass = document.getElementById('password').value.trim();
            if (!user || !pass) { err.textContent = 'Lutfen tum alanlari doldurun.'; return; }
            btn.classList.add('loading'); err.textContent = '';
            try {
                const data = await API.post('/auth/login', { email: user, password: pass });
                ADMIN.token = data.accessToken; ADMIN.user = data.user;
                localStorage.setItem('admin_token', data.accessToken);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                if (data.refreshToken) localStorage.setItem('admin_refresh', data.refreshToken);
                Toast.show('Giris basarili, yonlendiriliyor...', 'success', 1500);
                setTimeout(() => { window.location.href = 'index.html'; }, 800);
            } catch (err2) { err.textContent = err2.message; }
            finally { btn.classList.remove('loading'); }
        });
    },
    _bindLogout() {
        const btn = document.getElementById('logoutBtn');
        if (btn) btn.addEventListener('click', () => this.logout());
    },
    logout() { this._clear(); window.location.href = 'login.html'; },
    _clear() {
        ADMIN.token = null; ADMIN.user = null;
        ['admin_token','admin_user','admin_refresh'].forEach(k => localStorage.removeItem(k));
    }
};

/* ===========================================
   5. NAVIGATION & PAGE ROUTER
   =========================================== */
const Router = {
    init() {
        if (ADMIN.isLoginPage) return;
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) this.navigate(page);
            });
        });
        document.querySelectorAll('.sidebar-logo[data-page]').forEach(item => {
            item.addEventListener('click', (e) => { e.preventDefault(); this.navigate('dashboard'); });
        });
        this._bindMobile();
        this.navigate('dashboard');
    },
    navigate(page) {
        ADMIN.currentPage = page;
        document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
        const active = document.querySelector('.nav-item[data-page="' + page + '"]');
        if (active) active.classList.add('active');
        const titles = {
            dashboard:'Dashboard',content:'Icerik Yonetimi',projects:'Proje Yonetimi',
            references:'Referans Yonetimi',messages:'Mesaj Kutusu',cv:'CV Yonetimi',
            chatbot:'Chatbot Yonetimi',game:'Oyun Skorlari',settings:'Ayarlar'
        };
        document.getElementById('topbarTitle').textContent = titles[page] || page;
        this._render(page);
        this._closeSidebar();
    },
    _render(page) {
        const container = document.getElementById('pageContainer');
        if (!container) return;
        const renderer = Pages[page];
        container.innerHTML = renderer ? renderer() : '<div class="spinner"><div class="spinner-circle"></div></div>';
        if (typeof Pages[page + 'Init'] === 'function') {
            setTimeout(() => Pages[page + 'Init'](), 100);
        }
    },
    _bindMobile() {
        const toggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (toggle) toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
        if (overlay) overlay.addEventListener('click', () => this._closeSidebar());
    },
    _closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }
};

/* ===========================================
   6. MODAL HELPERS
   =========================================== */
const Modal = {
    confirm(msg, title) {
        title = title || 'Emin misiniz?';
        return new Promise((resolve) => {
            const overlay = document.getElementById('confirmModal');
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmText').textContent = msg;
            overlay.style.display = 'flex';
            const ok = document.getElementById('confirmOk');
            const cancel = document.getElementById('confirmCancel');
            const handler = function(val) {
                overlay.style.display = 'none';
                ok.removeEventListener('click', okH);
                cancel.removeEventListener('click', cancelH);
                resolve(val);
            };
            const okH = function() { handler(true); };
            const cancelH = function() { handler(false); };
            ok.addEventListener('click', okH);
            cancel.addEventListener('click', cancelH);
            overlay.addEventListener('click', function(e) { if (e.target === overlay) handler(false); });
        });
    },
    detail(title, bodyHTML) {
        const overlay = document.getElementById('detailModal');
        document.getElementById('detailTitle').textContent = title;
        document.getElementById('detailBody').innerHTML = bodyHTML;
        overlay.style.display = 'flex';
        const close = function() { overlay.style.display = 'none'; };
        document.getElementById('detailClose').onclick = close;
        overlay.onclick = function(e) { if (e.target === overlay) close(); };
    }
};

/* ===========================================
   7. PAGES
   =========================================== */
const Pages = {
    H: {
        esc: function(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; },
        date: function(d) { if (!d) return '-'; const dt = new Date(d); return dt.toLocaleDateString('tr-TR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }); },
    },

    /* DASHBOARD */
    dashboard() {
        const h = this.H;
        return '<div class="page active"><div class="page-header"><h2>Dashboard</h2><p>Hos geldiniz, <strong>' + h.esc(ADMIN.user ? ADMIN.user.username : 'Admin') + '</strong></p></div>' +
        '<div class="stats-grid" id="dashboardStats">' +
            '<div class="stat-card"><div class="stat-card-icon">📁</div><div class="stat-card-value" id="statProjects">-</div><div class="stat-card-label">Toplam Proje</div></div>' +
            '<div class="stat-card"><div class="stat-card-icon">✉️</div><div class="stat-card-value" id="statMessages">-</div><div class="stat-card-label">Okunmamis Mesaj</div></div>' +
            '<div class="stat-card"><div class="stat-card-icon">⭐</div><div class="stat-card-value" id="statReferences">-</div><div class="stat-card-label">Referans</div></div>' +
            '<div class="stat-card"><div class="stat-card-icon">📄</div><div class="stat-card-value" id="statCV">-</div><div class="stat-card-label">CV Durumu</div></div>' +
        '</div>' +
        '<div class="card"><div class="card-header"><span class="card-title">Son Mesajlar</span><a href="#" onclick="Router.navigate(\'messages\');return false" style="font-size:0.82rem">Tumunu Gor →</a></div><div id="recentMessages"><div class="spinner"><div class="spinner-circle"></div></div></div></div>' +
        '<div class="card mt-16"><div class="card-header"><span class="card-title">Hizli Islemler</span></div><div class="gap-8" style="flex-wrap:wrap">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'projects\')">+ Yeni Proje</button>' +
            '<button class="btn btn-secondary" onclick="Router.navigate(\'content\')">Icerik Duzenle</button>' +
            '<button class="btn btn-secondary" onclick="Router.navigate(\'cv\')">CV Yukle</button>' +
        '</div></div></div>';
    },
    dashboardInit() {
        var h = this.H;
        Promise.all([
            API.get('/projects').catch(function() { return { projects: [] }; }),
            API.get('/messages?is_read=false').catch(function() { return { messages: [], count: 0 }; }),
            API.get('/references').catch(function() { return { references: [] }; }),
            API.get('/upload/cv/latest').catch(function() { return null; }),
        ]).then(function(results) {
            var proj = results[0], msg = results[1], ref = results[2], cv = results[3];
            document.getElementById('statProjects').textContent = (proj.projects || []).length;
            document.getElementById('statMessages').textContent = msg.count || (msg.messages || []).length;
            document.getElementById('statReferences').textContent = (ref.references || []).length;
            document.getElementById('statCV').textContent = cv ? '✓ Yuklu' : '✗ Yok';
            var recent = (msg.messages || []).slice(0, 5);
            var html = recent.length ? recent.map(function(m) {
                return '<div style="padding:10px 0;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center">' +
                    '<div><strong style="font-size:0.88rem">' + h.esc(m.name) + '</strong><br><span class="text-secondary text-sm">' + h.esc(m.message).substring(0,60) + '...</span></div>' +
                    '<span class="text-secondary text-sm">' + h.date(m.created_at) + '</span></div>';
            }).join('') : '<div class="empty-state"><p>Henuz mesaj yok</p></div>';
            document.getElementById('recentMessages').innerHTML = html;
        }).catch(function() {});
    },

    /* CONTENT MANAGEMENT */
    content() {
        return '<div class="page active"><div class="page-header"><h2>Icerik Yonetimi</h2><p>Site bolumlerinin iceriklerini duzenleyin</p></div><div id="contentSections"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    contentInit() { this._loadContent(); },
    async _loadContent() {
        var self = this, h = this.H;
        try {
            var data = await API.get('/content');
            var sections = data.sections || [];
            var html = sections.map(function(s) {
                return '<div class="section-card"><div class="card-header"><span class="card-title" style="text-transform:capitalize">' + s.section_key + '</span><span class="card-subtitle">' + h.esc(s.subtitle||'') + '</span></div><div id="content-' + s.section_key + '"></div><button class="btn btn-primary btn-sm mt-16" onclick="Pages._editContent(\'' + s.section_key + '\')">Duzenle</button><div id="edit-' + s.section_key + '" style="display:none;margin-top:16px"></div></div>';
            }).join('');
            document.getElementById('contentSections').innerHTML = html || '<div class="empty-state"><p>Henuz icerik bolumu yok</p></div>';
            sections.forEach(function(s) {
                var c = typeof s.content === 'object' ? s.content : {};
                var preview;
                if (s.section_key === 'hero') {
                    preview = '<p><strong>Isim:</strong> ' + h.esc(c.name||'-') + '</p><p><strong>Unvan:</strong> ' + h.esc(c.title||'-') + '</p><p><strong>Aciklama:</strong> ' + h.esc(c.description||'-') + '</p><p><strong>CTA:</strong> ' + h.esc(c.cta||'-') + '</p>';
                } else if (s.section_key === 'about') {
                    preview = '<p><strong>Paragraflar:</strong> ' + (c.paragraphs||[]).length + ' adet</p><p><strong>Ozellikler:</strong> ' + (c.features||[]).length + ' adet</p>';
                } else if (s.section_key === 'skills') {
                    preview = '<p><strong>Kategoriler:</strong> ' + (c.categories||[]).length + ' adet</p>';
                } else if (s.section_key === 'contact') {
                    preview = '<p><strong>Email:</strong> ' + h.esc(c.email||'-') + '</p><p><strong>Telefon:</strong> ' + h.esc(c.phone||'-') + '</p>';
                } else {
                    preview = '<p>' + JSON.stringify(c) + '</p>';
                }
                var el = document.getElementById('content-' + s.section_key);
                if (el) el.innerHTML = preview;
            });
        } catch (err) {
            document.getElementById('contentSections').innerHTML = '<div class="empty-state"><p>Hata: ' + h.esc(err.message) + '</p></div>';
        }
    },

    _editContent(key) {
        var editDiv = document.getElementById('edit-' + key);
        var isOpen = editDiv.style.display !== 'none';
        if (isOpen) { editDiv.style.display = 'none'; return; }
        var self = this, h = this.H;
        API.get('/content/' + key).then(function(data) {
            var c = typeof data.content === 'object' ? data.content : {};
            var fields = '';
            if (key === 'hero') {
                fields = '<div class="form-group"><label class="form-label">Isim</label><input class="form-input" id="ec-name" value="' + h.esc(c.name||'') + '"></div>' +
                    '<div class="form-group"><label class="form-label">Unvan</label><input class="form-input" id="ec-title" value="' + h.esc(c.title||'') + '"></div>' +
                    '<div class="form-group"><label class="form-label">Aciklama</label><textarea class="form-textarea" id="ec-desc">' + h.esc(c.description||'') + '</textarea></div>' +
                    '<div class="form-group"><label class="form-label">CTA Metni</label><input class="form-input" id="ec-cta" value="' + h.esc(c.cta||'') + '"></div>';
            } else if (key === 'about') {
                fields = '<div class="form-group"><label class="form-label">Paragraflar (--- ile ayirin)</label><textarea class="form-textarea" id="ec-paras">' + h.esc((c.paragraphs||['']).join('\n---\n')) + '</textarea></div>' +
                    '<div class="form-group"><label class="form-label">Ozellikler (her satira bir tane)</label><textarea class="form-textarea" id="ec-features">' + h.esc((c.features||[]).map(function(f) { return typeof f === 'object' ? (f.text||f.icon||'') : f; }).join('\n')) + '</textarea></div>' +
                    '<div class="form-group"><label class="form-label">Istatistikler (etiket:deger, her satir)</label><textarea class="form-textarea" id="ec-stats">' + h.esc((c.stats||[]).map(function(s) { return (s.label||'') + ':' + (s.value||0); }).join('\n')) + '</textarea></div>';
            } else if (key === 'skills') {
                var catsText = (c.categories||[]).map(function(cat) {
                    return (cat.name||'') + '|' + (cat.icon||'') + '\n' + (cat.items||[]).map(function(it) { return (it.name||'') + '=' + (it.percent||0); }).join('\n');
                }).join('\n---\n');
                fields = '<div class="form-group"><label class="form-label">Kategoriler (--- ile ayir, ad|ikon, alt satirlara ad=yuzde)</label><textarea class="form-textarea" id="ec-skills" rows="8">' + h.esc(catsText) + '</textarea></div>';
            } else if (key === 'contact') {
                fields = '<div class="form-group"><label class="form-label">Email</label><input class="form-input" id="ec-email" value="' + h.esc(c.email||'') + '"></div>' +
                    '<div class="form-group"><label class="form-label">Telefon</label><input class="form-input" id="ec-phone" value="' + h.esc(c.phone||'') + '"></div>';
            }
            editDiv.innerHTML = fields + '<div class="gap-8 mt-16"><button class="btn btn-primary btn-sm" onclick="Pages._saveContent(\'' + key + '\')">Kaydet</button><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'edit-' + key + '\').style.display=\'none\'">Iptal</button></div>';
            editDiv.style.display = 'block';
        }).catch(function(err) { Toast.show('Icerik yuklenemedi: ' + err.message, 'error'); });
    },
    async _saveContent(key) {
        var content = {};
        if (key === 'hero') {
            content = {
                name: (document.getElementById('ec-name') && document.getElementById('ec-name').value) || '',
                title: (document.getElementById('ec-title') && document.getElementById('ec-title').value) || '',
                description: (document.getElementById('ec-desc') && document.getElementById('ec-desc').value) || '',
                cta: (document.getElementById('ec-cta') && document.getElementById('ec-cta').value) || ''
            };
        } else if (key === 'about') {
            var parasVal = (document.getElementById('ec-paras') && document.getElementById('ec-paras').value) || '';
            var featVal = (document.getElementById('ec-features') && document.getElementById('ec-features').value) || '';
            var statsVal = (document.getElementById('ec-stats') && document.getElementById('ec-stats').value) || '';
            content = {
                paragraphs: parasVal.split('\n---\n').filter(Boolean),
                features: featVal.split('\n').filter(Boolean).map(function(f) { return { text: f, icon: '' }; }),
                stats: statsVal.split('\n').filter(Boolean).map(function(s) {
                    var parts = s.split(':');
                    return { label: (parts[0]||'').trim(), value: parseInt(parts[1]) || 0 };
                })
            };
        } else if (key === 'skills') {
            var catsVal = (document.getElementById('ec-skills') && document.getElementById('ec-skills').value) || '';
            var cats = catsVal.split('\n---\n').filter(Boolean);
            content = {
                categories: cats.map(function(catBlock) {
                    var lines = catBlock.trim().split('\n').filter(Boolean);
                    var nameIcon = (lines[0]||'').split('|');
                    return {
                        name: (nameIcon[0]||'').trim(),
                        icon: (nameIcon[1]||'').trim(),
                        items: lines.slice(1).map(function(line) {
                            var parts = line.split('=');
                            return { name: (parts[0]||'').trim(), percent: parseInt(parts[1]) || 0 };
                        })
                    };
                })
            };
        } else if (key === 'contact') {
            content = {
                email: (document.getElementById('ec-email') && document.getElementById('ec-email').value) || '',
                phone: (document.getElementById('ec-phone') && document.getElementById('ec-phone').value) || ''
            };
        }
        try {
            await API.put('/content/' + key, { content: content });
            Toast.show('Icerik basariyla guncellendi!', 'success');
            document.getElementById('edit-' + key).style.display = 'none';
            this._loadContent();
        } catch (err) { Toast.show('Kayit basarisiz: ' + err.message, 'error'); }
    },

    /* PROJECTS */
    projects() {
        return '<div class="page active"><div class="page-header flex-between"><div><h2>Proje Yonetimi</h2><p>Tum projeleri goruntuleyin ve yonetin</p></div><button class="btn btn-primary" onclick="Pages._showProjectForm()">+ Yeni Proje</button></div><div id="projectForm" style="display:none"></div><div id="projectsList"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    projectsInit() { this._loadProjects(); },
    async _loadProjects() {
        var h = this.H;
        try {
            var data = await API.get('/projects');
            var projects = data.projects || [];
            if (!projects.length) {
                document.getElementById('projectsList').innerHTML = '<div class="empty-state"><p>Henuz proje yok. Ilk projenizi ekleyin!</p></div>';
                return;
            }
            var rows = projects.map(function(p, i) {
                var tags = (p.tags||[]).map(function(t) { return '<span class="tag">' + h.esc(t) + '</span>'; }).join('');
                var img = p.image_url ? '<img src="http://localhost:3001' + h.esc(p.image_url) + '" class="thumb-img" alt="">' : '<div class="thumb-img" style="display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--color-text-secondary)">🖼</div>';
                return '<tr><td>' + img + '</td><td><strong>' + h.esc(p.title) + '</strong></td><td>' + h.esc((p.description||'').substring(0,60)) + '</td><td><div class="tags">' + tags + '</div></td><td class="table-actions">' +
                    '<button class="btn-icon" onclick="Pages._editProject(' + p.id + ')" title="Duzenle"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 2l3 3-9 9H2v-3l9-9z"/></svg></button>' +
                    '<button class="btn-icon danger" onclick="Pages._deleteProject(' + p.id + ')" title="Sil"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/></svg></button></td></tr>';
            }).join('');
            document.getElementById('projectsList').innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th></th><th>Baslik</th><th>Aciklama</th><th>Etiketler</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        } catch (err) {
            document.getElementById('projectsList').innerHTML = '<div class="empty-state"><p>Hata: ' + h.esc(err.message) + '</p></div>';
        }
    },
    _showProjectForm(project) {
        var isEdit = !!project;
        var p = project || {};
        var h = this.H;
        var tagsStr = (p.tags||[]).join(', ');
        var formHTML = '<div class="card"><div class="card-header"><span class="card-title">' + (isEdit ? 'Proje Duzenle' : 'Yeni Proje') + '</span></div>' +
            '<div class="form-row"><div class="form-group"><label class="form-label">Baslik *</label><input class="form-input" id="pj-title" value="' + h.esc(p.title||'') + '"></div>' +
            '<div class="form-group"><label class="form-label">Gorsel URL</label><input class="form-input" id="pj-image" value="' + h.esc(p.image_url||'') + '" placeholder="/uploads/projects/..."></div></div>' +
            '<div class="form-group"><label class="form-label">Aciklama</label><textarea class="form-textarea" id="pj-desc">' + h.esc(p.description||'') + '</textarea></div>' +
            '<div class="form-row"><div class="form-group"><label class="form-label">Etiketler (virgulle ayirin)</label><input class="form-input" id="pj-tags" value="' + h.esc(tagsStr) + '"></div>' +
            '<div class="form-group"><label class="form-label">Sira</label><input class="form-input" type="number" id="pj-order" value="' + (p.order||0) + '"></div></div>' +
            '<div class="form-row"><div class="form-group"><label class="form-label">Demo URL</label><input class="form-input" id="pj-demo" value="' + h.esc(p.demo_url||'') + '"></div>' +
            '<div class="form-group"><label class="form-label">GitHub URL</label><input class="form-input" id="pj-github" value="' + h.esc(p.github_url||'') + '"></div></div>' +
            '<div class="form-group"><label class="form-label">Gorsel Yukle</label><div class="file-upload" id="pjFileUpload"><input type="file" id="pj-file" accept="image/*"><span class="file-upload-info">Surukle birak veya tikla</span></div></div>' +
            '<div class="gap-8 mt-16"><button class="btn btn-primary" id="pj-save">' + (isEdit ? 'Guncelle' : 'Kaydet') + '</button>' +
            '<button class="btn btn-secondary" onclick="document.getElementById(\'projectForm\').style.display=\'none\'">Iptal</button></div></div>';
        document.getElementById('projectForm').innerHTML = formHTML;
        document.getElementById('projectForm').style.display = 'block';
        var self = this;
        document.getElementById('pj-save').addEventListener('click', function() {
            var fileInput = document.getElementById('pj-file');
            if (fileInput && fileInput.files && fileInput.files[0]) {
                var fd = new FormData();
                fd.append('image', fileInput.files[0]);
                API.upload('/upload/project-image', fd).then(function(uploadData) {
                    document.getElementById('pj-image').value = uploadData.url;
                    self._saveProject(isEdit ? p.id : null);
                }).catch(function(err) { Toast.show('Gorsel yuklenemedi: ' + err.message, 'error'); });
            } else {
                self._saveProject(isEdit ? p.id : null);
            }
        });
    },
    _editProject(id) {
        var self = this;
        API.get('/projects/' + id).then(function(data) {
            self._showProjectForm(data.project);
        }).catch(function(err) { Toast.show('Proje yuklenemedi: ' + err.message, 'error'); });
    },
    async _saveProject(id) {
        var project = {
            title: document.getElementById('pj-title').value,
            description: document.getElementById('pj-desc').value,
            image_url: document.getElementById('pj-image').value,
            tags: (document.getElementById('pj-tags').value || '').split(',').map(function(t) { return t.trim(); }).filter(Boolean),
            order: parseInt(document.getElementById('pj-order').value) || 0,
            demo_url: document.getElementById('pj-demo').value,
            github_url: document.getElementById('pj-github').value
        };
        try {
            if (id) {
                await API.put('/projects/' + id, project);
                Toast.show('Proje guncellendi!', 'success');
            } else {
                await API.post('/projects', project);
                Toast.show('Proje olusturuldu!', 'success');
            }
            document.getElementById('projectForm').style.display = 'none';
            this._loadProjects();
        } catch (err) { Toast.show('Kayit basarisiz: ' + err.message, 'error'); }
    },
    async _deleteProject(id) {
        var ok = await Modal.confirm('Bu projeyi silmek istediginize emin misiniz?', 'Proje Sil');
        if (!ok) return;
        try {
            await API.del('/projects/' + id);
            Toast.show('Proje silindi.', 'success');
            this._loadProjects();
        } catch (err) { Toast.show('Silme basarisiz: ' + err.message, 'error'); }
    },

    /* REFERENCES */
    references() {
        return '<div class="page active"><div class="page-header flex-between"><div><h2>Referans Yonetimi</h2><p>Referanslari goruntuleyin ve yonetin</p></div><button class="btn btn-primary" onclick="Pages._showRefForm()">+ Yeni Referans</button></div><div id="refForm" style="display:none"></div><div id="refList"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    referencesInit() { this._loadRefs(); },
    async _loadRefs() {
        var h = this.H;
        try {
            var data = await API.get('/references?all=true');
            var refs = data.references || [];
            if (!refs.length) {
                document.getElementById('refList').innerHTML = '<div class="empty-state"><p>Henuz referans yok.</p></div>';
                return;
            }
            var rows = refs.map(function(r) {
                return '<tr><td><strong>' + h.esc(r.client_name) + '</strong></td><td>' + h.esc(r.project_name||'-') + '</td><td>' + h.esc((r.description||'').substring(0,50)) + '</td><td><span class="badge-status ' + (r.is_active ? 'badge-active' : 'badge-inactive') + '">' + (r.is_active ? 'Aktif' : 'Pasif') + '</span></td><td class="table-actions">' +
                    '<button class="btn-icon" onclick="Pages._editRef(' + r.id + ')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 2l3 3-9 9H2v-3l9-9z"/></svg></button>' +
                    '<button class="btn-icon danger" onclick="Pages._deleteRef(' + r.id + ')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/></svg></button></td></tr>';
            }).join('');
            document.getElementById('refList').innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th>Musteri</th><th>Proje</th><th>Aciklama</th><th>Durum</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        } catch (err) { document.getElementById('refList').innerHTML = '<div class="empty-state"><p>Hata: ' + h.esc(err.message) + '</p></div>'; }
    },
    _showRefForm(ref) {
        var isEdit = !!ref;
        var r = ref || {};
        var h = this.H;
        var html = '<div class="card"><div class="card-header"><span class="card-title">' + (isEdit ? 'Referans Duzenle' : 'Yeni Referans') + '</span></div>' +
            '<div class="form-row"><div class="form-group"><label class="form-label">Musteri Adi *</label><input class="form-input" id="rf-client" value="' + h.esc(r.client_name||'') + '"></div>' +
            '<div class="form-group"><label class="form-label">Proje Adi</label><input class="form-input" id="rf-project" value="' + h.esc(r.project_name||'') + '"></div></div>' +
            '<div class="form-group"><label class="form-label">Aciklama</label><textarea class="form-textarea" id="rf-desc">' + h.esc(r.description||'') + '</textarea></div>' +
            '<div class="form-group"><label class="form-label">Referans Metni</label><textarea class="form-textarea" id="rf-testimonial">' + h.esc(r.testimonial||'') + '</textarea></div>' +
            '<div class="form-row"><div class="form-group"><label class="form-label">Logo URL</label><input class="form-input" id="rf-logo" value="' + h.esc(r.logo_url||'') + '"></div>' +
            '<div class="form-group"><label class="form-label">Link</label><input class="form-input" id="rf-link" value="' + h.esc(r.link_url||'') + '"></div></div>' +
            '<div class="form-row"><div class="form-group"><label class="form-label">Sira</label><input class="form-input" type="number" id="rf-order" value="' + (r.order||0) + '"></div>' +
            '<div class="form-group"><label class="form-check"><input type="checkbox" id="rf-active" ' + (r.is_active !== false ? 'checked' : '') + '> Aktif</label></div></div>' +
            '<div class="form-group"><label class="form-label">Logo Yukle</label><div class="file-upload"><input type="file" id="rf-file" accept="image/*"><span class="file-upload-info">Logo secin</span></div></div>' +
            '<div class="gap-8 mt-16"><button class="btn btn-primary" id="rf-save">' + (isEdit ? 'Guncelle' : 'Kaydet') + '</button><button class="btn btn-secondary" onclick="document.getElementById(\'refForm\').style.display=\'none\'">Iptal</button></div></div>';
        document.getElementById('refForm').innerHTML = html;
        document.getElementById('refForm').style.display = 'block';
        var self = this;
        document.getElementById('rf-save').addEventListener('click', function() {
            var fileInput = document.getElementById('rf-file');
            if (fileInput && fileInput.files && fileInput.files[0]) {
                var fd = new FormData();
                fd.append('logo', fileInput.files[0]);
                API.upload('/upload/reference-logo', fd).then(function(uploadData) {
                    document.getElementById('rf-logo').value = uploadData.url;
                    self._saveRef(isEdit ? r.id : null);
                }).catch(function(err) { Toast.show('Logo yuklenemedi: ' + err.message, 'error'); });
            } else { self._saveRef(isEdit ? r.id : null); }
        });
    },
    _editRef(id) {
        var self = this;
        API.get('/references').then(function(data) {
            var ref = (data.references||[]).find(function(r) { return r.id == id; });
            if (ref) self._showRefForm(ref);
        }).catch(function(err) { Toast.show('Referans yuklenemedi', 'error'); });
    },
    async _saveRef(id) {
        var ref = {
            client_name: document.getElementById('rf-client').value,
            project_name: document.getElementById('rf-project').value,
            description: document.getElementById('rf-desc').value,
            testimonial: document.getElementById('rf-testimonial').value,
            logo_url: document.getElementById('rf-logo').value,
            link_url: document.getElementById('rf-link').value,
            order: parseInt(document.getElementById('rf-order').value) || 0,
            is_active: document.getElementById('rf-active').checked
        };
        try {
            if (id) { await API.put('/references/' + id, ref); Toast.show('Referans guncellendi!', 'success'); }
            else { await API.post('/references', ref); Toast.show('Referans olusturuldu!', 'success'); }
            document.getElementById('refForm').style.display = 'none';
            this._loadRefs();
        } catch (err) { Toast.show('Kayit basarisiz: ' + err.message, 'error'); }
    },
    async _deleteRef(id) {
        var ok = await Modal.confirm('Bu referansi silmek istediginize emin misiniz?', 'Referans Sil');
        if (!ok) return;
        try { await API.del('/references/' + id); Toast.show('Referans silindi.', 'success'); this._loadRefs(); }
        catch (err) { Toast.show('Silme basarisiz: ' + err.message, 'error'); }
    },

    /* MESSAGES */
    messages() {
        return '<div class="page active"><div class="page-header flex-between"><div><h2>Mesaj Kutusu</h2><p>Gelen mesajlari goruntuleyin</p></div><div class="gap-8"><button class="btn btn-outline btn-sm" id="msgFilterUnread">Okunmamis</button><button class="btn btn-outline btn-sm" id="msgFilterAll">Tumu</button></div></div><div id="msgList"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    messagesInit() {
        var self = this;
        this._loadMessages();
        document.getElementById('msgFilterUnread').addEventListener('click', function() { self._loadMessages('false'); });
        document.getElementById('msgFilterAll').addEventListener('click', function() { self._loadMessages(); });
    },
    async _loadMessages(filter) {
        var h = this.H;
        try {
            var qs = filter === 'false' ? '?is_read=false' : '';
            var data = await API.get('/messages' + qs);
            var msgs = data.messages || [];
            var unreadBadge = document.getElementById('unreadBadge');
            if (unreadBadge) {
                var unreadCount = msgs.filter(function(m) { return !m.is_read; }).length;
                unreadBadge.textContent = unreadCount;
                unreadBadge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
            }
            if (!msgs.length) { document.getElementById('msgList').innerHTML = '<div class="empty-state"><p>Mesaj bulunamadi.</p></div>'; return; }
            var rows = msgs.map(function(m) {
                return '<tr style="cursor:pointer" onclick="Pages._showMessage(' + m.id + ')"><td><strong>' + h.esc(m.name) + '</strong><br><span class="text-secondary text-sm">' + h.esc(m.email) + '</span></td><td>' + h.esc((m.message||'').substring(0,60)) + '...</td><td><span class="badge-status ' + (m.is_read ? 'badge-read' : 'badge-unread') + '">' + (m.is_read ? 'Okundu' : 'Yeni') + '</span></td><td class="text-secondary text-sm">' + h.date(m.created_at) + '</td><td class="table-actions">' +
                    (!m.is_read ? '<button class="btn-icon" onclick="event.stopPropagation();Pages._markRead(' + m.id + ')" title="Okundu isaretle"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="2 8 6 12 14 4"/></svg></button>' : '') +
                    '<button class="btn-icon danger" onclick="event.stopPropagation();Pages._deleteMsg(' + m.id + ')" title="Sil"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/></svg></button></td></tr>';
            }).join('');
            document.getElementById('msgList').innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th>Gonderen</th><th>Mesaj</th><th>Durum</th><th>Tarih</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        } catch (err) { document.getElementById('msgList').innerHTML = '<div class="empty-state"><p>Hata: ' + h.esc(err.message) + '</p></div>'; }
    },
    async _showMessage(id) {
        var h = this.H;
        try {
            var data = await API.get('/messages');
            var m = (data.messages||[]).find(function(x) { return x.id == id; });
            if (!m) return;
            var html = '<div class="msg-meta"><span><strong>Gonderen:</strong> ' + h.esc(m.name) + '</span><span><strong>Email:</strong> ' + h.esc(m.email) + '</span><span><strong>Tarih:</strong> ' + h.date(m.created_at) + '</span><span><strong>Durum:</strong> <span class="badge-status ' + (m.is_read ? 'badge-read' : 'badge-unread') + '">' + (m.is_read ? 'Okundu' : 'Yeni') + '</span></span></div><div class="msg-body">' + h.esc(m.message) + '</div>';
            Modal.detail('Mesaj Detayi', html);
            if (!m.is_read) this._markRead(id);
        } catch (err) { Toast.show('Mesaj yuklenemedi', 'error'); }
    },
    async _markRead(id) {
        try { await API.put('/messages/' + id + '/read'); this._loadMessages(); }
        catch (err) { /* silent */ }
    },
    async _deleteMsg(id) {
        var ok = await Modal.confirm('Bu mesaji silmek istediginize emin misiniz?', 'Mesaj Sil');
        if (!ok) return;
        try { await API.del('/messages/' + id); Toast.show('Mesaj silindi.', 'success'); this._loadMessages(); }
        catch (err) { Toast.show('Silme basarisiz: ' + err.message, 'error'); }
    },

    /* CV MANAGEMENT */
    cv() {
        return '<div class="page active"><div class="page-header"><h2>CV Yonetimi</h2><p>CV dosyanizi yukleyin ve yonetin</p></div><div id="cvContent"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    cvInit() { this._loadCv(); },
    async _loadCv() {
        var h = this.H;
        try {
            var data = await API.get('/upload/cv/latest');
            var cv = data.cv;
            var html = '<div class="cv-card"><div class="cv-card-icon">📄</div><div class="cv-card-info"><div class="cv-card-name">' + h.esc(cv.original_name) + '</div><div class="cv-card-date">Yuklenme: ' + h.date(cv.uploaded_at) + '</div></div>' +
                '<div class="gap-8"><a href="http://localhost:3001' + h.esc(cv.file_url) + '" target="_blank" class="btn btn-outline btn-sm">Goruntule</a>' +
                '<button class="btn btn-danger btn-sm" onclick="Pages._deleteCv(' + cv.id + ')">Sil</button></div></div>';
            document.getElementById('cvContent').innerHTML = html;
        } catch (err) {
            document.getElementById('cvContent').innerHTML = '<div class="empty-state"><p>Henuz CV yuklenmemis.</p></div>' +
                '<div class="card mt-16"><div class="card-header"><span class="card-title">CV Yukle</span></div>' +
                '<div class="file-upload" id="cvUploadArea"><input type="file" id="cvFile" accept=".pdf,.doc,.docx"><span class="file-upload-info">PDF yuklemek icin tiklayin</span></div>' +
                '<button class="btn btn-primary mt-16" id="cvUploadBtn">Yukle</button></div>';
            var self = this;
            document.getElementById('cvUploadBtn').addEventListener('click', function() {
                var file = document.getElementById('cvFile').files[0];
                if (!file) { Toast.show('Lutfen bir dosya secin.', 'error'); return; }
                var fd = new FormData();
                fd.append('cv', file);
                API.upload('/upload/cv', fd).then(function() {
                    Toast.show('CV basariyla yuklendi!', 'success');
                    self._loadCv();
                }).catch(function(e) { Toast.show('Yukleme basarisiz: ' + e.message, 'error'); });
            });
        }
    },
    async _deleteCv(id) {
        var ok = await Modal.confirm('Bu CV\'yi silmek istediginize emin misiniz?', 'CV Sil');
        if (!ok) return;
        try {
            await API.del('/upload/cv/' + id);
            Toast.show('CV silindi.', 'success');
            document.getElementById('cvContent').innerHTML = '<div class="empty-state"><p>Henuz CV yuklenmemis.</p></div>';
            this.cvInit();
        } catch (err) { Toast.show('Silme basarisiz: ' + err.message, 'error'); }
    },

    /* CHATBOT */
    chatbot() {
        return '<div class="page active"><div class="page-header flex-between"><div><h2>Chatbot Yonetimi</h2><p>Chatbot yanitlarini yonetin</p></div><button class="btn btn-primary" onclick="Pages._showChatbotForm()">+ Yeni Yanit</button></div><div id="chatbotForm" style="display:none"></div><div id="chatbotList"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    chatbotInit() { this._loadChatbot(); },
    async _loadChatbot() {
        var h = this.H;
        try {
            var data = await API.get('/chatbot/responses');
            var responses = data.responses || [];
            if (!responses.length) { document.getElementById('chatbotList').innerHTML = '<div class="empty-state"><p>Henuz yanit tanimlanmamis.</p></div>'; return; }
            var rows = responses.map(function(r) {
                var keywords = (r.trigger_keywords||[]).map(function(k) { return '<span class="tag">' + h.esc(k) + '</span>'; }).join('');
                return '<tr><td><div class="tags">' + keywords + '</div></td><td>' + h.esc((r.response_text||'').substring(0,80)) + '</td><td><span class="badge-status ' + (r.is_active ? 'badge-active' : 'badge-inactive') + '">' + (r.is_active ? 'Aktif' : 'Pasif') + '</span></td><td class="table-actions">' +
                    '<button class="btn-icon" onclick="Pages._editChatbot(' + r.id + ')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 2l3 3-9 9H2v-3l9-9z"/></svg></button>' +
                    '<button class="btn-icon danger" onclick="Pages._deleteChatbot(' + r.id + ')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/></svg></button></td></tr>';
            }).join('');
            document.getElementById('chatbotList').innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th>Tetikleyici Kelimeler</th><th>Yanit</th><th>Durum</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        } catch (err) { document.getElementById('chatbotList').innerHTML = '<div class="empty-state"><p>Hata: ' + h.esc(err.message) + '</p></div>'; }
    },
    _showChatbotForm(resp) {
        var isEdit = !!resp;
        var r = resp || {};
        var h = this.H;
        var kwStr = (r.trigger_keywords||[]).join(', ');
        var html = '<div class="card"><div class="card-header"><span class="card-title">' + (isEdit ? 'Yanit Duzenle' : 'Yeni Yanit') + '</span></div>' +
            '<div class="form-group"><label class="form-label">Tetikleyici Kelimeler (virgulle ayirin)</label><input class="form-input" id="cb-keywords" value="' + h.esc(kwStr) + '" placeholder="merhaba, selam, nasilsin"></div>' +
            '<div class="form-group"><label class="form-label">Yanit Metni</label><textarea class="form-textarea" id="cb-response">' + h.esc(r.response_text||'') + '</textarea></div>' +
            '<div class="form-group"><label class="form-check"><input type="checkbox" id="cb-active" ' + (r.is_active !== false ? 'checked' : '') + '> Aktif</label></div>' +
            '<div class="gap-8"><button class="btn btn-primary" id="cb-save">' + (isEdit ? 'Guncelle' : 'Kaydet') + '</button>' +
            '<button class="btn btn-secondary" onclick="document.getElementById(\'chatbotForm\').style.display=\'none\'">Iptal</button></div></div>';
        document.getElementById('chatbotForm').innerHTML = html;
        document.getElementById('chatbotForm').style.display = 'block';
        var self = this;
        document.getElementById('cb-save').addEventListener('click', function() {
            self._saveChatbot(isEdit ? r.id : null);
        });
    },
    _editChatbot(id) {
        var self = this;
        API.get('/chatbot/responses').then(function(data) {
            var r = (data.responses||[]).find(function(x) { return x.id == id; });
            if (r) self._showChatbotForm(r);
        }).catch(function(err) { Toast.show('Yanit yuklenemedi', 'error'); });
    },
    async _saveChatbot(id) {
        var resp = {
            trigger_keywords: (document.getElementById('cb-keywords').value||'').split(',').map(function(t) { return t.trim(); }).filter(Boolean),
            response_text: document.getElementById('cb-response').value,
            is_active: document.getElementById('cb-active').checked
        };
        try {
            if (id) { await API.put('/chatbot/responses/' + id, resp); Toast.show('Yanit guncellendi!', 'success'); }
            else { await API.post('/chatbot/responses', resp); Toast.show('Yanit olusturuldu!', 'success'); }
            document.getElementById('chatbotForm').style.display = 'none';
            this._loadChatbot();
        } catch (err) { Toast.show('Kayit basarisiz: ' + err.message, 'error'); }
    },
    async _deleteChatbot(id) {
        var ok = await Modal.confirm('Bu yaniti silmek istediginize emin misiniz?', 'Yanit Sil');
        if (!ok) return;
        try { await API.del('/chatbot/responses/' + id); Toast.show('Yanit silindi.', 'success'); this._loadChatbot(); }
        catch (err) { Toast.show('Silme basarisiz: ' + err.message, 'error'); }
    },

    /* GAME SCORES */
    game() {
        return '<div class="page active"><div class="page-header"><h2>Oyun Skorlari</h2><p>En yuksek skorlari goruntuleyin ve yonetin</p></div><div id="gameList"><div class="spinner"><div class="spinner-circle"></div></div></div></div>';
    },
    gameInit() { this._loadScores(); },
    async _loadScores() {
        var h = this.H;
        try {
            var data = await API.get('/game/scores?limit=50');
            var scores = data.scores || [];
            if (!scores.length) { document.getElementById('gameList').innerHTML = '<div class="empty-state"><p>Henuz skor kaydi yok.</p></div>'; return; }
            var rows = scores.map(function(s, i) {
                return '<tr><td><strong>' + (i+1) + '.</strong></td><td>' + h.esc(s.player_name) + '</td><td><strong>' + s.score + '</strong></td><td>' + h.esc(s.game_type||'classic') + '</td><td>' + h.date(s.created_at) + '</td><td class="table-actions"><button class="btn-icon danger" onclick="Pages._deleteScore(' + s.id + ')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4"/></svg></button></td></tr>';
            }).join('');
            document.getElementById('gameList').innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Oyuncu</th><th>Skor</th><th>Oyun</th><th>Tarih</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        } catch (err) { document.getElementById('gameList').innerHTML = '<div class="empty-state"><p>Hata: ' + h.esc(err.message) + '</p></div>'; }
    },
    async _deleteScore(id) {
        var ok = await Modal.confirm('Bu skoru silmek istediginize emin misiniz?', 'Skor Sil');
        if (!ok) return;
        try { await API.del('/game/scores/' + id); Toast.show('Skor silindi.', 'success'); this._loadScores(); }
        catch (err) { Toast.show('Silme basarisiz: ' + err.message, 'error'); }
    },

    /* SETTINGS */
    settings() {
        return '<div class="page active"><div class="page-header"><h2>Ayarlar</h2><p>Hesap ve guvenlik ayarlarinizi yonetin</p></div>' +
            '<div class="card"><div class="card-header"><span class="card-title">Sifre Degistir</span></div>' +
            '<div class="form-group"><label class="form-label">Mevcut Sifre</label><input class="form-input" type="password" id="set-current" placeholder="Mevcut sifreniz"></div>' +
            '<div class="form-group"><label class="form-label">Yeni Sifre</label><input class="form-input" type="password" id="set-new" placeholder="Yeni sifre (min 6 karakter)"></div>' +
            '<button class="btn btn-primary" id="setSave">Sifreyi Guncelle</button></div>' +
            '<div class="card mt-16"><div class="card-header"><span class="card-title">Oturum Bilgileri</span></div>' +
            '<p class="text-sm"><strong>Kullanici:</strong> ' + this.H.esc(ADMIN.user ? ADMIN.user.username : '-') + '</p>' +
            '<p class="text-sm"><strong>Email:</strong> ' + this.H.esc(ADMIN.user ? ADMIN.user.email : '-') + '</p>' +
            '<p class="text-sm"><strong>Rol:</strong> ' + this.H.esc(ADMIN.user ? ADMIN.user.role : '-') + '</p>' +
            '<button class="btn btn-danger btn-sm mt-16" id="setLogout">Cikis Yap</button></div></div>';
    },
    settingsInit() {
        var self = this;
        document.getElementById('setSave').addEventListener('click', function() {
            self._changePassword();
        });
        document.getElementById('setLogout').addEventListener('click', function() {
            Auth.logout();
        });
    },
    async _changePassword() {
        var current = document.getElementById('set-current').value;
        var newPass = document.getElementById('set-new').value;
        if (!current || !newPass) { Toast.show('Lutfen tum alanlari doldurun.', 'error'); return; }
        if (newPass.length < 6) { Toast.show('Yeni sifre en az 6 karakter olmalidir.', 'error'); return; }
        try {
            await API.post('/auth/change-password', { currentPassword: current, newPassword: newPass });
            Toast.show('Sifre basariyla degistirildi!', 'success');
            document.getElementById('set-current').value = '';
            document.getElementById('set-new').value = '';
        } catch (err) { Toast.show('Sifre degistirilemedi: ' + err.message, 'error'); }
    },
};

/* ===========================================
   8. INITIALIZATION
   =========================================== */
(function() {
    Theme.init();
    Auth.init();
    if (!ADMIN.isLoginPage) {
        Toast.init();
        Router.init();
    }
})();
