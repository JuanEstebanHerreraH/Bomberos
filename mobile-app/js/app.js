const app = {};

app.state = {
    productos: [],
    clientes: [],
    cart: [],
    currentView: 'home',
    activeCategory: 'Todos'
};

app.init = async function() {
    try {
        const response = await fetch('../data/data.json');
        const data = await response.json();
        app.state.productos = data.productos;
        app.state.clientes = data.clientes;
        
        app.renderCategories();
        app.renderProducts();
        app.renderClients();
        
        // Hide loader
        document.getElementById('loaderOverlay').style.display = 'none';

        // Listeners for Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const filtered = app.state.productos.filter(p => 
                p.nombre.toLowerCase().includes(val) || 
                p.categoria.toLowerCase().includes(val)
            );
            app.renderProducts(filtered);
        });

        // Checkout form listener
        document.getElementById('mobileCheckoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('chkEmail').value;
            document.getElementById('successEmailDisplay').innerText = emailInput;
            app.state.cart = []; // Empty cart
            app.updateCartUI();
            app.switchView('success');
        });

    } catch (e) {
        console.error("No se pudo cargar data.json", e);
        alert("Hubo un error cargando los datos de los productos.");
        document.getElementById('loaderOverlay').style.display = 'none';
    }
};

app.closeSplash = function() {
    const splash = document.getElementById('splashScreen');
    if(splash) {
        splash.classList.add('hidden');
        setTimeout(() => splash.style.display = 'none', 400); // remove fully after transiton
    }
};

app.switchView = function(viewId) {
    if(viewId === 'cart' || viewId === 'checkout' || viewId === 'success') {
        document.querySelector('.top-bar').style.display = 'none';
        if(viewId === 'success' || viewId === 'checkout') {
            document.getElementById('bottomNav').style.display = 'none';
        } else {
            document.getElementById('bottomNav').style.display = 'flex';
        }
    } else {
        document.querySelector('.top-bar').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
    }

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById('view-' + viewId).classList.add('active');
    app.state.currentView = viewId;

    if(viewId === 'home') document.querySelectorAll('.nav-item')[0].classList.add('active');
    if(viewId === 'cart') document.querySelectorAll('.nav-item')[1].classList.add('active');
    if(viewId === 'clients') document.querySelectorAll('.nav-item')[2].classList.add('active');
    if(viewId === 'contact') document.querySelectorAll('.nav-item')[3].classList.add('active');
    
    window.scrollTo(0,0);
};

app.toggleSidebarFilters = function() {
    const isMobile = true;
    const panel = document.getElementById('mobileFilterPanel');
    const overlay = document.getElementById('mobileFilterOverlay');
    if(panel.style.left === '0px') {
        panel.style.left = '-300px';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // allow scroll
    } else {
        panel.style.left = '0px';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // prevent scroll
    }
};

app.editSuccessEmail = function() {
    const newEmail = prompt("Ingresa el nuevo correo para enviar la factura:");
    if(newEmail && newEmail.includes('@')) {
        document.getElementById('successEmailDisplay').innerText = newEmail;
        alert("¡Correo actualizado exitosamente! Se re-enviará el comprobante.");
    } else if (newEmail) {
        alert("Por favor ingresa un correo válido.");
    }
};

app.renderCategories = function() {
    const cats = new Set(app.state.productos.map(p => p.categoria));
    const sidebar = document.getElementById('sidebarCategoryScroll'); // El sidebar de filtros
    
    if(sidebar) sidebar.innerHTML = `<div style="font-weight: 600; cursor:pointer; color: var(--primary-red);" onclick="app.setCategory('Todos', this); app.toggleSidebarFilters()"><i class="fas fa-check-circle" style="margin-right:8px;"></i>Todas las Categorías</div>`;
    
    cats.forEach(c => {
        if(sidebar) sidebar.innerHTML += `<div style="cursor:pointer; padding: 5px 0; color: #333;" onclick="app.setCategory('${c}', this); app.toggleSidebarFilters()"><i class="far fa-circle" style="margin-right:8px; color:#ccc;"></i>${c}</div>`;
    });
};

app.setCategory = function(cat, element) {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    app.state.activeCategory = cat;
    
    if(cat === 'Todos') {
        app.renderProducts();
    } else {
        const filtered = app.state.productos.filter(p => p.categoria === cat);
        app.renderProducts(filtered);
    }
};

app.renderProducts = function(productosAListar) {
    const list = productosAListar || app.state.productos;
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    if(list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 40px; color:#999; grid-column: span 2;">No hay productos con este filtro.</div>`;
        return;
    }
    
    list.forEach(p => {
        const item = document.createElement('div');
        item.className = 'prod-card-grid';
        item.innerHTML = `
            <div class="prod-img-box">
                <img src="../${p.imagen_url}" alt="${p.nombre}" loading="lazy" onerror="this.src='../assets/Test.png'">
            </div>
            <div class="prod-info-box">
                <h3>${p.nombre}</h3>
                <div class="prod-price-box">$${p.precio.toLocaleString('es-CO')}</div>
                <button class="btn-add-grid" onclick="app.addToCart(${p.id})"><i class="fas fa-plus"></i></button>
            </div>
        `;
        container.appendChild(item);
    });
};

app.renderClients = function() {
    const container = document.getElementById('clientsList');
    container.innerHTML = '';
    
    app.state.clientes.forEach(c => {
        container.innerHTML += `
            <div class="client-card-ml">
                <div class="client-header">
                    <img src="../${c.logo_url}" alt="${c.nombre}" onerror="this.src='../assets/Test.png'">
                    <h3>${c.nombre}</h3>
                </div>
                <p class="client-desc"><i class="fas fa-check-circle" style="color: #00a650; margin-right: 5px;"></i>${c.trabajo_realizado}</p>
            </div>
        `;
    });
};

app.addToCart = function(id) {
    const p = app.state.productos.find(x => x.id === id);
    if(p) {
        const existingItem = app.state.cart.find(item => item.id === id);
        if(existingItem) {
            existingItem.cantidad = (existingItem.cantidad || 1) + 1;
        } else {
            app.state.cart.push({ ...p, cantidad: 1 });
        }
        app.updateCartUI();
        
        // Pequeño feedback visual indicando agregado
        const badge = document.getElementById('topCartBadge');
        badge.style.transform = 'scale(1.5)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
};

app.removeFromCart = function(index) {
    app.state.cart.splice(index, 1);
    app.updateCartUI();
};

app.updateCartUI = function() {
    let cCount = 0;
    app.state.cart.forEach(item => {
        cCount += (item.cantidad || 1);
    });
    
    const topBadge = document.getElementById('topCartBadge');
    const bottomBadge = document.getElementById('bottomCartBadge');
    
    if(app.state.cart.length > 0) {
        topBadge.style.display = 'block'; topBadge.innerText = cCount;
        bottomBadge.style.display = 'block'; bottomBadge.innerText = cCount;
        document.getElementById('cartSummaryBlock').style.display = 'block';
        document.getElementById('emptyCartMessage').style.display = 'none';
    } else {
        topBadge.style.display = 'none';
        bottomBadge.style.display = 'none';
        document.getElementById('cartSummaryBlock').style.display = 'none';
        document.getElementById('emptyCartMessage').style.display = 'block';
    }
    
    let total = 0;
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = '';
    
    app.state.cart.forEach((p, idx) => {
        const qty = p.cantidad || 1;
        total += (p.precio * qty);
        container.innerHTML += `
            <div class="cart-item-ml">
                <img src="../${p.imagen_url}" onerror="this.src='../assets/Test.png'">
                <div class="cart-item-info">
                    <h4>${p.nombre} ${qty > 1 ? `(x${qty})` : ''}</h4>
                    <div class="cart-item-price">$${(p.precio * qty).toLocaleString('es-CO')}</div>
                    <div class="cart-item-del" onclick="app.removeFromCart(${idx})">Eliminar</div>
                </div>
            </div>
        `;
    });
    
    const finalPrice = `$${total.toLocaleString('es-CO')} COP`;
    document.getElementById('cartTotalText').innerText = finalPrice;
    document.getElementById('checkoutTotalText').innerText = finalPrice;
};

app.showCheckout = function() {
    app.switchView('checkout');
};

// Start
document.addEventListener('DOMContentLoaded', app.init);
