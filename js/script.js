document.addEventListener('DOMContentLoaded', () => {

    // 0. Theme Logic (Persistent)
    const savedTheme = localStorage.getItem('theme');
    
    function applyTheme(isLight) {
        const tBtns = document.querySelectorAll('#themeToggleBtn');
        if(isLight) {
            document.body.classList.add('light-mode');
            tBtns.forEach(b => b.innerHTML = '<i class="fas fa-sun" style="color: #F59E0B; text-shadow: 0 0 10px rgba(245,158,11,0.5);"></i>');
        } else {
            document.body.classList.remove('light-mode');
            tBtns.forEach(b => b.innerHTML = '<i class="fas fa-moon" style="color: var(--text-main);"></i>');
        }
    }

    if(savedTheme === 'light') applyTheme(true);
    else applyTheme(false);

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#themeToggleBtn');
        if(btn) {
            e.preventDefault();
            const isLightNow = document.body.classList.contains('light-mode');
            if(isLightNow) {
                localStorage.setItem('theme', 'dark');
                applyTheme(false);
            } else {
                localStorage.setItem('theme', 'light');
                applyTheme(true);
            }
        }
    });

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

    // 3. Navegación Móvil (Ahora Sidebar Global)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const globalSidebar = document.getElementById('globalSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    function toggleSidebar() {
        if(globalSidebar && sidebarOverlay) {
            globalSidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('open');
        }
    }

    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // 4. Lógica "Ver Más" para Servicios
    const btnVerMas = document.querySelectorAll('.btn-ver-mas');
    btnVerMas.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const descContainer = e.target.closest('.service-card').querySelector('.service-desc');
            const icon = e.target.querySelector('i');
            if (descContainer.style.maxHeight === '48px' || descContainer.style.maxHeight === '') {
                descContainer.style.maxHeight = '200px';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                e.target.innerHTML = 'Ver Menos <i class="fas fa-chevron-up"></i>';
            } else {
                descContainer.style.maxHeight = '48px';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
                e.target.innerHTML = 'Ver Más <i class="fas fa-chevron-down"></i>';
            }
        });
    });

    // 5. ScrollSpy (Solo para index.html)
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0 && !isAlwaysScrolled) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 200)) current = section.getAttribute('id');
            });
            // Omito actualización para href de sidebar porque ahora es un menú general y no un tracker en vivo en el top bar.
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
                    ${window.location.pathname.includes('cotizacion.html') ? `
                    <div style="grid-column: 1 / -1; font-size: 1.6rem; color: var(--primary-red); font-weight: 800; margin-top: 5px;">
                        $${prod.precio.toLocaleString('es-CO')} COP
                    </div>
                    ` : ''}
                </div>
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

    fetch('data/data.json')
        .then(res => {
            if (!res.ok) throw new Error("Error cargando data/data.json");
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

        // COTIZACION EXCLUSIVO
        const cotizacionProducts = document.getElementById('cotizacion-products-container');
        if (cotizacionProducts) initCotizacionLogic(cotizacionProducts);

        // CLIENTES
        const allClients = document.getElementById('all-clients-container');
        if (allClients) renderClientCards(clientesData, allClients);

        // LÓGICA DE FILTROS LATERALES GLOBAL
        const filterSidebar = document.getElementById('filterSidebar');
        if(filterSidebar) {
            document.addEventListener('click', (e) => {
                if(e.target.closest('#openFilterBtn')) {
                    filterSidebar.classList.add('open');
                } else if(e.target.closest('#closeFilterBtn')) {
                    filterSidebar.classList.remove('open');
                } else if(e.target.closest('.cat-btn') && window.innerWidth < 1024) {
                    // Cierra el sidebar al seleccionar categoría en móviles/tabletas
                    filterSidebar.classList.remove('open');
                }
            });
        }
    }

    function renderProductCards(productsArray, container) {
        container.innerHTML = '';
        productsArray.forEach(prod => {
            const el = document.createElement('div');
            el.className = 'product-card';
            
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

    function initCotizacionLogic(container) {
        let cart = [];
        const openCartBtn = document.getElementById('openCartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const shoppingCartSidebar = document.getElementById('shoppingCartSidebar');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotalPrice = document.getElementById('cartTotalPrice');
        const cartCountBadge = document.getElementById('cartCountBadge');
        const btnComprar = document.getElementById('btnComprar');
        // Modals
        const checkoutModal = document.getElementById('checkoutModal');
        const successModal = document.getElementById('successModal');
        const editEmailModal = document.getElementById('editEmailModal');

        function toggleCart() {
            if(shoppingCartSidebar) {
                shoppingCartSidebar.classList.toggle('open');
                document.body.classList.toggle('cart-active');
            }
        }
        if(openCartBtn) openCartBtn.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
        if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);

        function renderCotizacionProducts(filtered) {
            container.innerHTML = '';
            filtered.forEach(prod => {
                const el = document.createElement('div');
                el.className = 'product-card';
                el.innerHTML = `
                    <div class="product-img" style="cursor: pointer;" onclick="window.openModal('producto', ${prod.id})">
                        <span class="product-categorie-badge">${prod.categoria}</span>
                        <img src="${prod.imagen_url}" alt="${prod.nombre}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3 style="cursor: pointer;" onclick="window.openModal('producto', ${prod.id})">${prod.nombre}</h3>
                        <p style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${prod.descripcion}</p>
                        <div class="product-price">$${prod.precio.toLocaleString('es-CO')} COP</div>
                        <button class="btn btn-primary btn-add-cart" data-id="${prod.id}" style="margin-top: 15px; width: 100%; font-size: 0.95rem;">
                            Agregar al Carrito <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn btn-secondary" style="margin-top: 10px; width: 100%; font-size: 0.95rem;" onclick="window.openModal('producto', ${prod.id})">
                            Ver Especificaciones <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                `;
                container.appendChild(el);
            });

            container.querySelectorAll('.btn-add-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('button').dataset.id);
                    addToCart(id);
                });
            });
        }

        function addToCart(id) {
            const prod = productosData.find(p => p.id === id);
            const existingItem = cart.find(item => item.id === id);
            if(existingItem) {
                existingItem.cantidad = (existingItem.cantidad || 1) + 1;
            } else {
                cart.push({ ...prod, cantidad: 1 });
            }
            updateCartUI();
            if(!shoppingCartSidebar.classList.contains('open')) {
                if(window.innerWidth > 768) {
                    toggleCart();
                }
            }
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
        }

        function updateCartUI() {
            if(!cartItemsContainer) return;
            cartItemsContainer.innerHTML = '';
            let total = 0;
            let totalItems = 0;
            cart.forEach((item, index) => {
                const qty = item.cantidad || 1;
                total += (item.precio * qty);
                totalItems += qty;
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.imagen_url}" alt="${item.nombre}">
                    <div>
                        <h4>${item.nombre} ${qty > 1 ? `(x${qty})` : ''}</h4>
                        <div class="cart-item-price">$${(item.precio * qty).toLocaleString('es-CO')} COP</div>
                    </div>
                    <i class="fas fa-trash cart-item-remove" data-index="${index}"></i>
                `;
                cartItemsContainer.appendChild(el);
            });

            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeFromCart(e.target.dataset.index);
                });
            });

            if(cartTotalPrice) cartTotalPrice.textContent = "$" + total.toLocaleString('es-CO') + " COP";
            
            if(cart.length > 0) {
                if(cartCountBadge) { cartCountBadge.style.display = 'block'; cartCountBadge.textContent = totalItems; }
                if(btnComprar) btnComprar.disabled = false;
                const pt = document.getElementById('btnPagarTotal');
                if(pt) pt.textContent = " ($" + total.toLocaleString('es-CO') + " COP)";
            } else {
                if(cartCountBadge) cartCountBadge.style.display = 'none';
                if(btnComprar) btnComprar.disabled = true;
                const pt = document.getElementById('btnPagarTotal');
                if(pt) pt.textContent = "";
            }
        }
        
        // Categorias y Filtros
        let activeCategory = 'Todos';
        const searchInput = document.getElementById('catalogSearchInput');
        const filtersContainer = document.getElementById('categoryFiltersContainer');
        const categories = ['Todos', ...new Set(productosData.map(p => p.categoria))];
        
        if(filtersContainer) {
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
        }

        if (searchInput) searchInput.addEventListener('input', filterAndRender);

        function filterAndRender() {
            const query = searchInput ? searchInput.value.toLowerCase() : '';
            const filtered = productosData.filter(p => {
                const matchCategory = activeCategory === 'Todos' || p.categoria === activeCategory;
                const matchSearch = p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query);
                return matchCategory && matchSearch;
            });
            renderCotizacionProducts(filtered);
        }
        filterAndRender();
        updateCartUI();

        // Flujo de Checkout
        function closeM(m) {
            m.classList.remove('show');
            setTimeout(() => { m.style.display = 'none'; }, 300);
        }

        if(btnComprar) {
            btnComprar.addEventListener('click', () => {
                if(cart.length > 0) {
                    toggleCart();
                    if(checkoutModal) {
                        checkoutModal.style.display = 'flex';
                        setTimeout(() => checkoutModal.classList.add('show'), 10);
                    }
                }
            });
        }
        if(checkoutModal) {
            document.getElementById('closeCheckoutBtn').addEventListener('click', () => closeM(checkoutModal));
            
            let currentEmail = "";
            document.getElementById('checkoutForm').addEventListener('submit', (e) => {
                e.preventDefault();
                currentEmail = document.getElementById('chkEmail').value;
                document.getElementById('successEmailText').textContent = currentEmail;
                closeM(checkoutModal);
                
                // Simular pago
                cart = [];
                updateCartUI();
                
                if(successModal) {
                    successModal.style.display = 'flex';
                    setTimeout(() => successModal.classList.add('show'), 10);
                }
            });
        }

        if(successModal) {
            document.getElementById('closeSuccessBtn').addEventListener('click', () => closeM(successModal));
            
            document.getElementById('btnEditEmail').addEventListener('click', () => {
                closeM(successModal);
                document.getElementById('newEmailInput').value = document.getElementById('successEmailText').textContent;
                if(editEmailModal) {
                    editEmailModal.style.display = 'flex';
                    setTimeout(() => editEmailModal.classList.add('show'), 10);
                }
            });
        }

        if(editEmailModal) {
            document.getElementById('closeEditEmailBtn').addEventListener('click', () => closeM(editEmailModal));
            document.getElementById('btnUpdateEmail').addEventListener('click', () => {
                const newEmail = document.getElementById('newEmailInput').value;
                if(newEmail) {
                    document.getElementById('successEmailText').textContent = newEmail;
                    closeM(editEmailModal);
                    if(successModal) {
                        successModal.style.display = 'flex';
                        setTimeout(() => successModal.classList.add('show'), 10);
                    }
                }
            });
        }
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
