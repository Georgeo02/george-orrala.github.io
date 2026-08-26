(function() {
    'use strict';

    // --- VARIABLES GLOBALES ---
    let datos = {};

    // --- Referencias DOM ---
    const navLinks = document.querySelectorAll('#nav-principal a[data-vista]');
    const vistas = {
        inicio: document.getElementById('vista-inicio'),
        proyectos: document.getElementById('vista-proyectos'),
        certificados: document.getElementById('vista-certificados')
    };

    const proyectosContainer = document.getElementById('proyectos-container');
    const certificadosContainer = document.getElementById('certificados-container');
    const fotoPerfil = document.querySelector('.perfil img');
    let temporizadorFotoPerfil;

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    function actualizarTema(modoNocturno) {
        document.body.classList.toggle('modo-nocturno', modoNocturno);
        themeToggle.setAttribute('aria-pressed', String(modoNocturno));
        themeToggle.setAttribute('aria-label', modoNocturno ? 'Activar modo claro' : 'Activar modo nocturno');
        themeIcon.className = modoNocturno ? 'fas fa-sun' : 'fas fa-moon';
        themeLabel.textContent = modoNocturno ? 'Modo claro' : 'Modo nocturno';
    }

    if (themeToggle) {
        const temaGuardado = localStorage.getItem('portafolio-tema') === 'nocturno';
        actualizarTema(temaGuardado);
        themeToggle.addEventListener('click', function() {
            const modoNocturno = !document.body.classList.contains('modo-nocturno');
            actualizarTema(modoNocturno);
            localStorage.setItem('portafolio-tema', modoNocturno ? 'nocturno' : 'claro');
        });
    }

    if (fotoPerfil) {
        fotoPerfil.addEventListener('mouseenter', function() {
            clearTimeout(temporizadorFotoPerfil);
            fotoPerfil.classList.add('volteando');
            fotoPerfil.src = 'img/informal.jpg';
        });

        fotoPerfil.addEventListener('mouseleave', function() {
            clearTimeout(temporizadorFotoPerfil);
            temporizadorFotoPerfil = setTimeout(function() {
                fotoPerfil.src = 'img/perfil.jpg';
                fotoPerfil.classList.remove('volteando');
            }, 1000);
        });
    }

    // --- Cargar datos desde data.json ---
    async function cargarDatos() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Error al cargar data.json');
            datos = await response.json();
            renderizarProyectos();
            renderizarCertificados();
        } catch (error) {
            console.error('Error:', error);
            proyectosContainer.innerHTML = '<p>Error al cargar proyectos</p>';
            certificadosContainer.innerHTML = '<p>Error al cargar certificados</p>';
        }
    }

    // --- Renderizar proyectos ---
    function renderizarProyectos() {
        if (!proyectosContainer || !datos.proyectos) return;
        proyectosContainer.innerHTML = '';
        datos.proyectos.forEach(p => {
            const card = document.createElement(p.url ? 'a' : 'div');
            card.className = 'proyecto-card';
            if (p.url) {
                card.href = p.url;
                card.setAttribute('aria-label', `Abrir proyecto ${p.titulo}`);
            }
            card.innerHTML = `
                <h3><i class="fas fa-cogs" style="color:#1e6f9f; margin-right:0.5rem;"></i>${p.titulo}</h3>
                <p>${p.descripcion}</p>
                <span class="tech"><i class="fas fa-tag"></i> ${p.tech}</span>
                ${p.url ? '<span class="abrir-proyecto">Abrir prototipo <i class="fas fa-arrow-right"></i></span>' : ''}
            `;
            proyectosContainer.appendChild(card);
        });
    }

    // --- Renderizar certificados ---
    function renderizarCertificados() {
        if (!certificadosContainer || !datos.certificados) return;
        certificadosContainer.innerHTML = '';
        datos.certificados.forEach(c => {
            const item = document.createElement('div');
            item.className = 'cert-item';
            item.innerHTML = `
                <i class="${c.icono}"></i>
                <div class="info">
                    <h4>${c.titulo}</h4>
                    <p>${c.entidad}</p>
                </div>
                <span class="fecha"><i class="far fa-calendar-alt"></i> ${c.fecha}</span>
            `;
            certificadosContainer.appendChild(item);
        });
    }

    // --- Cambiar vista (SPA) ---
    function cambiarVista(id) {
        // ocultar todas
        Object.values(vistas).forEach(v => v.classList.remove('activa'));
        // mostrar la seleccionada
        if (vistas[id]) {
            vistas[id].classList.add('activa');
        }
        // actualizar clase activa en nav
        navLinks.forEach(link => link.classList.remove('activo'));
        const linkActivo = document.querySelector(`#nav-principal a[data-vista="${id}"]`);
        if (linkActivo) linkActivo.classList.add('activo');

        // scroll suave al inicio del main
        document.querySelector('.contenedor-principal').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Eventos de navegación ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const vistaId = this.getAttribute('data-vista');
            if (vistaId) {
                cambiarVista(vistaId);
                // actualizar URL sin recargar
                history.pushState({ vista: vistaId }, '', `#${vistaId}`);
            }
        });
    });

    // --- Manejar evento 'popstate' (cuando se usa atrás/adelante) ---
    window.addEventListener('popstate', function(e) {
        const vista = e.state?.vista || 'inicio';
        cambiarVista(vista);
    });

    // --- Botón contacto ---
    const btnContacto = document.getElementById('btn-contacto');
    if (btnContacto) {
        btnContacto.addEventListener('click', function(e) {
            e.preventDefault();
            alert('¡Gracias por contactarme! Puedes escribirme a george.orrala@espoch.edu.ec (ejemplo)');
        });
    }

    // --- Inicializar ---
    function init() {
        cargarDatos();

        // Leer hash al cargar
        const hash = window.location.hash.replace('#', '');
        const vistaInicial = (hash && vistas[hash]) ? hash : 'inicio';
        cambiarVista(vistaInicial);
        // sincronizar estado del history
        if (window.history.state?.vista !== vistaInicial) {
            window.history.replaceState({ vista: vistaInicial }, '', `#${vistaInicial}`);
        }
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
