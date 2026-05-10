document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       0. THEME (persisted in localStorage)
    ============================================ */
    function applyTheme(isLight) {
        const btn = document.getElementById('themeToggleBtn');
        if (isLight) {
            document.body.classList.add('light-mode');
            if (btn) btn.innerHTML = '<i class="fas fa-sun" style="color:#F59E0B"></i>';
        } else {
            document.body.classList.remove('light-mode');
            if (btn) btn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'light');

    document.addEventListener('click', (e) => {
        if (e.target.closest('#themeToggleBtn')) {
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'dark' : 'light');
            applyTheme(!isLight);
        }
    });

    /* ============================================
       1. STICKY NAVBAR
    ============================================ */
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    /* ============================================
       2. SCROLL-TO-TOP BUTTON
    ============================================ */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================================
       3. SIDEBAR NAVIGATION
    ============================================ */
    const sidebar        = document.getElementById('globalSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar()  { sidebar?.classList.add('open');    sidebarOverlay?.classList.add('open'); }
    function closeSidebar() { sidebar?.classList.remove('open'); sidebarOverlay?.classList.remove('open'); }

    document.getElementById('sidebar-toggle')?.addEventListener('click', openSidebar);
    document.getElementById('closeSidebarBtn')?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    /* ============================================
       4. SERVICE CARDS — "VER MÁS" TOGGLE
    ============================================ */
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
        btn.addEventListener('click', () => {
            const card    = btn.closest('.service-card');
            const wrap    = card?.querySelector('.service-desc-wrap');
            const icon    = btn.querySelector('i');
            const open    = wrap?.style.maxHeight && wrap.style.maxHeight !== '3.2em';

            if (!wrap) return;
            wrap.style.maxHeight = open ? '3.2em' : '200px';
            if (icon) {
                icon.className = open ? 'fas fa-chevron-down ms-1' : 'fas fa-chevron-up ms-1';
            }
            btn.innerHTML = open
                ? 'Ver Más <i class="fas fa-chevron-down ms-1"></i>'
                : 'Ver Menos <i class="fas fa-chevron-up ms-1"></i>';
        });
    });

    /* ============================================
       5. GLOBAL MODAL
    ============================================ */
    const globalModal  = document.getElementById('globalModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBody    = document.getElementById('modalBody');

    function openModal(type, id) {
        if (!globalModal || !modalBody) return;

        if (type === 'producto') {
            const prod = productosData.find(p => p.id === id);
            if (!prod) return;
            modalBody.innerHTML = `
                <div class="badge">${prod.categoria}</div>
                <h2>${prod.nombre}</h2>
                <p>${prod.descripcion}</p>
                <div class="modal-grid-info">
                    <div>
                        <strong>Peso / Medida</strong>
                        <span><i class="fas fa-weight-hanging me-2" style="color:var(--muted)"></i>${prod.peso || 'N/A'}</span>
                    </div>
                    <div>
                        <strong>Composición</strong>
                        <span><i class="fas fa-atom me-2" style="color:var(--muted)"></i>${prod.composicion || 'N/A'}</span>
                    </div>
                    ${window.location.pathname.includes('cotizacion.html') ? `
                    <div style="grid-column:1/-1; font-size:1.6rem; color:var(--red); font-weight:800; margin-top:5px;">
                        $${prod.precio.toLocaleString('es-CO')} COP
                    </div>` : ''}
                </div>
            `;
        } else if (type === 'cliente') {
            const cli = clientesData.find(c => c.id === id);
            if (!cli) return;
            modalBody.innerHTML = `
                <h2 style="margin-bottom:10px">${cli.nombre}</h2>
                <p style="margin-bottom:20px">${cli.descripcion}</p>
                <div class="modal-grid-info" style="grid-template-columns:1fr">

                    <div>
                        <strong>Trabajo Realizado</strong>
                        <span><i class="fas fa-check-circle me-2" style="color:#4ade80"></i>${cli.trabajo_realizado}</span>
                    </div>
                </div>
            `;
        }

        globalModal.style.display = 'flex';
        requestAnimationFrame(() => globalModal.classList.add('show'));
    }
    window.openModal = openModal;

    function closeModalFn() {
        if (!globalModal) return;
        globalModal.classList.remove('show');
        setTimeout(() => { globalModal.style.display = 'none'; }, 300);
    }

    closeModalBtn?.addEventListener('click', closeModalFn);
    globalModal?.addEventListener('click', (e) => { if (e.target === globalModal) closeModalFn(); });

    /* ============================================
       6. SCROLL ANIMATIONS
    ============================================ */
    const animateEls = document.querySelectorAll('[data-animate]');
    if (animateEls.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        animateEls.forEach(el => obs.observe(el));
    }

    /* ============================================
       6b. COUNTER ANIMATION (stats bar)
    ============================================ */
    function animateCounter(el, target, duration) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { el.textContent = target; clearInterval(timer); }
            else el.textContent = Math.floor(start);
        }, 16);
    }
    const statNums = document.querySelectorAll('.stat-number[data-count]');
    if (statNums.length) {
        const statObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el  = entry.target;
                    const val = parseInt(el.dataset.count, 10);
                    animateCounter(el, val, 1600);
                    statObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => statObs.observe(el));
    }

    /* ============================================
       7. DATA FETCH + PAGE INITIALIZATION
    ============================================ */
    let productosData = [];
    let clientesData  = [];

    // Resolve path to data.json from any subfolder depth
    const dataPath = window.location.pathname.includes('/Others/')
        ? '../data/data.json'
        : 'data/data.json';

    fetch(dataPath)
        .then(res => {
            if (!res.ok) throw new Error('Error cargando data.json');
            return res.json();
        })
        .then(data => {
            productosData = data.productos;
            clientesData  = data.clientes;
            initPages();
        })
        .catch(err => console.error('Error JSON:', err));


    function initPages() {
        /* ---- HOME INDEX ---- */
        const homeProducts = document.getElementById('home-products-container');
        if (homeProducts) renderProductCards(productosData.slice(0, 3), homeProducts, 'col-md-4');

        const homeClients = document.getElementById('home-clients-container');
        if (homeClients) renderMarqueeClients(clientesData, homeClients);

        /* ---- CATÁLOGO ---- */
        const catalogProducts = document.getElementById('catalog-products-container');
        if (catalogProducts) initCatalogLogic(catalogProducts);

        /* ---- COTIZACIÓN ---- */
        const cotizacionProducts = document.getElementById('cotizacion-products-container');
        if (cotizacionProducts) initCotizacionLogic(cotizacionProducts);

        /* ---- CLIENTES ---- */
        const allClients = document.getElementById('all-clients-container');
        if (allClients) renderClientCards(clientesData, allClients);

        /* ---- FILTER PANEL (catálogo) — off-canvas izquierdo ---- */
        const filterPanel = document.getElementById('filterSidebar');
        const filterOverlay = document.getElementById('filterOverlay');
        if (filterPanel) {
            document.addEventListener('click', (e) => {
                if (e.target.closest('#openFilterBtn'))  {
                    filterPanel.classList.add('open');
                    if (filterOverlay) filterOverlay.classList.add('open');
                }
                if (e.target.closest('#closeFilterBtn')) {
                    filterPanel.classList.remove('open');
                    if (filterOverlay) filterOverlay.classList.remove('open');
                }
                if (e.target.closest('.cat-chip')) {
                    filterPanel.classList.remove('open');
                    if (filterOverlay) filterOverlay.classList.remove('open');
                }
            });
            if (filterOverlay) {
                filterOverlay.addEventListener('click', () => {
                    filterPanel.classList.remove('open');
                    filterOverlay.classList.remove('open');
                });
            }
        }
    }

    /* ============================================
       RENDER HELPERS
    ============================================ */
    function renderProductCards(arr, container, colClass = '') {
        container.innerHTML = '';
        arr.forEach(prod => {
            const wrapper = document.createElement('div');
            if (colClass) wrapper.className = colClass;

            const card = document.createElement('div');
            card.className = 'product-card h-100';
            card.style.cursor = 'pointer';
            card.onclick = () => openModal('producto', prod.id);
            card.innerHTML = `
                <div class="product-img">
                    <span class="product-categorie-badge">${prod.categoria}</span>
                    <img src="${prod.imagen_url}" alt="${prod.nombre}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <p style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${prod.descripcion}</p>
                    <button class="btn btn-outline-danger">
                        Ver Especificaciones <i class="fas fa-arrow-right ms-1"></i>
                    </button>
                </div>
            `;

            if (colClass) { wrapper.appendChild(card); container.appendChild(wrapper); }
            else container.appendChild(card);
        });
    }

    /* Marquee de clientes para el home */
    function renderMarqueeClients(arr, container) {
        // Duplicamos el array para el loop infinito del marquee
        const all = [...arr, ...arr];
        container.innerHTML = '';
        all.forEach(cli => {
            const card = document.createElement('div');
            card.className = 'client-marquee-card';
            card.onclick = () => openModal('cliente', cli.id);
            card.innerHTML = `
                <img src="${cli.logo_url}" alt="${cli.nombre}" loading="lazy">
                <span>${cli.nombre}</span>
            `;
            container.appendChild(card);
        });
    }

    function renderClientCards(arr, container) {
        container.innerHTML = '';
        // Detectar si es la página clientes (premium grid) o el home (lista)
        const isPremiumGrid = container.id === 'all-clients-container';

        if (isPremiumGrid) {
            arr.forEach(cli => {
                const wrapper = document.createElement('div');
                const card = document.createElement('div');
                card.className = 'client-premium-card';
                card.onclick = () => openModal('cliente', cli.id);
                card.innerHTML = `
                    <div class="cpc-header">
                        <img src="${cli.logo_url}" alt="${cli.nombre}" class="cpc-logo" loading="lazy">
                        <div>
                            <p class="cpc-name">${cli.nombre}</p>
                        </div>
                    </div>
                    <p class="cpc-desc">${cli.descripcion}</p>
                    <div class="d-flex align-items-center gap-2">
                        <div class="cpc-work flex-grow-1">
                            <i class="fas fa-check-circle"></i>
                            <span>${cli.trabajo_realizado}</span>
                        </div>
                        <i class="fas fa-arrow-right cpc-arrow"></i>
                    </div>
                `;
                wrapper.appendChild(card);
                container.appendChild(wrapper);
            });
            // Actualizar contador
            const lbl = document.getElementById('clientsCountLabel');
            if (lbl) lbl.textContent = arr.length + ' cliente' + (arr.length !== 1 ? 's' : '');
        } else {
            arr.forEach(cli => {
                const card = document.createElement('div');
                card.className = 'client-card';
                card.onclick = () => openModal('cliente', cli.id);
                card.innerHTML = `
                    <img src="${cli.logo_url}" alt="${cli.nombre}" class="client-logo" loading="lazy">
                    <div class="client-details flex-grow-1">
                        <h3>${cli.nombre}</h3>
                        <p style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${cli.descripcion}</p>
                        <div class="work-done">
                            <i class="fas fa-check-circle"></i>
                            <span>${cli.trabajo_realizado}</span>
                        </div>
                    </div>
                    <i class="fas fa-external-link-alt" style="color:var(--red);opacity:0.6;font-size:1rem;flex-shrink:0"></i>
                `;
                container.appendChild(card);
            });
        }
    }

    /* ============================================
       CATALOG LOGIC (filtros + búsqueda)
    ============================================ */
    function initCatalogLogic(container) {
        let activeCategory = 'Todos';
        const searchInput      = document.getElementById('catalogSearchInput');
        const filtersContainer = document.getElementById('categoryFiltersContainer');
        const noProductsMsg    = document.getElementById('catalog-no-products');
        const activeCatLabel   = document.getElementById('activeCatLabel');
        const countBadge       = document.getElementById('productCountBadge');

        const categories = ['Todos', ...new Set(productosData.map(p => p.categoria))];
        if (filtersContainer) {
            filtersContainer.innerHTML = '';
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = `cat-chip ${cat === 'Todos' ? 'active' : ''}`;
                btn.dataset.category = cat;
                btn.innerHTML = `<i class="fas fa-${cat === 'Todos' ? 'th-large' : 'tag'} me-1"></i> ${cat}`;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeCategory = cat;
                    filterAndRender();
                });
                filtersContainer.appendChild(btn);
            });
        }

        searchInput?.addEventListener('input', filterAndRender);

        function filterAndRender() {
            const q = searchInput ? searchInput.value.toLowerCase() : '';
            const filtered = productosData.filter(p => {
                const matchCat    = activeCategory === 'Todos' || p.categoria === activeCategory;
                const matchSearch = p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
                return matchCat && matchSearch;
            });

            // Actualizar label y contador en toolbar
            if (activeCatLabel) {
                const icon = activeCategory === 'Todos' ? 'th-large' : 'tag';
                activeCatLabel.innerHTML = `<i class="fas fa-${icon} me-1"></i> ${activeCategory === 'Todos' ? 'Todas las Categorías' : activeCategory}`;
            }
            if (countBadge) countBadge.textContent = filtered.length + ' producto' + (filtered.length !== 1 ? 's' : '');

            if (filtered.length === 0) {
                container.style.display = 'none';
                if (noProductsMsg) noProductsMsg.style.display = 'flex';
            } else {
                container.style.display = '';
                if (noProductsMsg) noProductsMsg.style.display = 'none';
                renderProductCards(filtered, container, 'col-lg-3 col-md-4 col-sm-6');
            }
        }
        filterAndRender();
    }

    /* ============================================
       COTIZACIÓN LOGIC (carrito + checkout)
    ============================================ */
    function initCotizacionLogic(container) {
        let cart = [];

        const openCartBtn        = document.getElementById('openCartBtn');
        const closeCartBtn       = document.getElementById('closeCartBtn');
        const shoppingCartSidebar = document.getElementById('shoppingCartSidebar');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotalPrice     = document.getElementById('cartTotalPrice');
        const cartCountBadge     = document.getElementById('cartCountBadge');
        const btnComprar         = document.getElementById('btnComprar');
        const checkoutModal      = document.getElementById('checkoutModal');
        const successModal       = document.getElementById('successModal');
        const editEmailModal     = document.getElementById('editEmailModal');

        function toggleCart() {
            shoppingCartSidebar?.classList.toggle('open');
            document.body.classList.toggle('cart-active');
        }
        openCartBtn?.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
        closeCartBtn?.addEventListener('click', toggleCart);

        function renderCotizacionProducts(filtered) {
            container.innerHTML = '';
            const noProducts = document.getElementById('catalog-no-products');
            if (filtered.length === 0) {
                if (noProducts) noProducts.style.display = 'block';
                return;
            } else {
                if (noProducts) noProducts.style.display = 'none';
            }

            filtered.forEach(prod => {
                const wrapper = document.createElement('div');
                wrapper.className = 'col-lg-3 col-md-4 col-sm-6';
                
                const itemInCart = cart.find(i => i.id === prod.id);

                wrapper.innerHTML = `
                    <div class="cotiz-product-card">
                        <div class="cotiz-product-img" style="cursor:pointer" onclick="window.openModal('producto', ${prod.id})">
                            <img src="${prod.imagen_url}" alt="${prod.nombre}" loading="lazy">
                        </div>
                        <div class="cotiz-product-body">
                            <h3 class="cotiz-product-name" style="cursor:pointer" onclick="window.openModal('producto', ${prod.id})">${prod.nombre}</h3>
                            <p class="cotiz-product-desc">${prod.descripcion}</p>
                            <div>
                                <div class="cotiz-product-price">$${prod.precio.toLocaleString('es-CO')} <span class="cotiz-product-price-note">COP</span></div>
                            </div>
                            ${ itemInCart 
                                ? `<div class="cotiz-in-cart-badge"><i class="fas fa-check"></i> En carrito</div>
                                   <div class="cotiz-qty-control">
                                      <button class="btn-qty-minus" data-id="${prod.id}">-</button>
                                      <div class="cotiz-qty-num">${itemInCart.cantidad}</div>
                                      <button class="btn-qty-plus" data-id="${prod.id}">+</button>
                                   </div>`
                                : `<button class="btn btn-danger cotiz-add-btn btn-ripple" data-id="${prod.id}">
                                      Agregar al Carrito <i class="fas fa-cart-plus ms-1"></i>
                                   </button>`
                            }
                        </div>
                    </div>
                `;
                container.appendChild(wrapper);
            });

            container.querySelectorAll('.cotiz-add-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const r = document.createElement('span');
                    r.className = 'btn-ripple-circle';
                    const rect = this.getBoundingClientRect();
                    r.style.left = (e.clientX - rect.left) + 'px';
                    r.style.top  = (e.clientY - rect.top)  + 'px';
                    this.appendChild(r);
                    setTimeout(() => r.remove(), 700);

                    addToCart(parseInt(this.dataset.id));
                });
            });
            container.querySelectorAll('.btn-qty-plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    addToCart(parseInt(e.target.closest('button').dataset.id));
                });
            });
            container.querySelectorAll('.btn-qty-minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeFromCartById(parseInt(e.target.closest('button').dataset.id));
                });
            });
        }

        function addToCart(id) {
            const prod = productosData.find(p => p.id === id);
            const item = cart.find(i => i.id === id);
            if (item) item.cantidad = (item.cantidad || 1) + 1;
            else cart.push({ ...prod, cantidad: 1 });
            updateCartUI();
            filterAndRender(); // Re-render to show qty controls
            if (shoppingCartSidebar && !shoppingCartSidebar.classList.contains('open') && window.innerWidth > 768 && !item) toggleCart();
        }

        function removeFromCartById(id) {
            const index = cart.findIndex(i => i.id === id);
            if (index > -1) {
                if (cart[index].cantidad > 1) {
                    cart[index].cantidad--;
                } else {
                    cart.splice(index, 1);
                }
                updateCartUI();
                filterAndRender(); // Re-render to show add btn
            }
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
            filterAndRender();
        }

        function updateCartUI() {
            if (!cartItemsContainer) return;
            cartItemsContainer.innerHTML = '';
            let total = 0, totalItems = 0;

            cart.forEach((item, index) => {
                const qty = item.cantidad || 1;
                total += item.precio * qty;
                totalItems += qty;
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.imagen_url}" alt="${item.nombre}">
                    <div>
                        <h4>${item.nombre}${qty > 1 ? ` (x${qty})` : ''}</h4>
                        <div class="cart-item-price">$${(item.precio * qty).toLocaleString('es-CO')} COP</div>
                    </div>
                    <i class="fas fa-trash cart-item-remove" data-index="${index}"></i>
                `;
                cartItemsContainer.appendChild(el);
            });

            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.index));
            });

            if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toLocaleString('es-CO')} COP`;

            if (cart.length > 0) {
                if (cartCountBadge) { cartCountBadge.style.display = 'block'; cartCountBadge.textContent = totalItems; }
                if (btnComprar) btnComprar.disabled = false;
                const pt = document.getElementById('btnPagarTotal');
                if (pt) pt.textContent = ` ($${total.toLocaleString('es-CO')} COP)`;
            } else {
                if (cartCountBadge) cartCountBadge.style.display = 'none';
                if (btnComprar) btnComprar.disabled = true;
                const pt = document.getElementById('btnPagarTotal');
                if (pt) pt.textContent = '';
            }
        }

        /* Filters */
        let activeCategory = 'Todos';
        const searchInput      = document.getElementById('catalogSearchInput');
        const filtersContainer = document.getElementById('categoryFiltersContainer');
        const activeCatLabel   = document.getElementById('activeCatLabel');
        const categories = ['Todos', ...new Set(productosData.map(p => p.categoria))];

        if (filtersContainer) {
            filtersContainer.innerHTML = '';
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = `btn btn-outline-light w-100 text-start cat-btn ${cat === 'Todos' ? 'active' : ''}`;
                btn.dataset.category = cat;
                btn.innerHTML = `<i class="fas fa-${cat === 'Todos' ? 'th-large' : 'tag'} me-2"></i> ${cat}`;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('#categoryFiltersContainer .cat-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeCategory = cat;
                    filterAndRender();
                    
                    // Close sidebar automatically on mobile/desktop when selecting
                    const filterPanel = document.getElementById('filterSidebar');
                    const filterOverlay = document.getElementById('filterOverlay');
                    if(filterPanel) filterPanel.classList.remove('open');
                    if(filterOverlay) filterOverlay.classList.remove('open');
                });
                filtersContainer.appendChild(btn);
            });
        }
        searchInput?.addEventListener('input', filterAndRender);

        function filterAndRender() {
            const q = searchInput ? searchInput.value.toLowerCase() : '';
            const filtered = productosData.filter(p => {
                const matchCat    = activeCategory === 'Todos' || p.categoria === activeCategory;
                const matchSearch = p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
                return matchCat && matchSearch;
            });
            const badge = document.getElementById('productCountBadge');
            if (badge) badge.textContent = filtered.length + ' producto' + (filtered.length !== 1 ? 's' : '');
            
            if (activeCatLabel) {
                activeCatLabel.innerHTML = `<i class="fas fa-${activeCategory === 'Todos' ? 'th-large' : 'tag'} me-1"></i> ${activeCategory === 'Todos' ? 'Todas las Categorías' : activeCategory}`;
            }

            renderCotizacionProducts(filtered);
        }
        filterAndRender();
        updateCartUI();

        /* Checkout flow */
        function closeM(m) {
            m?.classList.remove('show');
            setTimeout(() => { if (m) m.style.display = 'none'; }, 300);
        }

        btnComprar?.addEventListener('click', () => {
            if (cart.length > 0) {
                toggleCart();
                if (checkoutModal) {
                    checkoutModal.style.display = 'flex';
                    requestAnimationFrame(() => checkoutModal.classList.add('show'));
                }
            }
        });

        if (checkoutModal) {
            document.getElementById('closeCheckoutBtn')?.addEventListener('click', () => closeM(checkoutModal));
            let currentEmail = '';
            document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                currentEmail = document.getElementById('chkEmail').value;
                const emailText = document.getElementById('successEmailText');
                if (emailText) emailText.textContent = currentEmail;
                closeM(checkoutModal);
                cart = [];
                updateCartUI();
                if (successModal) {
                    successModal.style.display = 'flex';
                    requestAnimationFrame(() => successModal.classList.add('show'));
                }
            });
        }

        if (successModal) {
            document.getElementById('closeSuccessBtn')?.addEventListener('click', () => closeM(successModal));
            document.getElementById('btnEditEmail')?.addEventListener('click', () => {
                closeM(successModal);
                const emailInput = document.getElementById('newEmailInput');
                const emailText  = document.getElementById('successEmailText');
                if (emailInput && emailText) emailInput.value = emailText.textContent;
                if (editEmailModal) {
                    editEmailModal.style.display = 'flex';
                    requestAnimationFrame(() => editEmailModal.classList.add('show'));
                }
            });
        }

        if (editEmailModal) {
            document.getElementById('closeEditEmailBtn')?.addEventListener('click', () => closeM(editEmailModal));
            document.getElementById('btnUpdateEmail')?.addEventListener('click', () => {
                const newEmail  = document.getElementById('newEmailInput')?.value;
                const emailText = document.getElementById('successEmailText');
                if (newEmail && emailText) {
                    emailText.textContent = newEmail;
                    closeM(editEmailModal);
                    if (successModal) {
                        successModal.style.display = 'flex';
                        requestAnimationFrame(() => successModal.classList.add('show'));
                    }
                }
            });
        }
    }

    /* ============================================
       8. CONTACT FORM
    ============================================ */
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
        e.target.reset();
    });

});
