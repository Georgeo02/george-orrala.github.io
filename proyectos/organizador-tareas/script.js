(function () {
    'use strict';

    const STORAGE_KEY = 'george-organizador-tareas-v1';
    const ASSET_VERSION = '2026.08.26.1';
    const statuses = [
        { id: 'todo', label: 'Por hacer' },
        { id: 'ready', label: 'Do it' },
        { id: 'progress', label: 'En progreso' },
        { id: 'done', label: 'Hecho' }
    ];
    const priorityLabels = { high: 'Alta', medium: 'Media', low: 'Baja' };
    const board = document.getElementById('board');
    const summary = document.getElementById('summary');
    const searchInput = document.getElementById('search-input');
    const taskDialog = document.getElementById('task-dialog');
    const memoryDialog = document.getElementById('memory-dialog');
    const taskForm = document.getElementById('task-form');
    const archiveList = document.getElementById('archive-list');
    const memoryCount = document.getElementById('memory-count');
    let state = { tasks: [], archive: [] };
    let draggedId = null;

    function createId() {
        return 'task-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        document.getElementById('save-note').textContent = 'Guardado localmente a las ' + new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
    }

    async function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state = { tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [], archive: Array.isArray(parsed.archive) ? parsed.archive : [] };
                return;
            } catch (error) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        const response = await fetch('data.json?v=' + ASSET_VERSION);
        const data = await response.json();
        state.tasks = data.tasks || [];
        saveState();
    }

    function visibleTasks() {
        const query = searchInput.value.trim().toLowerCase();
        return state.tasks.filter(function (task) {
            return !query || [task.title, task.area, task.detail].join(' ').toLowerCase().includes(query);
        });
    }

    function render() {
        const tasks = visibleTasks();
        board.innerHTML = statuses.map(function (status) {
            const columnTasks = tasks.filter(function (task) { return task.status === status.id; });
            return '<section class="column" data-status="' + status.id + '" aria-labelledby="heading-' + status.id + '">' +
                '<div class="column-head"><h2 id="heading-' + status.id + '">' + status.label + '</h2><span class="column-count">' + columnTasks.length + '</span></div>' +
                '<div class="task-list" data-list="' + status.id + '">' + (columnTasks.length ? columnTasks.map(renderTask).join('') : '<div class="empty-state">Suelta aquí una tarea</div>') + '</div>' +
                '</section>';
        }).join('');
        summary.textContent = state.tasks.length + ' tareas en el tablero · ' + state.tasks.filter(function (task) { return task.status === 'done'; }).length + ' completadas';
        memoryCount.textContent = state.archive.length;
        bindBoardEvents();
    }

    function renderTask(task) {
        return '<article class="task-card" draggable="true" data-id="' + task.id + '" tabindex="0">' +
            '<div class="card-actions"><button class="icon-button edit-task" type="button" aria-label="Editar ' + escapeHtml(task.title) + '">&#9998;</button><button class="icon-button delete-task" type="button" aria-label="Eliminar ' + escapeHtml(task.title) + '">&#10005;</button></div>' +
            '<h3><span class="priority ' + task.priority + '" title="Prioridad ' + priorityLabels[task.priority] + '"></span>' + escapeHtml(task.title) + '</h3>' +
            '<p>' + escapeHtml(task.detail || 'Sin detalle añadido.') + '</p>' +
            '<span class="task-area">' + escapeHtml(task.area || 'General') + '</span>' +
            '</article>';
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, function (character) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]; });
    }

    function bindBoardEvents() {
        document.querySelectorAll('.task-card').forEach(function (card) {
            card.addEventListener('dragstart', function () { draggedId = card.dataset.id; card.classList.add('dragging'); });
            card.addEventListener('dragend', function () { draggedId = null; card.classList.remove('dragging'); });
            card.querySelector('.edit-task').addEventListener('click', function () { openTaskDialog(card.dataset.id); });
            card.querySelector('.delete-task').addEventListener('click', function () { deleteTask(card.dataset.id); });
        });
        document.querySelectorAll('.column').forEach(function (column) {
            column.addEventListener('dragover', function (event) { event.preventDefault(); column.classList.add('drag-over'); });
            column.addEventListener('dragleave', function () { column.classList.remove('drag-over'); });
            column.addEventListener('drop', function (event) {
                event.preventDefault();
                column.classList.remove('drag-over');
                const task = state.tasks.find(function (item) { return item.id === draggedId; });
                if (task) { task.status = column.dataset.status; saveState(); render(); }
            });
        });
    }

    function openTaskDialog(id) {
        const task = state.tasks.find(function (item) { return item.id === id; });
        taskForm.reset();
        document.getElementById('task-id').value = task ? task.id : '';
        document.getElementById('dialog-title').textContent = task ? 'Editar tarea' : 'Añadir tarea';
        document.getElementById('task-status').innerHTML = statuses.map(function (status) { return '<option value="' + status.id + '">' + status.label + '</option>'; }).join('');
        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-area').value = task.area || '';
            document.getElementById('task-detail').value = task.detail || '';
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-status').value = task.status;
        }
        taskDialog.showModal();
    }

    function deleteTask(id) {
        const index = state.tasks.findIndex(function (task) { return task.id === id; });
        if (index < 0) return;
        const removed = state.tasks.splice(index, 1)[0];
        state.archive.unshift(Object.assign({}, removed, { deletedAt: new Date().toISOString() }));
        saveState();
        render();
    }

    function renderArchive() {
        archiveList.innerHTML = state.archive.length ? state.archive.map(function (task) {
            return '<div class="archive-item"><div><strong>' + escapeHtml(task.title) + '</strong><small>' + escapeHtml(task.area || 'General') + '</small></div><button type="button" data-restore="' + task.id + '">Restaurar</button></div>';
        }).join('') : '<div class="empty-state">La memoria está vacía.</div>';
        archiveList.querySelectorAll('[data-restore]').forEach(function (button) { button.addEventListener('click', function () { restoreTask(button.dataset.restore); }); });
    }

    function restoreTask(id) {
        const index = state.archive.findIndex(function (task) { return task.id === id; });
        if (index < 0) return;
        const restored = state.archive.splice(index, 1)[0];
        delete restored.deletedAt;
        restored.status = 'todo';
        state.tasks.push(restored);
        saveState();
        render();
        renderArchive();
    }

    document.getElementById('add-task-button').addEventListener('click', function () { openTaskDialog(); });
    document.getElementById('close-dialog').addEventListener('click', function () { taskDialog.close(); });
    document.getElementById('cancel-dialog').addEventListener('click', function () { taskDialog.close(); });
    document.getElementById('memory-button').addEventListener('click', function () { renderArchive(); memoryDialog.showModal(); });
    document.getElementById('close-memory').addEventListener('click', function () { memoryDialog.close(); });
    document.getElementById('clear-memory').addEventListener('click', function () { state.archive = []; saveState(); render(); renderArchive(); });
    searchInput.addEventListener('input', render);
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('task-id').value;
        const values = { title: document.getElementById('task-title').value.trim(), area: document.getElementById('task-area').value.trim(), detail: document.getElementById('task-detail').value.trim(), priority: document.getElementById('task-priority').value, status: document.getElementById('task-status').value };
        const task = state.tasks.find(function (item) { return item.id === id; });
        if (task) Object.assign(task, values); else state.tasks.push(Object.assign({ id: createId() }, values));
        saveState(); render(); taskDialog.close();
    });

    loadState().then(render).catch(function () { summary.textContent = 'No se pudo cargar el tablero.'; });
}());
