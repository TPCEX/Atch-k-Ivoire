
// ─── DATA PRODUITS ───
const produits = [
  {
    id:1, nom:"Attiék Garba Premium", cat:"garba", emoji:"🍚",
    desc:"Finement granulé, idéal avec thon grillé et alloco. Texture légère et savoureuse.",
    prix:1500, unite:"kg", note:4.9, colorA:"#C4622D", colorB:"#E8845A",
    promo:"−10%", stock:true, format:"1 kg"
  },
  {
    id:2, nom:"Attiék Nature Doux", cat:"nature", emoji:"🍛",
    desc:"Saveur pure et délicate, préparé chaque matin selon la tradition. Sans épices.",
    prix:1200, unite:"kg", note:4.7, colorA:"#D4A96A", colorB:"#EDD9AA",
    promo:null, stock:true, format:"500g / 1 kg"
  },
  {
    id:3, nom:"Attiék Fumé Spécial", cat:"fume", emoji:"🔥",
    desc:"Légèrement fumé au bois de palme. Un goût unique qui rappelle les maquis d'Abidjan.",
    prix:2000, unite:"kg", note:4.8, colorA:"#3D2B1F", colorB:"#8B3A14",
    promo:"Nouveau", stock:true, format:"1 kg / 2 kg"
  },
  {
    id:4, nom:"Attiék Pimenté Hot", cat:"piment", emoji:"🌶️",
    desc:"Pour les amateurs de sensations fortes — piment rouge et épices sélectionnées.",
    prix:1800, unite:"kg", note:4.6, colorA:"#8B1A1A", colorB:"#C4622D",
    promo:null, stock:true, format:"500g / 1 kg"
  },
  {
    id:5, nom:"Pack Famille 5 kg", cat:"nature", emoji:"🎁",
    desc:"Le pack économique pour toute la famille. Attiéké nature, livraison offerte.",
    prix:5500, unite:"5 kg", note:4.9, colorA:"#2D5A27", colorB:"#4A8C3F",
    promo:"−15%", stock:true, format:"5 kg"
  },
  {
    id:6, nom:"Attiék Garba Maison", cat:"garba", emoji:"🏠",
    desc:"Recette maison revisitée — plus doux, moins acide, parfait pour les enfants.",
    prix:1400, unite:"kg", note:4.7, colorA:"#B8860B", colorB:"#DAA520",
    promo:null, stock:true, format:"1 kg"
  },
  {
    id:7, nom:"Attiék Bio Premium", cat:"nature", emoji:"🌱",
    desc:"Manioc cultivé sans pesticides, fermentation naturelle longue durée. Le summum du goût.",
    prix:2500, unite:"kg", note:5.0, colorA:"#1B4332", colorB:"#2D6A4F",
    promo:"Bio", stock:false, format:"1 kg"
  },
  {
    id:8, nom:"Attiék Noix de Coco", cat:"special", emoji:"🥥",
    desc:"Une fusion inattendue — attiéké doux infusé à la noix de coco fraîche. Douceur garantie.",
    prix:2200, unite:"kg", note:4.8, colorA:"#5C4033", colorB:"#8B6355",
    promo:"Exclusif", stock:true, format:"500g"
  }
];

let cartCount = 0;
let currentQty = 1;
let currentProduit = null;
let currentFilter = 'all';
let filteredProduits = [...produits];

// ─── NAVIGATION ───
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active-nav'));
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active-nav');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'catalogue') renderProduits();
}

// ─── RENDER PRODUITS ───
function renderProduits(list = filteredProduits) {
  const grid = document.getElementById('produits-grid');
  document.getElementById('produit-count').textContent = list.length;
  grid.innerHTML = list.map(p => `
    <div class="produit-card" style="animation: fadeIn 0.4s ease both;" onclick="openModal(${p.id})">
      <div class="produit-img" style="--color-a:${p.colorA};--color-b:${p.colorB};">
        <div class="produit-img-bg"></div>
        <span class="produit-img-emoji">${p.emoji}</span>
        ${p.promo ? `<span class="produit-promo">${p.promo}</span>` : ''}
        <button class="produit-fav" onclick="favClick(event,${p.id})" id="fav-${p.id}" title="Favori">🤍</button>
      </div>
      <div class="produit-body">
        <div class="produit-categorie">${catLabel(p.cat)}</div>
        <div class="produit-nom">${p.nom}</div>
        <div class="produit-desc">${p.desc}</div>
        <div class="produit-stock">${p.stock ? 'En stock' : 'Rupture de stock'}</div>
        <div class="produit-footer">
          <div>
            <div class="produit-prix">${p.prix.toLocaleString('fr-FR')} <small>FCFA / ${p.unite}</small></div>
            <div class="produit-note"><span>★</span> ${p.note}</div>
          </div>
        </div>
        <button class="btn-panier" id="btn-${p.id}"
          onclick="quickAdd(event,${p.id})"
          ${!p.stock ? 'disabled style="opacity:.4;cursor:not-allowed;"' : ''}>
          🛒 Ajouter au panier
        </button>
      </div>
    </div>
  `).join('');
}

function catLabel(cat) {
  const labels = { nature:'Attiéké Nature', garba:'Attiéké Garba', fume:'Attiéké Fumé', piment:'Attiéké Pimenté', special:'Édition Spéciale' };
  return labels[cat] || cat;
}

// ─── FILTRES ───
function filterBy(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filtre-chips .chip').forEach(c => {
    if (c.closest('.filtre-section:first-of-type')) c.classList.remove('active');
  });
  btn.classList.add('active');
  applyFilters();
}

function toggleChip(btn) {
  btn.classList.toggle('active');
}

function clearFiltres() {
  currentFilter = 'all';
  document.getElementById('search-input').value = '';
  filteredProduits = [...produits];
  renderProduits();
}

function filterSearch(val) {
  const q = val.toLowerCase();
  filteredProduits = produits.filter(p =>
    (currentFilter === 'all' || p.cat === currentFilter) &&
    (p.nom.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  );
  renderProduits();
}

function applyFilters() {
  const q = document.getElementById('search-input').value.toLowerCase();
  filteredProduits = produits.filter(p =>
    (currentFilter === 'all' || p.cat === currentFilter) &&
    (p.nom.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  );
  renderProduits();
}

function sortProducts(val) {
  const list = [...filteredProduits];
  if (val === 'prix-asc') list.sort((a,b) => a.prix - b.prix);
  else if (val === 'prix-desc') list.sort((a,b) => b.prix - a.prix);
  else if (val === 'nom') list.sort((a,b) => a.nom.localeCompare(b.nom));
  renderProduits(list);
}

function updatePrice(input) {
  const v = parseInt(input.value);
  document.getElementById('price-val').textContent = v.toLocaleString('fr-FR') + ' F';
}

// ─── MODAL ───
function openModal(id) {
  const p = produits.find(x => x.id === id);
  if (!p) return;
  currentProduit = p;
  currentQty = 1;
  document.getElementById('qty-display').textContent = 1;
  document.getElementById('modal-emoji').textContent = p.emoji;
  document.getElementById('modal-img').style.setProperty('--color-a', p.colorA);
  document.getElementById('modal-img').style.setProperty('--color-b', p.colorB);
  document.getElementById('modal-tag').textContent = catLabel(p.cat);
  document.getElementById('modal-title').textContent = p.nom;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-prix').innerHTML = `${p.prix.toLocaleString('fr-FR')} <small>FCFA / ${p.unite}</small>`;
  document.getElementById('modal-note').textContent = p.note + '/5';
  document.getElementById('modal-format').textContent = p.format;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('qty-display').textContent = currentQty;
}

function addToCartModal() {
  closeModalBtn();
  cartCount += currentQty;
  document.getElementById('cart-count').textContent = cartCount;
  showToast(`${currentQty}× ${currentProduit.nom} ajouté${currentQty > 1 ? 's' : ''} au panier !`);
}

// ─── QUICK ADD ───
function quickAdd(e, id) {
  e.stopPropagation();
  const p = produits.find(x => x.id === id);
  const btn = document.getElementById('btn-' + id);
  btn.classList.add('added');
  btn.textContent = '✓ Ajouté !';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = '🛒 Ajouter au panier';
  }, 1800);
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  showToast(`${p.nom} ajouté au panier !`);
}

function addToCart() {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  showToast('Attiéké Garba Premium ajouté au panier !');
}

// ─── FAV ───
function favClick(e, id) {
  e.stopPropagation();
  const btn = document.getElementById('fav-' + id);
  btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
}

// ─── TOAST ───
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── INIT ───
renderProduits();
