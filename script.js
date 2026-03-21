document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del Header Pegajoso (Sticky Header)
    const header = document.getElementById('header');
    const isAlwaysScrolled = header.classList.contains('scrolled');
    
    if (!isAlwaysScrolled) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // 2. Botones Flotantes (Subir y WhatsApp)
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const floatBtns = document.querySelectorAll('.float-btn');

    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 400) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Navegación Móvil
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // 4. ScrollSpy (Solo para index.html)
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0 && !isAlwaysScrolled) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 200)) current = section.getAttribute('id');
            });
            
            navLinks.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.startsWith('#')) {
                    a.classList.remove('active');
                    if (href === `#${current}`) a.classList.add('active');
                }
            });
        });
    }

    // 5. Inyectar HTML del Modal Global de Manera Dinámica
    document.body.insertAdjacentHTML('beforeend', `
        <div id="globalModal" class="modal">
            <div class="modal-content">
                <span class="close-btn" id="closeModalBtn">&times;</span>
                <div id="modalBody" class="modal-body"></div>
            </div>
        </div>
    `);

    const globalModal = document.getElementById('globalModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBody = document.getElementById('modalBody');

    function closeModal() {
        globalModal.classList.remove('show');
        setTimeout(() => { globalModal.style.display = 'none'; }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target == globalModal) closeModal(); });

    // Función Global Expuesta para Abrir Modales
    window.openModal = function(type, id) {
        if (type === 'producto') {
            const prod = productosData.find(p => p.id === id);
            if(!prod) return;
            modalBody.innerHTML = `
                <div class="badge">${prod.categoria}</div>
                <h2>${prod.nombre}</h2>
                <p style="color: var(--text-light); margin-bottom: 25px;">${prod.descripcion}</p>
                <div class="modal-grid-info">
                    <div>
                        <strong>Peso / Medida</strong>
                        <span><i class="fas fa-weight-hanging" style="margin-right:8px; color: var(--text-light);"></i> ${prod.peso || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Composición (Material)</strong>
                        <span><i class="fas fa-atom" style="margin-right:8px; color: var(--text-light);"></i> ${prod.composicion || 'N/A'}</span>
                    </div>
                    <div style="grid-column: 1 / -1; font-size: 1.6rem; color: var(--primary-red); font-weight: 800; margin-top: 5px;">
                        $${prod.precio.toLocaleString('es-CO')} COP
                    </div>
                </div>
                <button class="btn btn-primary" style="width:100%; margin-top: 30px;" onclick="alert('Solicitud de producto iniciada (Demostración).'); document.getElementById('closeModalBtn').click();">
                    Solicitar Equipo <i class="fas fa-paper-plane"></i>
                </button>
            `;
        } else if (type === 'cliente') {
            const cli = clientesData.find(c => c.id === id);
            if(!cli) return;
            modalBody.innerHTML = `
                <h2 style="margin-bottom: 10px;">${cli.nombre}</h2>
                <p style="color: var(--text-light); margin-bottom: 25px; font-size: 1.1rem;">${cli.descripcion}</p>
                <div class="modal-grid-info" style="grid-template-columns: 1fr; gap: 20px;">
                    <div>
                        <strong>Ubicación Proyecto</strong>
                        <span><i class="fas fa-map-marker-alt" style="margin-right: 12px; color: var(--text-light);"></i>${cli.ubicacion || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Trabajo Realizado con Éxito</strong>
                        <span><i class="fas fa-check-circle" style="margin-right: 12px; color: #4ADE80;"></i>${cli.trabajo_realizado}</span>
                    </div>
                </div>
            `;
        }
        
        globalModal.style.display = 'flex';
        // Delay para permitir al motor de CSS parsear y luego animar
        setTimeout(() => { globalModal.classList.add('show'); }, 10);
    };

    // 6. Carrusel Suave para el Hero Background
    const heroSection = document.querySelector('.hero');
    if(heroSection) {
        // En lugar de imágenes porque contamos con un solo archivo, 
        // emularemos el carrusel giratorio con animaciones visuales fluidas.
        // Si el usuario quiere agregar imagenes: reemplaza el body del interval por url(...)
        const totalSlides = 3;
        let slide = 0;
        
        setInterval(() => {
            slide = (slide + 1) % totalSlides;
            if(slide === 0) heroSection.style.filter = "contrast(1) brightness(1)";
            if(slide === 1) heroSection.style.filter = "contrast(1.1) brightness(0.8) hue-rotate(5deg)";
            if(slide === 2) heroSection.style.filter = "contrast(1.2) brightness(0.9) hue-rotate(-5deg)";
        }, 6000); // Gira cada 6 segundos automáticamente
    }

    // 7. Lógica asíncrona (Fetch Data JSON)
    let productosData = [];
    let clientesData = [];

    fetch('data.json')
        .then(res => {
            if (!res.ok) throw new Error("Error cargando data.json");
            return res.json();
        })
        .then(data => {
            productosData = data.productos;
            clientesData = data.clientes;
            initPagesLogic();
        })
        .catch(err => console.error("Error Obteniendo JSON:", err));


    function initPagesLogic() {
        // HOME INDEX
        const homeProducts = document.getElementById('home-products-container');
        if (homeProducts) renderProductCards(productosData.slice(0, 3), homeProducts);

        const homeClients = document.getElementById('home-clients-container');
        if (homeClients) renderClientCards(clientesData.slice(0, 3), homeClients);

        // CATALOGO EXCLUSIVO
        const catalogProducts = document.getElementById('catalog-products-container');
        if (catalogProducts) initCatalogLogic(catalogProducts);

        // CLIENTES
        const allClients = document.getElementById('all-clients-container');
        if (allClients) renderClientCards(clientesData, allClients);
    }

    function renderProductCards(productsArray, container) {
        container.innerHTML = '';
        productsArray.forEach(prod => {
            const el = document.createElement('div');
            el.className = 'product-card';
            
            // Interactividad: Cursor apunto y Modal Trigger
            el.style.cursor = 'pointer';
            el.onclick = () => window.openModal('producto', prod.id);
            
            el.innerHTML = `
                <div class="product-img">
                    <span class="product-categorie-badge">${prod.categoria}</span>
                    <img src="${prod.imagen_url}" alt="${prod.nombre}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <p style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${prod.descripcion}</p>
                    <div class="product-price">$${prod.precio.toLocaleString('es-CO')} COP</div>
                    <button class="btn btn-secondary" style="margin-top: 20px; width: 100%; border-color: rgba(225, 29, 72, 0.5); color: var(--text-main); font-size: 0.95rem;">
                        Saber Especificaciones <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            container.appendChild(el);
        });
    }

    function renderClientCards(clientsArray, container) {
        container.innerHTML = '';
        clientsArray.forEach(cli => {
            const el = document.createElement('div');
            el.className = 'client-card';
            el.style.cursor = 'pointer';
            el.onclick = () => window.openModal('cliente', cli.id);
            
            el.innerHTML = `
                <img src="${cli.logo_url}" alt="${cli.nombre}" class="client-logo" loading="lazy">
                <div class="client-details" style="flex-grow: 1;">
                    <h3>${cli.nombre}</h3>
                    <p style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${cli.descripcion}</p>
                    <div class="work-done">
                        <i class="fas fa-check-shield"></i>
                        <span>${cli.trabajo_realizado}</span>
                    </div>
                </div>
                <div style="color: var(--primary-red); opacity: 0.6; align-self: center; font-size: 1.2rem;">
                    <i class="fas fa-external-link-alt"></i>
                </div>
            `;
            container.appendChild(el);
        });
    }

    function initCatalogLogic(container) {
        let activeCategory = 'Todos';
        const searchInput = document.getElementById('catalogSearchInput');
        const filtersContainer = document.getElementById('categoryFiltersContainer');
        const noProductsMsg = document.getElementById('catalog-no-products');

        const categories = ['Todos', ...new Set(productosData.map(p => p.categoria))];
        
        filtersContainer.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `cat-btn ${cat === 'Todos' ? 'active' : ''}`;
            btn.dataset.category = cat;
            btn.textContent = cat;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = cat;
                filterAndRender();
            });
            filtersContainer.appendChild(btn);
        });

        if (searchInput) searchInput.addEventListener('input', filterAndRender);

        function filterAndRender() {
            const query = searchInput ? searchInput.value.toLowerCase() : '';
            const filtered = productosData.filter(p => {
                const matchCategory = activeCategory === 'Todos' || p.categoria === activeCategory;
                const matchSearch = p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query);
                return matchCategory && matchSearch;
            });

            if (filtered.length === 0) {
                container.style.display = 'none';
                noProductsMsg.style.display = 'block';
            } else {
                container.style.display = 'grid';
                noProductsMsg.style.display = 'none';
                renderProductCards(filtered, container);
            }
        }
        filterAndRender();
    }

    // 8. Formulario Simulado
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("¡Mensaje de requerimiento enviado con éxito!");
            contactForm.reset();
        });
    }

});
