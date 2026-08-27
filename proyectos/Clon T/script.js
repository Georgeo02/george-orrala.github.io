(function () {
    'use strict';

    const ASSET_VERSION = '2026.08.26.1';

    const bannerTrack = document.getElementById('banner-track');
    const bannerDots = document.getElementById('banner-dots');
    const usageGrid = document.getElementById('usage-grid');
    const buyButton = document.getElementById('buy-button');
    const feedback = document.getElementById('feedback');

    async function loadData() {
        const response = await fetch('data.json?v=' + ASSET_VERSION);
        if (!response.ok) throw new Error('No se pudo cargar la información');
        return response.json();
    }

    function renderBanners(banners) {
        bannerTrack.innerHTML = banners.map(function (banner) {
            return '<article class="banner"><small>' + banner.label + '</small><h2>' + banner.title + '</h2><p>' + banner.description + '</p></article>';
        }).join('');
        bannerDots.innerHTML = banners.map(function () { return '<span></span>'; }).join('');
    }

    function renderUsage(usage) {
        usageGrid.innerHTML = usage.map(function (item) {
            return '<article class="usage-item"><div class="donut" style="--progress:' + item.progress + ';--donut-color:' + item.color + '"><strong>' + item.progress + '%</strong></div><h3>' + item.label + '</h3><p>' + item.used + ' de ' + item.total + '</p></article>';
        }).join('');
    }

    loadData().then(function (data) {
        renderBanners(data.banners);
        renderUsage(data.usage);
        document.getElementById('balance-amount').textContent = data.balance;
        document.getElementById('expiry-date').textContent = data.plan.expiry;
        document.getElementById('plan-name').textContent = data.plan.name;
    }).catch(function () {
        feedback.textContent = 'No se pudo cargar la información.';
    });

    buyButton.addEventListener('click', function () {
        feedback.textContent = 'Selecciona el combo que quieres comprar.';
    });
}());