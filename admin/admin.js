'use strict';
(function() {
    var loginScreen = document.getElementById('loginScreen');
    var dashboardScreen = document.getElementById('dashboardScreen');
    var loginForm = document.getElementById('loginForm');
    var loginError = document.getElementById('loginError');
    var logoutBtn = document.getElementById('logoutBtn');
    var dashboardBody = document.getElementById('dashboardBody');
    var panelTitle = document.getElementById('panelTitle');
    var sidebarLinks = document.querySelectorAll('.sidebar-link');
    var SESSION_KEY = 'admin_authenticated';
    function isAuth() { return sessionStorage.getItem(SESSION_KEY) === 'true'; }
    function setAuth(v) { if (v) sessionStorage.setItem(SESSION_KEY, 'true'); else sessionStorage.removeItem(SESSION_KEY); }
    if (isAuth()) { showDashboard(); } else { showLogin(); }
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var u = document.getElementById('username').value.trim();
        var p = document.getElementById('password').value.trim();
        if (u === 'admin' && p === 'admin123') { setAuth(true); showDashboard(); loginError.textContent = ''; }
        else { loginError.textContent = 'Geçersiz kullanıcı adı veya şifre!'; }
    });
    logoutBtn.addEventListener('click', function() { setAuth(false); showLogin(); });
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
            link.classList.add('active');
            panelTitle.textContent = link.textContent.trim();
            loadPanel(link.getAttribute('data-panel'));
        });
    });
    function showLogin() { loginScreen.classList.remove('hidden'); dashboardScreen.classList.add('hidden'); }
    function showDashboard() { loginScreen.classList.add('hidden'); dashboardScreen.classList.remove('hidden'); loadPanel('overview'); }
    function loadPanel(panel) {
        dashboardBody.innerHTML = '<div class="loading-state">Yukleniyor...</div>';
        if (panel === 'overview') renderOverview();
        else if (panel === 'hero') renderHero();
        else if (panel === 'about') renderAbout();
        else if (panel === 'projects') renderProjects();
        else if (panel === 'skills') renderSkills();
        else if (panel === 'references') renderReferences();
        else if (panel === 'game-scores') renderGameScores();
        else if (panel === 'messages') renderMessages();
        else if (panel === 'cms') renderCMS();
        else if (panel === 'settings') renderSettings();
        else dashboardBody.innerHTML = '<div class="empty-state">Panel bulunamadi</div>';
    }
    function renderOverview() {
        dashboardBody.innerHTML = '<div class="stats-cards"><div class="stat-card"><div class="stat-card-value">6</div><div class="stat-card-label">Proje</div></div><div class="stat-card"><div class="stat-card-value">3</div><div class="stat-card-label">Referans</div></div><div class="stat-card"><div class="stat-card-value">12</div><div class="stat-card-label">Beceri</div></div><div class="stat-card"><div class="stat-card-value">0</div><div class="stat-card-label">Mesaj</div></div></div><div class="panel-card"><h3 class="panel-card-title">Hizli Baglantilar</h3><p style="color:#6E6E73;font-size:.9rem">Yan menuden duzenlemek istediginiz bolumu secin.</p></div>';
    }
    function renderHero() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Hero Bolumu</h3><form id="heroForm"><div class="form-group"><label class="form-label">Selamlama</label><input type="text" class="form-input" value="Merhaba, ben"></div><div class="form-group"><label class="form-label">Baslik</label><input type="text" class="form-input" value="Isim Soyisim"></div><button type="submit" class="btn-sm btn-sm-add">Kaydet</button></form></div>';
        setTimeout(function() {
            var hf = document.getElementById('heroForm');
            if (hf) hf.addEventListener('submit', function(e) { e.preventDefault(); alert('Hero bolumu kaydedildi!'); });
        }, 100);
    }
    function renderAbout() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Hakkimda</h3><button class="btn-sm btn-sm-add" onclick="alert(\'Kaydedildi!\')">Kaydet</button></div>';
    }
    function renderProjects() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Projeler</h3><button class="btn-sm btn-sm-add" onclick="alert(\'Eklendi!\')">+ Yeni Proje</button><p class="empty-state">6 proje listeleniyor.</p></div>';
    }
    function renderSkills() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Beceriler</h3><button class="btn-sm btn-sm-add" onclick="alert(\'Eklendi!\')">+ Kategori Ekle</button><p class="empty-state">4 beceri kategorisi mevcut.</p></div>';
    }
    function renderReferences() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Referanslar</h3><button class="btn-sm btn-sm-add" onclick="alert(\'Eklendi!\')">+ Referans Ekle</button><p class="empty-state">3 referans mevcut.</p></div>';
    }
    function renderGameScores() {
        try {
            var scores = JSON.parse(localStorage.getItem('memoryGameScores') || '[]');
            var rows = '';
            if (scores.length === 0) { rows = '<p class="empty-state">Henuz skor kaydi yok</p>'; }
            else { rows = '<table class="panel-table"><thead><tr><th>#</th><th>Puan</th><th>Hamle</th></tr></thead><tbody>'; scores.forEach(function(s, i) { rows += '<tr><td>' + (i + 1) + '</td><td>' + s.score + '</td><td>' + s.moves + '</td></tr>'; }); rows += '</tbody></table>'; }
            dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Oyun Skorlari</h3>' + rows + '</div>';
        } catch (e) { dashboardBody.innerHTML = '<div class="empty-state">Skorlar yuklenemedi</div>'; }
    }
    function renderMessages() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Mesajlar</h3><p class="empty-state">Henuz mesaj yok.</p></div>';
    }
    function renderCMS() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">CMS Sayfalari</h3><p class="empty-state">API entegrasyonu ile dinamik icerik yonetimi.</p></div>';
    }
    function renderSettings() {
        dashboardBody.innerHTML = '<div class="panel-card"><h3 class="panel-card-title">Ayarlar</h3><button class="btn-sm btn-sm-add" onclick="alert(\'Kaydedildi!\')">Kaydet</button></div>';
    }
})();
