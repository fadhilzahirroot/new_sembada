// Toggle Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Ubah icon hamburger ke X
    const icon = hamburger.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '0';
        header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Active Link Highlighter on Scroll
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});

// Scroll Reveal Animation
window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 150;

        if (revealtop < windowheight - revealpoint) {
            reveals[i].classList.add('active');
        }
    }
}

// Trigger reveal on load
reveal();

// ============ SHOPPING CART ============
let cart = [];
let buyerInfo = {
    name: '',
    table: ''
};

// Close cart modal when clicking the close button
document.querySelector('.cart-close')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.hash = '';
});

// Close cart modal when clicking outside
document.querySelector('.cart-modal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        window.location.hash = '';
    }
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load buyer info from localStorage
function loadBuyerInfo() {
    const savedBuyer = localStorage.getItem('buyerInfo');
    if (savedBuyer) {
        buyerInfo = JSON.parse(savedBuyer);
        updateBuyerForm();
    }
}

// Save buyer info to localStorage
function saveBuyerInfo() {
    localStorage.setItem('buyerInfo', JSON.stringify(buyerInfo));
}

// Update buyer form inputs
function updateBuyerForm() {
    const nameInput = document.getElementById('buyerName');
    const tableInput = document.getElementById('buyerTable');
    if (nameInput) nameInput.value = buyerInfo.name;
    if (tableInput) tableInput.value = buyerInfo.table;
}

// Update buyer info from form
function updateBuyerInfoFromForm() {
    const nameInput = document.getElementById('buyerName');
    const tableInput = document.getElementById('buyerTable');
    
    buyerInfo.name = nameInput?.value || '';
    buyerInfo.table = tableInput?.value || '';
    
    saveBuyerInfo();
}

// Update cart badge
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

// Add item to cart
function addToCart(name, priceText) {
    // Parse price (remove "Rp " and dots)
    const price = parseInt(priceText.replace('Rp ', '').replace(/\./g, ''));
    
    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            selected: true
        });
    }
    
    saveCart();
    updateCartBadge();
    renderCart();
    showToast(`${name} ditambahkan ke keranjang!`);
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartBadge();
    renderCart();
}

// Update item quantity
function updateQuantity(name, quantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartBadge();
        renderCart();
    }
}

// Toggle item selection
function toggleItemSelection(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.selected = !item.selected;
        saveCart();
        updateSelectAllCheckbox();
        renderCart();
    }
}

// Toggle select all
function toggleSelectAll(isChecked) {
    cart.forEach(item => {
        item.selected = isChecked;
    });
    saveCart();
    renderCart();
}

// Update select all checkbox based on item selection
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        const allSelected = cart.every(item => item.selected);
        selectAllCheckbox.checked = allSelected;
    }
}

// Calculate total for selected items
function calculateSelectedTotal() {
    return cart.reduce((total, item) => {
        if (item.selected) {
            return total + (item.price * item.quantity);
        }
        return total;
    }, 0);
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Format price to Indonesian currency
function formatPrice(price) {
    return 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const orderBtn = document.getElementById('orderBtn');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const buyerInfoSection = document.getElementById('buyerInfoSection');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang Anda kosong</p>
            </div>
        `;
        cartTotalEl.textContent = 'Rp 0';
        orderBtn.style.display = 'none';
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        if (buyerInfoSection) buyerInfoSection.style.display = 'none';
    } else {
        const selectedTotal = calculateSelectedTotal();
        const selectedItems = cart.filter(item => item.selected);
        
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-left">
                    <div class="cart-item-checkbox">
                        <input type="checkbox" ${item.selected ? 'checked' : ''} onchange="toggleItemSelection('${item.name}')">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                    </div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" onchange="updateQuantity('${item.name}', this.value)" readonly>
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">Hapus</button>
            </div>
        `).join('');
        
        cartTotalEl.textContent = formatPrice(selectedTotal);
        
        // Show buyer info section
        if (buyerInfoSection) buyerInfoSection.style.display = 'block';
        
        if (selectedItems.length > 0) {
            orderBtn.style.display = 'block';
            orderBtn.onclick = function(e) {
                e.preventDefault();
                handleOrderClick();
            };
        } else {
            orderBtn.style.display = 'none';
        }
        
        updateSelectAllCheckbox();
    }
}

// Handle order button click
function handleOrderClick() {
    // Update buyer info from form
    updateBuyerInfoFromForm();
    
    // Validate buyer info
    if (!buyerInfo.name || !buyerInfo.name.trim()) {
        showToast('Mohon masukkan nama pembeli');
        return;
    }
    
    if (!buyerInfo.table || !buyerInfo.table.trim()) {
        showToast('Mohon masukkan nomor meja');
        return;
    }
    
    const selectedItems = cart.filter(item => item.selected);
    const selectedTotal = calculateSelectedTotal();
    
    // Build order message with proper line breaks
    let message = `Nama: ${buyerInfo.name}\n`;
    message += `Meja: ${buyerInfo.table}\n\n`;
    message += `Pesanan:\n`;
    
    selectedItems.forEach(item => {
        message += `• ${item.name} x${item.quantity}\n`;
    });
    
    message += `\nTotal: ${formatPrice(selectedTotal)}`;
    
    const waLink = `https://wa.me/62895355274880?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 2000);
}

// Add click handlers to all add-to-cart buttons
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadBuyerInfo();
    updateCartBadge();
    renderCart();
    
    // Add event listeners for buyer info inputs
    const buyerNameInput = document.getElementById('buyerName');
    const buyerTableInput = document.getElementById('buyerTable');
    
    if (buyerNameInput) {
        buyerNameInput.addEventListener('input', updateBuyerInfoFromForm);
    }
    
    if (buyerTableInput) {
        buyerTableInput.addEventListener('input', updateBuyerInfoFromForm);
    }
    
    // Add event listener for "Select All" checkbox
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            toggleSelectAll(this.checked);
        });
    }
    
    // Add event listeners to add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const menuCard = this.closest('.menu-card');
            const itemName = menuCard.querySelector('.menu-title span:first-child').textContent;
            const itemPrice = menuCard.querySelector('.menu-price').textContent;
            addToCart(itemName, itemPrice);
        });
    });
});