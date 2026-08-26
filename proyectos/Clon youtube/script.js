(function () {
    'use strict';

    const videoGrid = document.getElementById('video-grid');
    const shortsGrid = document.getElementById('shorts-grid');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const toast = document.getElementById('toast');
    const sidebar = document.getElementById('sidebar');

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(function () { toast.classList.remove('show'); }, 2200);
    }

    function renderVideos(videos) {
        videoGrid.innerHTML = videos.map(function (video) {
            const media = video.video
                ? '<video class="preview-media" muted loop preload="metadata" poster="' + video.thumbnail + '"><source src="' + video.video + '" type="video/mp4"></video>'
                : '<img src="' + video.thumbnail + '" alt="Miniatura de ' + video.title + '">';
            return '<article class="video-card" data-title="' + video.title.toLowerCase() + '"><div class="video-thumb">' + media + '<span class="duration">' + video.duration + '</span></div><div class="video-info"><img class="channel-logo" src="' + video.logo + '" alt=""><div class="video-copy"><h3>' + video.title + '</h3><p>' + video.channel + '</p><p>' + video.views + ' · ' + video.date + '</p></div></div></article>';
        }).join('');
    }

    function renderShorts(shorts) {
        shortsGrid.innerHTML = shorts.map(function (short) {
            const media = short.video
                ? '<video class="preview-media" muted loop autoplay playsinline poster="' + short.thumbnail + '"><source src="' + short.video + '" type="video/mp4"></video>'
                : '<img src="' + short.thumbnail + '" alt="' + short.title + '">';
            return '<article class="short-card"><span class="short-badge">SHORTS</span>' + media + '<h3>' + short.title + '</h3></article>';
        }).join('');
    }

    fetch('data.json').then(function (response) {
        if (!response.ok) throw new Error('Data error');
        return response.json();
    }).then(function (data) {
        renderVideos(data.videos);
        renderShorts(data.shorts);
        enableVideoPreviews();
    }).catch(function () {
        showToast('No se pudo cargar el contenido');
    });

    function enableVideoPreviews() {
        document.querySelectorAll('.preview-media').forEach(function (video) {
            const card = video.closest('.video-card, .short-card');
            card.addEventListener('mouseenter', function () {
                video.play().catch(function () { });
            });
            card.addEventListener('mouseleave', function () {
                video.pause();
                video.currentTime = 0;
            });
        });
    }

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('.video-card').forEach(function (card) {
            card.hidden = query && !card.dataset.title.includes(query);
        });
        showToast(query ? 'Resultados para: ' + query : 'Mostrando todos los videos');
    });

    document.getElementById('menu-button').addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });

    document.querySelectorAll('.category').forEach(function (button) {
        button.addEventListener('click', function () {
            document.querySelector('.category.active').classList.remove('active');
            button.classList.add('active');
            showToast('Categoría: ' + button.textContent);
        });
    });
}());