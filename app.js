// ============ STATE ============
let state = {
  currentPage: 'shop',
  currentSellerTab: 'overview',
  currentAdminTab: 'overview',
  currentLoginRole: 'buyer',
  selectedRating: 0,
  cart: [],
  deliveryFee: 50,
  deliveryType: 'Home Delivery',

  products: [
    { id: 1, name: 'Eggplant', category: 'Vegetables', price: 60, stock: 30, seller: 'Maria Santos', sellerId: 1, date: 'Apr 25', emoji: '🍆', rating: 4.5, reviews: 12, status: 'active' },
    { id: 2, name: 'Sweet Mangoes', category: 'Fruits', price: 80, stock: 50, seller: 'Pedro Reyes', sellerId: 2, date: 'Apr 25', emoji: '🥭', rating: 4.8, reviews: 24, status: 'active' },
    { id: 3, name: 'Fresh Bangus', category: 'Seafood', price: 10, stock: 20, seller: 'Lito Cruz', sellerId: 3, date: 'Apr 26', emoji: '🐟', rating: 4.2, reviews: 8, status: 'active' },
    { id: 4, name: 'Tomatoes', category: 'Vegetables', price: 50, stock: 45, seller: 'Ana Gomez', sellerId: 4, date: 'Apr 24', emoji: '🍅', rating: 4.6, reviews: 18, status: 'active' },
    { id: 5, name: 'Fresh Tilapia', category: 'Seafood', price: 120, stock: 0, seller: 'Juan dela Cruz', sellerId: 5, date: 'Apr 27', emoji: '🐠', rating: 4.0, reviews: 6, status: 'soldout' },
    { id: 6, name: 'Local Brown Rice', category: 'Rice', price: 40, stock: 100, seller: 'Juan dela Cruz', sellerId: 5, date: 'Apr 23', emoji: '🌾', rating: 4.7, reviews: 30, status: 'active' },
    { id: 7, name: 'Organic Lettuce', category: 'Vegetables', price: 40, stock: 25, seller: 'Maria Santos', sellerId: 1, date: 'Apr 28', emoji: '🥬', rating: 4.3, reviews: 9, status: 'active' },
    { id: 8, name: 'Free-Range Eggs', category: 'Poultry', price: 90, stock: 60, seller: 'Roberto Lim', sellerId: 6, date: 'Apr 25', emoji: '🥚', rating: 4.9, reviews: 42, status: 'active' },
    { id: 9, name: 'Ampalaya', category: 'Vegetables', price: 35, stock: 40, seller: 'Ana Gomez', sellerId: 4, date: 'Apr 29', emoji: '🥒', rating: 3.9, reviews: 5, status: 'active' },
    { id: 10, name: 'Papaya', category: 'Fruits', price: 45, stock: 0, seller: 'Pedro Reyes', sellerId: 2, date: 'Apr 26', emoji: '🍈', rating: 4.1, reviews: 7, status: 'soldout' },
  ],

  sellers: [
    { id: 1, name: 'Maria Santos', business: "Maria's Veggie Farm", category: 'Vegetables', phone: '09171234567', email: 'maria@email.com', address: 'Brgy. Poblacion', status: 'verified' },
    { id: 2, name: 'Pedro Reyes', business: "Pedro's Orchard", category: 'Fruits', phone: '09271234567', email: 'pedro@email.com', address: 'Brgy. Sabang', status: 'verified' },
    { id: 3, name: 'Lito Cruz', business: "Lito's Fresh Catch", category: 'Seafood', phone: '09371234567', email: 'lito@email.com', address: 'Brgy. Maligaya', status: 'pending' },
    { id: 4, name: 'Ana Gomez', business: "Ana's Garden", category: 'Vegetables', phone: '09471234567', email: 'ana@email.com', address: 'Brgy. Maisak', status: 'verified' },
    { id: 5, name: 'Juan dela Cruz', business: "Juan's Farm", category: 'Rice', phone: '09571234567', email: 'juan@email.com', address: 'Brgy. Sampaloc', status: 'verified' },
    { id: 6, name: 'Roberto Lim', business: "Roberto's Poultry", category: 'Poultry', phone: '09671234567', email: 'roberto@email.com', address: 'Brgy. Rizal', status: 'pending' },
  ],

  orders: [
    { id: 'ORD-001', buyer: 'Carlos Tan', items: 'Fresh Bangus x2kg, Tomatoes x2kg', total: 400, status: 'pending', payment: 'GCash', date: '2024-04-25' },
    { id: 'ORD-002', buyer: 'Linda Lopez', items: 'Sweet Mangoes x3kg', total: 240, status: 'confirmed', payment: 'Cash on Delivery', date: '2024-04-24' },
    { id: 'ORD-003', buyer: 'Mark Ramos', items: 'Local Brown Rice x5kg', total: 200, status: 'delivered', payment: 'PayMaya', date: '2024-04-23' },
  ],

  reviews: [
    { id: 1, product: 'Sweet Mangoes', rating: 5, text: 'Very fresh and sweet! Will definitely order again.', author: 'Linda Lopez', date: '2024-04-25', approved: true },
    { id: 2, product: 'Fresh Bangus', rating: 4, text: 'Good quality fish, packed well for delivery.', author: 'Carlos Tan', date: '2024-04-24', approved: true },
    { id: 3, product: 'Local Brown Rice', rating: 5, text: 'Best rice in Gumaca! Highly recommend.', author: 'Mark Ramos', date: '2024-04-23', approved: true },
  ],

  notifications: [],
  activityLog: [],
  activeCategory: 'All',
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryFilters();
  renderProducts(state.products);
  renderReviews();
  renderSellerDashboard();
  renderAdminDashboard();
  updateCartBadge();
  logActivity('Platform started successfully', 'system');
});

// ============ PAGE NAVIGATION ============
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add('active');
  state.currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'admin') renderAdminDashboard();
  if (page === 'seller') renderSellerDashboard();
}

// ============ CATEGORY FILTERS ============
function renderCategoryFilters() {
  const cats = ['All', 'Vegetables', 'Fruits', 'Seafood', 'Rice', 'Poultry'];
  const list = document.getElementById('categoryList');
  list.innerHTML = cats.map(c => `
    <button class="cat-filter-btn ${c === state.activeCategory ? 'active' : ''}" onclick="filterCategory('${c}')">
      ${getCatEmoji(c)} ${c}
    </button>
  `).join('');
}

function getCatEmoji(c) {
  const map = { All: '✨', Vegetables: '🥦', Fruits: '🍓', Seafood: '🦐', Rice: '🌾', Poultry: '🐔' };
  return map[c] || '🛒';
}

function filterCategory(cat) {
  state.activeCategory = cat;
  renderCategoryFilters();
  applyFilters();
}

// ============ SEARCH & FILTER ============
function handleGlobalSearch(val) {
  applyFilters(val);
}

function applyFilters(searchOverride) {
  const search = (searchOverride !== undefined ? searchOverride : document.getElementById('globalSearch').value).toLowerCase();
  const sort = document.getElementById('sortSelect').value;
  const minP = parseFloat(document.getElementById('priceMin').value) || 0;
  const maxP = parseFloat(document.getElementById('priceMax').value) || Infinity;
  const inStockOnly = document.getElementById('inStockOnly').checked;

  let filtered = state.products.filter(p => {
    const matchCat = state.activeCategory === 'All' || p.category === state.activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.seller.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
    const matchPrice = p.price >= minP && p.price <= maxP;
    const matchStock = !inStockOnly || p.stock > 0;
    return matchCat && matchSearch && matchPrice && matchStock;
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);

  renderProducts(filtered);
  document.getElementById('resultCount').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
}

// ============ RENDER PRODUCTS ============
function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  if (!products.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">No products found. Try adjusting your filters.</div>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      ${p.status === 'soldout' ? '<div class="out-of-stock-badge">Sold Out</div>' : '<div class="product-badge">' + p.category + '</div>'}
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="product-price">₱${p.price}/kg</div>
        <div class="product-seller">by ${p.seller}</div>
        <div class="product-date">📅 Available: ${p.date}</div>
        <div class="product-rating">${renderStars(p.rating)} (${p.reviews})</div>
        <button class="btn-add-cart" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  `).join('');
  document.getElementById('resultCount').textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ============ CART ============
function addToCart(id) {
  const product = state.products.find(p => p.id === id);
  if (!product || product.stock === 0) return;
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  updateCartBadge();
  showToast(`✅ ${product.name} added to cart!`);
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  renderCartItems();
  updateCartBadge();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { renderCartItems(); updateCartBadge(); }
}

function updateCartBadge() {
  const total = state.cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  if (!state.cart.length) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">Your cart is empty</p>';
    document.getElementById('cartTotal').textContent = '₱0';
    return;
  }
  let subtotal = 0;
  list.innerHTML = state.cart.map(item => {
    const line = item.price * item.qty;
    subtotal += line;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₱${item.price}/kg</p>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
        <div class="cart-item-price">₱${line}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `;
  }).join('');
  document.getElementById('cartTotal').textContent = `₱${subtotal}`;
}

// ============ CHECKOUT ============
function openCheckout() {
  if (!state.cart.length) { showToast('Your cart is empty!', true); return; }
  closeCart();
  renderCheckoutSummary();
  openModal('checkoutModal');
  document.querySelectorAll('input[name="payment"]').forEach(r => {
    r.addEventListener('change', () => {
      document.getElementById('gcashFields').classList.add('hidden');
      document.getElementById('cardFields').classList.add('hidden');
      if (r.value === 'GCash') document.getElementById('gcashFields').classList.remove('hidden');
      if (r.value === 'Credit Card') document.getElementById('cardFields').classList.remove('hidden');
    });
  });
}

function renderCheckoutSummary() {
  const summary = document.getElementById('checkoutSummary');
  let subtotal = 0;
  summary.innerHTML = state.cart.map(item => {
    const line = item.price * item.qty;
    subtotal += line;
    return `<div class="checkout-row"><span>${item.emoji} ${item.name} x${item.qty}kg</span><span>₱${line}</span></div>`;
  }).join('');
  updateCheckoutTotal(subtotal);
}

function updateCheckoutTotal(subtotal) {
  const fee = state.deliveryType === 'Home Delivery' ? 50 : 0;
  const total = subtotal + fee;
  document.getElementById('checkoutTotal').innerHTML = `
    <span>Delivery</span><span>₱${fee}</span>
    </div><div class="checkout-total">
    <span>Total</span><span>₱${total}</span>
  `;
}

function updateDelivery(val) {
  state.deliveryType = val;
  state.deliveryFee = val === 'Home Delivery' ? 50 : 0;
  let subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  updateCheckoutTotal(subtotal);
}

function placeOrder() {
  const name = document.getElementById('buyerName').value.trim();
  const phone = document.getElementById('buyerPhone').value.trim();
  const email = document.getElementById('buyerEmail').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  const delivery = document.querySelector('input[name="delivery"]:checked')?.value;

  if (!name || !phone) { showToast('Please fill in your contact details.', true); return; }

  const orderId = 'ORD-' + String(state.orders.length + 1).padStart(3, '0');
  const items = state.cart.map(i => `${i.name} x${i.qty}kg`).join(', ');
  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = state.deliveryType === 'Home Delivery' ? 50 : 0;
  const total = subtotal + fee;

  const order = { id: orderId, buyer: name, items, total, status: 'pending', payment, date: new Date().toISOString().split('T')[0] };
  state.orders.unshift(order);

  // Auto notification
  simulateNotification(email, phone, `Order ${orderId} placed`, `Your order of ${items} (₱${total}) via ${payment} has been placed. Delivery: ${delivery}.`);

  logActivity(`New order ${orderId} placed by ${name} — ₱${total}`, 'order');

  state.cart = [];
  updateCartBadge();
  closeModal('checkoutModal');

  document.getElementById('successMsg').innerHTML = `
    <strong>${orderId}</strong> — ${items}<br/>
    Total: ₱${total} • ${payment}<br/>
    Delivery: ${delivery}<br/><br/>
    A confirmation has been sent to ${email || phone}.
  `;
  openModal('successModal');
  renderAdminDashboard();
}

// ============ SELLER DASHBOARD ============
function showSellerTab(tab) {
  document.querySelectorAll('.seller-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dash-nav-btn').forEach(b => b.classList.remove('active'));
  const tabEl = document.getElementById(`seller-${tab}`);
  if (tabEl) tabEl.classList.add('active');
  const btns = document.querySelectorAll('#page-seller .dash-nav-btn');
  const tabIdx = ['overview','products','orders','earnings','register'].indexOf(tab);
  if (btns[tabIdx]) btns[tabIdx].classList.add('active');
  state.currentSellerTab = tab;
  if (tab === 'products') renderSellerProducts();
  if (tab === 'orders') renderSellerOrders();
  if (tab === 'earnings') renderEarnings();
  if (tab === 'overview') renderOverviewActivity();
}

function renderSellerDashboard() {
  document.getElementById('statActive').textContent = state.products.filter(p => p.sellerId === 5 && p.stock > 0).length;
  document.getElementById('statPending').textContent = state.orders.filter(o => o.status === 'pending').length;
  renderOverviewActivity();
}

function renderOverviewActivity() {
  const log = document.getElementById('recentActivity');
  const recent = [...state.activityLog].reverse().slice(0, 6);
  log.innerHTML = recent.length ? recent.map(a => `
    <div class="activity-item">
      <span>${a.msg}</span>
      <span class="activity-time">${a.time}</span>
    </div>`).join('') : '<p style="color:var(--text-muted);font-size:0.85rem">No recent activity.</p>';
}

function renderSellerProducts() {
  const myProds = state.products.filter(p => p.sellerId === 5);
  const list = document.getElementById('sellerProductList');
  list.innerHTML = myProds.map(p => `
    <div class="seller-product-item">
      <div class="seller-prod-img">${p.emoji}</div>
      <div class="seller-prod-info">
        <h4>${p.name}</h4>
        <p>₱${p.price}/kg · Stock: ${p.stock}kg · ${p.category}</p>
      </div>
      <span class="${p.stock > 0 ? 'badge-in' : 'badge-out'}">${p.stock > 0 ? 'In Stock' : 'Sold Out'}</span>
      <div class="seller-prod-actions">
        <button class="btn-sm" onclick="editProduct(${p.id})">✏️ Edit</button>
        <button class="btn-danger" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No products listed yet.</p>';
}

function addProduct() {
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const stock = parseInt(document.getElementById('prodStock').value);
  const desc = document.getElementById('prodDesc').value.trim();
  const date = document.getElementById('prodDate').value;
  const emoji = document.getElementById('prodEmoji').value.trim() || '📦';

  if (!name || !price || !stock) { showToast('Please fill in all required fields.', true); return; }

  const newProd = {
    id: state.products.length + 1,
    name, category, price, stock,
    seller: 'Juan dela Cruz', sellerId: 5,
    date: date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD',
    emoji: emoji.startsWith('http') ? '📦' : emoji,
    rating: 0, reviews: 0, status: stock > 0 ? 'active' : 'soldout',
    desc
  };

  state.products.unshift(newProd);
  closeModal('addProductModal');
  clearForm(['prodName','prodPrice','prodStock','prodDesc','prodDate','prodEmoji']);
  applyFilters();
  renderSellerProducts();
  logActivity(`New product "${name}" added`, 'product');
  showToast(`✅ "${name}" added successfully!`);
}

function editProduct(id) {
  const p = state.products.find(pr => pr.id === id);
  if (!p) return;
  const newStock = prompt(`Update stock for ${p.name} (current: ${p.stock}kg):`, p.stock);
  if (newStock !== null && !isNaN(newStock)) {
    p.stock = parseInt(newStock);
    p.status = p.stock > 0 ? 'active' : 'soldout';
    renderSellerProducts();
    applyFilters();
    showToast(`✅ Stock updated for ${p.name}`);
    logActivity(`Stock updated: ${p.name} → ${p.stock}kg`, 'product');
  }
}

function deleteProduct(id) {
  const p = state.products.find(pr => pr.id === id);
  if (!p) return;
  if (confirm(`Delete "${p.name}"? This action cannot be undone.`)) {
    state.products = state.products.filter(pr => pr.id !== id);
    renderSellerProducts();
    applyFilters();
    showToast(`🗑️ "${p.name}" deleted`);
    logActivity(`Product deleted: ${p.name}`, 'product');
  }
}

function renderSellerOrders() {
  const list = document.getElementById('sellerOrderList');
  list.innerHTML = state.orders.map(o => `
    <div class="order-item">
      <div class="order-item-header">
        <h4>📋 ${o.id} — ${o.buyer}</h4>
        <span class="order-status ${getStatusClass(o.status)}">${o.status}</span>
      </div>
      <p style="font-size:0.85rem;color:var(--text-muted)">${o.items}</p>
      <div style="display:flex;justify-content:space-between;margin-top:0.6rem;align-items:center">
        <strong>₱${o.total}</strong>
        <div style="display:flex;gap:0.5rem">
          <button class="btn-sm" onclick="updateOrderStatus(${JSON.stringify(o.id).replace(/"/g,"'")},'confirmed')">✅ Confirm</button>
          <button class="btn-sm" onclick="updateOrderStatus(${JSON.stringify(o.id).replace(/"/g,"'")},'delivered')">🚚 Deliver</button>
        </div>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No orders yet.</p>';
}

function updateOrderStatus(id, status) {
  const order = state.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    renderSellerOrders();
    renderAdminDashboard();
    showToast(`Order ${id} marked as ${status}`);
    logActivity(`Order ${id} status → ${status}`, 'order');
  }
}

function getStatusClass(s) {
  if (s === 'pending') return 'status-pending';
  if (s === 'confirmed') return 'status-confirmed';
  if (s === 'delivered') return 'status-delivered';
  return '';
}

function renderEarnings() {
  const breakdown = document.getElementById('earningsBreakdown');
  const delivered = state.orders.filter(o => o.status === 'delivered');
  const total = delivered.reduce((s, o) => s + o.total, 0);
  breakdown.innerHTML = `
    <div class="earning-row"><span class="earning-label">Delivered Orders</span><span class="earning-amount">${delivered.length} orders</span></div>
    <div class="earning-row"><span class="earning-label">Total Revenue</span><span class="earning-amount">₱${total.toLocaleString()}</span></div>
    <div class="earning-row"><span class="earning-label">Platform Fee (5%)</span><span class="earning-amount" style="color:var(--accent-dark)">-₱${(total * 0.05).toFixed(0)}</span></div>
    <div class="earning-row" style="background:var(--green-pale);border-color:var(--green-main)"><span class="earning-label" style="font-weight:700;color:var(--green-dark)">Net Earnings</span><span class="earning-amount" style="font-size:1.2rem">₱${(total * 0.95).toFixed(0)}</span></div>
    ${state.orders.map(o => `
      <div class="earning-row">
        <span class="earning-label">${o.id} — ${o.buyer}</span>
        <span class="earning-amount ${o.status !== 'delivered' ? 'style="color:var(--text-muted)"' : ''}">₱${o.total} <small>(${o.status})</small></span>
      </div>
    `).join('')}
  `;
}

// ============ SELLER REGISTRATION ============
function registerSeller() {
  const name = document.getElementById('regName').value.trim();
  const business = document.getElementById('regBusiness').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const category = document.getElementById('regCategory').value;

  if (!name || !business || !email || !phone) {
    showToast('Please complete all required fields.', true); return;
  }
  if (!/^09\d{9}$/.test(phone)) {
    showToast('Enter a valid PH mobile number (09XXXXXXXXX)', true); return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showToast('Enter a valid email address.', true); return;
  }

  const newSeller = {
    id: state.sellers.length + 1,
    name, business, category, phone, email, address, status: 'pending'
  };
  state.sellers.push(newSeller);

  simulateNotification(email, phone, 'Registration Received', `Hello ${name}, your seller registration for "${business}" is under review. We will notify you once approved.`);
  logActivity(`New seller registration: ${name} (${business})`, 'seller');
  showToast(`✅ Registration submitted! Check your email/SMS for confirmation.`);
  clearForm(['regName','regBusiness','regEmail','regPhone','regAddress']);
  renderAdminDashboard();
}

// ============ REVIEWS ============
function setRating(n) {
  state.selectedRating = n;
  const stars = document.querySelectorAll('#starPicker span');
  stars.forEach((s, i) => s.classList.toggle('active', i < n));
  stars.forEach((s, i) => s.style.color = i < n ? 'var(--gold)' : '#ccc');
}

function submitReview() {
  const product = document.getElementById('reviewProduct').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  const author = document.getElementById('reviewerName').value.trim();
  if (!product || !text || !author || state.selectedRating === 0) {
    showToast('Please fill in all review fields and select a rating.', true); return;
  }
  state.reviews.unshift({
    id: state.reviews.length + 1,
    product, rating: state.selectedRating, text,
    author, date: new Date().toISOString().split('T')[0], approved: true
  });
  clearForm(['reviewProduct','reviewText','reviewerName']);
  setRating(0);
  renderReviews();
  showToast('⭐ Review submitted! Thank you!');
  logActivity(`New review for "${product}" by ${author}`, 'review');
}

function renderReviews() {
  const list = document.getElementById('reviewsList');
  const approved = state.reviews.filter(r => r.approved);
  list.innerHTML = approved.map(r => `
    <div class="review-card">
      <div class="review-product">${r.product}</div>
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-author">— ${r.author} · ${r.date}</div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No reviews yet.</p>';
}

// ============ ADMIN DASHBOARD ============
function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#page-admin .dash-nav-btn').forEach(b => b.classList.remove('active'));
  const tabEl = document.getElementById(`admin-${tab}`);
  if (tabEl) tabEl.classList.add('active');
  const tabIdx = ['overview','sellers','products','orders','notifications','reviews'].indexOf(tab);
  const btns = document.querySelectorAll('#page-admin .dash-nav-btn');
  if (btns[tabIdx]) btns[tabIdx].classList.add('active');
  state.currentAdminTab = tab;
}

function renderAdminDashboard() {
  document.getElementById('adminTotalSellers').textContent = state.sellers.length;
  document.getElementById('adminTotalProducts').textContent = state.products.length;
  document.getElementById('adminTotalOrders').textContent = state.orders.length;
  const rev = state.orders.reduce((s, o) => s + o.total, 0);
  document.getElementById('adminRevenue').textContent = `₱${rev.toLocaleString()}`;

  // Activity log
  const log = document.getElementById('adminActivityLog');
  const recent = [...state.activityLog].reverse().slice(0, 10);
  log.innerHTML = recent.map(a => `
    <div class="activity-item">
      <span>${getActivityIcon(a.type)} ${a.msg}</span>
      <span class="activity-time">${a.time}</span>
    </div>`).join('') || '<p style="color:var(--text-muted)">No activity yet.</p>';

  // Sellers table
  const sellersTable = document.getElementById('adminSellersTable');
  sellersTable.innerHTML = state.sellers.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.business}</td>
      <td>${s.category}</td>
      <td><span class="${s.status === 'verified' ? 'badge-in' : 'badge-out'}">${s.status}</span></td>
      <td>
        ${s.status === 'pending' ? `<button class="btn-sm" onclick="approveSeller(${s.id})">✅ Approve</button>` : ''}
        <button class="btn-danger" onclick="removeSeller(${s.id})">Remove</button>
      </td>
    </tr>
  `).join('');

  // Products table
  const prodTable = document.getElementById('adminProductsTable');
  prodTable.innerHTML = state.products.map(p => `
    <tr>
      <td>${p.emoji} ${p.name}</td>
      <td>${p.seller}</td>
      <td>₱${p.price}/kg</td>
      <td>${p.category}</td>
      <td><span class="${p.stock > 0 ? 'badge-in' : 'badge-out'}">${p.stock > 0 ? 'In Stock' : 'Sold Out'}</span></td>
      <td><button class="btn-danger" onclick="adminRemoveProduct(${p.id})">Remove</button></td>
    </tr>
  `).join('');

  // Orders table
  const ordersTable = document.getElementById('adminOrdersTable');
  ordersTable.innerHTML = state.orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.buyer}</td>
      <td style="font-size:0.8rem">${o.items}</td>
      <td>₱${o.total}</td>
      <td><span class="order-status ${getStatusClass(o.status)}">${o.status}</span></td>
      <td>${o.payment}</td>
    </tr>
  `).join('');

  // Admin Reviews
  const adminRevList = document.getElementById('adminReviewsList');
  adminRevList.innerHTML = state.reviews.map(r => `
    <div class="review-card">
      <div class="review-product">${r.product} <span class="badge-${r.approved ? 'in' : 'out'}">${r.approved ? 'Approved' : 'Pending'}</span></div>
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-author">— ${r.author} · ${r.date}</div>
      <div style="margin-top:0.6rem;display:flex;gap:0.5rem">
        ${!r.approved ? `<button class="btn-sm" onclick="approveReview(${r.id})">✅ Approve</button>` : ''}
        <button class="btn-danger" onclick="removeReview(${r.id})">🗑️ Remove</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted)">No reviews.</p>';

  // Notif log
  const notifLog = document.getElementById('notifLog');
  notifLog.innerHTML = [...state.notifications].reverse().map(n => `
    <div class="notif-item">
      <div class="notif-subject">${n.subject}</div>
      <div class="notif-meta">${n.channel} → ${n.target} · ${n.time}</div>
    </div>
  `).join('') || '<p style="color:var(--text-muted);font-size:0.85rem">No notifications sent yet.</p>';
}

function approveSeller(id) {
  const s = state.sellers.find(sel => sel.id === id);
  if (s) {
    s.status = 'verified';
    simulateNotification(s.email, s.phone, 'Registration Approved!', `Congratulations ${s.name}! Your seller account for "${s.business}" has been approved. You can now list products.`);
    renderAdminDashboard();
    showToast(`✅ ${s.name} approved as seller`);
    logActivity(`Seller approved: ${s.name}`, 'seller');
  }
}

function removeSeller(id) {
  if (confirm('Remove this seller from the platform?')) {
    const s = state.sellers.find(sel => sel.id === id);
    state.sellers = state.sellers.filter(sel => sel.id !== id);
    renderAdminDashboard();
    showToast(`Seller removed`);
    if (s) logActivity(`Seller removed: ${s.name}`, 'seller');
  }
}

function adminRemoveProduct(id) {
  if (confirm('Remove this product?')) {
    const p = state.products.find(pr => pr.id === id);
    state.products = state.products.filter(pr => pr.id !== id);
    applyFilters();
    renderAdminDashboard();
    showToast('Product removed');
    if (p) logActivity(`Product removed by admin: ${p.name}`, 'product');
  }
}

function approveReview(id) {
  const r = state.reviews.find(rev => rev.id === id);
  if (r) { r.approved = true; renderAdminDashboard(); renderReviews(); showToast('Review approved'); }
}

function removeReview(id) {
  state.reviews = state.reviews.filter(r => r.id !== id);
  renderAdminDashboard(); renderReviews();
  showToast('Review removed');
}

// ============ NOTIFICATIONS ============
function sendNotification() {
  const target = document.getElementById('notifTarget').value;
  const sms = document.getElementById('notifSMS').checked;
  const email = document.getElementById('notifEmail').checked;
  const subject = document.getElementById('notifSubject').value.trim();
  const msg = document.getElementById('notifMessage').value.trim();

  if (!subject || !msg) { showToast('Please fill in subject and message.', true); return; }
  if (!sms && !email) { showToast('Select at least one channel.', true); return; }

  const channels = [sms ? 'SMS' : '', email ? 'Email' : ''].filter(Boolean).join(' + ');
  const notif = {
    target, channel: channels, subject, msg,
    time: new Date().toLocaleString()
  };
  state.notifications.push(notif);
  logActivity(`Notification sent to ${target}: "${subject}"`, 'notif');
  clearForm(['notifSubject','notifMessage']);
  renderAdminDashboard();
  showToast(`📨 Notification sent via ${channels} to ${target}!`);
}

function simulateNotification(email, phone, subject, msg) {
  const channels = [];
  if (email) channels.push('Email');
  if (phone) channels.push('SMS');
  if (!channels.length) return;
  state.notifications.push({
    target: email || phone,
    channel: channels.join(' + '),
    subject, msg,
    time: new Date().toLocaleString()
  });
}

// ============ LOGIN ============
function switchLoginTab(role) {
  state.currentLoginRole = role;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', ['buyer','seller','admin'][i] === role);
  });
}

function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if (!email || !pass) { showToast('Enter email and password.', true); return; }
  closeModal('loginModal');
  showToast(`✅ Logged in as ${state.currentLoginRole}`);
  logActivity(`User login: ${email} (${state.currentLoginRole})`, 'system');
  if (state.currentLoginRole === 'seller') showPage('seller');
  if (state.currentLoginRole === 'admin') showPage('admin');
}

// ============ MODALS ============
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

// ============ UTILITIES ============
function logActivity(msg, type = 'info') {
  state.activityLog.push({ msg, type, time: new Date().toLocaleTimeString() });
  if (state.activityLog.length > 50) state.activityLog.shift();
}

function getActivityIcon(type) {
  const icons = { order: '📋', product: '📦', seller: '👤', review: '⭐', notif: '📨', system: '⚙️', info: 'ℹ️' };
  return icons[type] || '•';
}

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.className = 'toast'; }, 3200);
}

function clearForm(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
