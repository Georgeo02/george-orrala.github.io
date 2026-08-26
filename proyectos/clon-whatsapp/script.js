(function () {
    'use strict';

    const chats = [
        { id:'ana', name:'Ana María', initials:'AM', color:'pink', time:'10:42', preview:'¿Ya revisaste los resultados?', unread:2, status:'en línea', messages:[['¿Ya revisaste los resultados?','10:42',false],['Estoy terminando el informe. Te lo envío en unos minutos.','10:44',true]] },
        { id:'scada', name:'Equipo SCADA', initials:'SC', color:'blue', time:'09:18', preview:'George: La prueba quedó lista', unread:4, group:true, status:'5 participantes', messages:[['La prueba de comunicación quedó lista para hoy.','09:16',false],['Perfecto, revisaré los eventos del sistema.','09:18',true]] },
        { id:'pao', name:'PAO 8 - Electrónica', initials:'P8', color:'violet', time:'Ayer', preview:'Carlos: Comparto el documento', unread:0, group:true, status:'18 participantes', messages:[['Comparto el documento de la práctica.','Ayer',false],['Gracias, lo agrego al tablero.','Ayer',true]] },
        { id:'mama', name:'Mamá', initials:'M', color:'orange', time:'Ayer', preview:'No olvides llamar cuando llegues', unread:0, status:'última vez hoy a las 08:20', messages:[['No olvides llamar cuando llegues.','Ayer',false],['Claro, te aviso al llegar.','Ayer',true]] },
        { id:'tesis', name:'Proyecto de titulación', initials:'PT', color:'green', time:'Lun', preview:'Nuevo tema para conversar', unread:0, group:true, status:'3 participantes', messages:[['Tenemos un nuevo tema para conversar.','Lun',false],['Lo vemos en la reunión de mañana.','Lun',true]] },
        { id:'diego', name:'Diego Andrade', initials:'DA', color:'blue', time:'Dom', preview:'Ese modelo quedó muy bien', unread:0, status:'última vez ayer a las 22:10', messages:[['Ese modelo quedó muy bien.','Dom',false],['Gracias, todavía falta validarlo.','Dom',true]] },
        { id:'festo', name:'Prácticas Festo', initials:'PF', color:'orange', time:'Sáb', preview:'Archivo: sensores.pdf', unread:0, group:true, status:'12 participantes', messages:[['Archivo: sensores.pdf','Sáb',false],['Recibido, muchas gracias.','Sáb',true]] }
    ];
    const app = document.querySelector('.phone-app');
    const list = document.getElementById('chat-list');
    const empty = document.getElementById('empty-conversation');
    const conversation = document.getElementById('conversation');
    const queryInput = document.getElementById('search-input');
    const messageArea = document.getElementById('message-area');
    let activeFilter = 'all';
    let selectedChat = null;

    function renderChats() {
        const query = queryInput.value.toLowerCase().trim();
        const filtered = chats.filter(function (chat) {
            const matchesFilter = activeFilter === 'all' || (activeFilter === 'unread' && chat.unread) || (activeFilter === 'groups' && chat.group);
            return matchesFilter && (chat.name + chat.preview).toLowerCase().includes(query);
        });
        list.innerHTML = filtered.length ? filtered.map(function (chat, index) {
            return '<article class="chat-row ' + (chat.unread ? 'unread ' : '') + (selectedChat === chat.id ? 'selected' : '') + '" data-chat="' + chat.id + '" style="animation-delay:' + index * 45 + 'ms">' +
                '<div class="avatar ' + chat.color + '">' + chat.initials + '</div><div class="chat-copy"><strong>' + chat.name + '</strong><p>' + chat.preview + '</p></div><div class="chat-meta">' + chat.time + (chat.unread ? '<span class="unread-badge">' + chat.unread + '</span>' : '') + '</div></article>';
        }).join('') : '<div class="empty-state">No encontramos chats con ese criterio.</div>';
        list.querySelectorAll('[data-chat]').forEach(function (row) { row.addEventListener('click', function () { openChat(row.dataset.chat); }); });
    }

    function openChat(id) {
        selectedChat = id;
        const chat = chats.find(function (item) { return item.id === id; });
        if (!chat) return;
        chat.unread = 0;
        document.getElementById('conversation-avatar').className = 'conversation-avatar ' + chat.color;
        document.getElementById('conversation-avatar').textContent = chat.initials;
        document.getElementById('conversation-name').textContent = chat.name;
        document.getElementById('conversation-status').textContent = chat.status;
        messageArea.innerHTML = chat.messages.map(function (message) { return '<div class="message ' + (message[2] ? 'mine' : '') + '">' + message[0] + '<small>' + message[1] + ' &#10003;&#10003;</small></div>'; }).join('');
        empty.hidden = true;
        conversation.hidden = false;
        app.classList.add('show-conversation');
        renderChats();
        document.getElementById('unread-total').textContent = chats.reduce(function (total, item) { return total + item.unread; }, 0) + ' no leídos';
    }

    document.querySelectorAll('.filter-tab').forEach(function (button) { button.addEventListener('click', function () { document.querySelector('.filter-tab.active').classList.remove('active'); button.classList.add('active'); activeFilter = button.dataset.filter; renderChats(); }); });
    queryInput.addEventListener('input', renderChats);
    document.getElementById('back-button').addEventListener('click', function () { app.classList.remove('show-conversation'); });
    document.getElementById('new-chat').addEventListener('click', function () { showToast('Selecciona un contacto para iniciar un chat.'); });
    document.getElementById('message-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        if (!text || !selectedChat) return;
        const chat = chats.find(function (item) { return item.id === selectedChat; });
        chat.messages.push([text, 'Ahora', true]);
        chat.preview = text;
        messageArea.insertAdjacentHTML('beforeend', '<div class="message mine">' + text.replace(/[&<>]/g, function (character) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' })[character]; }) + '<small>Ahora &#10003;&#10003;</small></div>');
        messageArea.lastElementChild.scrollIntoView({ behavior:'smooth', block:'end' });
        input.value = '';
        renderChats();
    });
    function showToast(text) { const toast = document.getElementById('toast'); toast.textContent = text; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 2400); }
    renderChats();
}());
