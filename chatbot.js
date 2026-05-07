'use strict';
(function() {
    var root = document.getElementById('chatbot-root');
    if (!root) { root = document.createElement('div'); root.id = 'chatbot-root'; document.body.appendChild(root); }
    // Character SVG button (replaces old toggle button)
    var charSvg = '<div class="chatbot-char" id="chatbotChar" aria-label="Sohbeti aç" title="Yardım al">'
        + '<svg viewBox="0 0 80 80" fill="none">'
        + '<defs>'
        + '<linearGradient id="cCharGrad" x1="0" y1="0" x2="0" y2="1">'
        + '<stop offset="0%" stop-color="#FFB74D"/>'
        + '<stop offset="100%" stop-color="#FF8C00"/>'
        + '</linearGradient>'
        + '<radialGradient id="cCharShine" cx="35%" cy="30%" r="60%">'
        + '<stop offset="0%" stop-color="rgba(255,255,255,0.3)"/>'
        + '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>'
        + '</radialGradient>'
        + '</defs>'
        + '<path d="M40 8C58 8 73 18 76 36C79 54 68 72 52 78C42 81 30 80 20 74C10 68 4 54 6 36C8 20 22 8 40 8Z" fill="url(#cCharGrad)"/>'
        + '<path d="M40 8C58 8 73 18 76 36C79 54 68 72 52 78C42 81 30 80 20 74C10 68 4 54 6 36C8 20 22 8 40 8Z" fill="url(#cCharShine)"/>'
        + '<g class="h-arm-l" style="transform-origin:10px 44px;"><path d="M8 42Q-2 34 0 26" stroke="#E87800" stroke-width="5" stroke-linecap="round" fill="none"/></g>'
        + '<g class="h-arm-r" style="transform-origin:70px 44px;"><path d="M72 42Q82 34 80 26" stroke="#E87800" stroke-width="5" stroke-linecap="round" fill="none"/></g>'
        + '<ellipse class="h-eye" cx="28" cy="36" rx="7" ry="9" fill="white"/>'
        + '<circle class="h-pupil" cx="28" cy="36" r="4" fill="#1D1D1F"/>'
        + '<circle cx="26" cy="33" r="1.5" fill="white" opacity="0.9"/>'
        + '<ellipse class="h-eye" cx="52" cy="36" rx="7" ry="9" fill="white"/>'
        + '<circle class="h-pupil" cx="52" cy="36" r="4" fill="#1D1D1F"/>'
        + '<circle cx="50" cy="33" r="1.5" fill="white" opacity="0.9"/>'
        + '<path class="h-mouth" d="M32 54Q40 62 48 54" stroke="#1D1D1F" stroke-width="2.5" stroke-linecap="round" fill="none"/>'
        + '<circle class="h-blush" cx="16" cy="50" r="5" fill="#FF6F00" opacity="0.2"/>'
        + '<circle class="h-blush" cx="64" cy="50" r="5" fill="#FF6F00" opacity="0.2"/>'
        + '</svg></div>';

    root.innerHTML = charSvg + '<div class="chatbot-window" id="chatbotWindow" aria-label="Sohbet penceresi" role="dialog" aria-hidden="true"><div class="chatbot-header"><div class="chatbot-header-info"><div class="chatbot-avatar">🤖</div><div><div class="chatbot-header-title">Asistan</div><div class="chatbot-header-status">Çevrimiçi</div></div></div><button class="chatbot-close-btn" id="chatbotCloseBtn" aria-label="Sohbeti kapat">✕</button></div><div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite"></div><div class="chatbot-input-row"><input type="text" class="chatbot-input" id="chatbotInput" placeholder="Bir şey yazın..." aria-label="Mesajınızı yazın"><button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Gönder">➤</button></div></div>';
    var toggle = document.getElementById('chatbotChar');
    var windowEl = document.getElementById('chatbotWindow');
    var closeBtn = document.getElementById('chatbotCloseBtn');
    var messages = document.getElementById('chatbotMessages');
    var input = document.getElementById('chatbotInput');
    var sendBtn = document.getElementById('chatbotSendBtn');
    var unreadCount = 0;

    /* ---- Pupil tracking (eyes follow mouse) ---- */
    var pupils = toggle.querySelectorAll('.h-pupil');
    function setPupils(dx, dy) {
        pupils.forEach(function(p) {
            p.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
        });
    }
    document.addEventListener('mousemove', function(e) {
        var rect = toggle.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var d = Math.hypot(dx, dy) || 1;
        var f = Math.min(1, d / 80);
        setPupils((dx / d) * f * 4, (dy / d) * f * 4);
    });

    var resp = {
        'merhaba': 'Merhaba! 👋 Size nasıl yardımcı olabilirim?',
        'selam': 'Selam! 😊 Nasıl yardımcı olabilirim?',
        'naber': 'İyiyim, teşekkürler! Siz nasılsınız? Size yardımcı olabileceğim bir şey var mı?',
        'nasılsın': 'Harikayım, teşekkürler! 🤖✨ Size nasıl yardımcı olabilirim?',
        'teşekkür': 'Rica ederim! 😊 Başka bir sorunuz olursa buradayım.',
        'görüşürüz': 'Görüşürüz! 👋 İyi günler dilerim.',
        'yardım': 'Size şu konularda yardımcı olabilirim:\n📌 Projelerim hakkında bilgi\n📌 Becerilerim ve deneyimlerim\n📌 İletişim bilgileri\n\nNe öğrenmek istersiniz?',
        'proje': 'Projeler bölümünde web, mobil ve backend çalışmalarımı inceleyebilirsiniz. Yukarıdaki navigasyondan "Projeler"e tıklayarak tüm projelerimi görebilirsiniz! 🚀',
        'beceri': 'Frontend, backend, araçlar ve tasarım alanlarında yetkinliklerim var. "Beceriler" bölümünde detaylı olarak inceleyebilirsiniz! 💪',
        'iletişim': 'Bana e-posta ile ulaşabilir veya "İletişim" bölümündeki formu doldurabilirsiniz. En kısa sürede dönüş yaparım! ✉️',
        'oyun': 'Evet, bir hafıza oyunumuz var! 🎮 "Oyun" bölümüne gidip kart eşleştirme oyununu oynayabilir, skor tablosunda kendini deneyebilirsin! 🏆',
        'referans': 'Referanslar bölümünde müşterilerimin geri bildirimlerini bulabilirsiniz. Hepsi gerçek projelerden! ⭐'
    };
    function getResponse(msg) { msg = msg.toLowerCase().trim(); for (var k in resp) { if (msg.indexOf(k) !== -1) return resp[k]; } return 'Anladım! 🤔 Bu konuda size yardımcı olabilmek için "iletişim" bölümünden bana detaylı mesaj gönderebilirsiniz. Başka bir şey sormak ister misiniz?'; }
    function scrollToBottom() { if (messages) messages.scrollTop = messages.scrollHeight; }
    function addMsg(text, isUser) { if (!messages) return; var div = document.createElement('div'); div.className = 'chatbot-msg ' + (isUser ? 'user' : 'bot'); div.innerHTML = '<div class="chatbot-msg-avatar">' + (isUser ? '👤' : '🤖') + '</div><div class="chatbot-msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>'; messages.appendChild(div); scrollToBottom(); }
    function showTyping() { if (!messages) return; var div = document.createElement('div'); div.className = 'chatbot-typing'; div.id = 'typingIndicator'; div.innerHTML = '<span></span><span></span><span></span>'; messages.appendChild(div); scrollToBottom(); }
    function hideTyping() { var el = document.getElementById('typingIndicator'); if (el) el.remove(); }
    function sendMessage() { var text = input.value.trim(); if (!text) return; addMsg(text, true); input.value = ''; showTyping(); setTimeout(function() { hideTyping(); addMsg(getResponse(text), false); }, 800 + Math.random() * 800); }
    function openWindow() { windowEl.classList.add('open'); windowEl.setAttribute('aria-hidden', 'false'); unreadCount = 0;  if (messages.children.length === 0) { addMsg('Merhaba! 👋 Ben sanal asistanınızım. Size nasıl yardımcı olabilirim?', false); addMsg('Projeler, beceriler, iletişim veya oyun hakkında soru sorabilirsiniz. "yardım" yazarak neler yapabileceğimi görebilirsiniz!', false); } input.focus(); }
    function closeWindow() { windowEl.classList.remove('open'); windowEl.setAttribute('aria-hidden', 'true'); }
    toggle.addEventListener('click', function() { if (windowEl.classList.contains('open')) closeWindow(); else openWindow(); });
    closeBtn.addEventListener('click', closeWindow);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && windowEl.classList.contains('open')) { closeWindow(); toggle.focus(); } });
    addMsg('Merhaba! 👋 Ben sanal asistanınızım. Sorularınız için buradayım.', false);
})();