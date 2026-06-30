// ---- State ----
const STORE_KEY = 'shelfwise_inventory_v1';
const LEDGER_KEY = 'shelfwise_ledger_v1';

function loadState(){
  try{
    return JSON.parse(localStorage.getItem(STORE_KEY)) || seedInventory();
  }catch(e){ return seedInventory(); }
}
function loadLedger(){
  try{
    return JSON.parse(localStorage.getItem(LEDGER_KEY)) || seedLedger();
  }catch(e){ return seedLedger(); }
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(items)); }
function saveLedger(){ localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); }

function seedInventory(){
  return [
    { id: cryptoId(), name: 'Packing tape, 48mm', sku: 'PKT-048', qty: 32, reorder: 10, cost: 2.10 },
    { id: cryptoId(), name: 'Shipping boxes, medium', sku: 'BOX-MED', qty: 6, reorder: 15, cost: 1.45 },
    { id: cryptoId(), name: 'Bubble wrap roll', sku: 'BWR-100', qty: 0, reorder: 5, cost: 8.75 },
    { id: cryptoId(), name: 'Thermal labels (roll)', sku: 'LBL-THM', qty: 18, reorder: 8, cost: 3.20 }
  ];
}
function seedLedger(){
  return [
    { id: cryptoId(), date: todayStr(), desc: 'Opening balance', type: 'in', amount: 500 }
  ];
}
function cryptoId(){ return 'id-' + Math.random().toString(36).slice(2,10); }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function fmtMoney(n){ return '$' + Number(n).toFixed(2); }

let items = loadState();
let ledger = loadLedger();

// ---- Status helper ----
function statusOf(item){
  if(item.qty <= 0) return 'out';
  if(item.qty <= item.reorder) return 'low';
  return 'ok';
}
const statusLabel = { ok:'In stock', low:'Low stock', out:'Out of stock' };

// ---- Render: Dashboard ----
function renderDashboard(){
  document.getElementById('stat-items').textContent = items.length;
  document.getElementById('stat-units').textContent = items.reduce((s,i)=>s+Number(i.qty),0);
  const value = items.reduce((s,i)=> s + Number(i.qty)*Number(i.cost), 0);
  document.getElementById('stat-value').textContent = fmtMoney(value);
  const lowItems = items.filter(i => statusOf(i) !== 'ok');
  document.getElementById('stat-low').textContent = lowItems.length;

  const list = document.getElementById('low-stock-list');
  list.innerHTML = '';
  if(lowItems.length === 0){
    list.innerHTML = '<p class="empty-tag">Nothing needs attention right now.</p>';
  } else {
    lowItems.forEach(i => {
      const tag = document.createElement('div');
      tag.className = 'shelf-tag';
      tag.innerHTML = `
        <div class="tag-name">${escapeHtml(i.name)}</div>
        <div class="tag-sku">${escapeHtml(i.sku)}</div>
        <div class="tag-qty">${i.qty} on hand · reorder at ${i.reorder}</div>
      `;
      list.appendChild(tag);
    });
  }
}

// ---- Render: Inventory table ----
function renderInventory(){
  const tbody = document.getElementById('inventory-body');
  const search = document.getElementById('search').value.trim().toLowerCase();
  const filter = document.getElementById('filter-status').value;

  let rows = items.filter(i => {
    const matchesSearch = !search || i.name.toLowerCase().includes(search) || i.sku.toLowerCase().includes(search);
    const matchesFilter = filter === 'all' || statusOf(i) === filter;
    return matchesSearch && matchesFilter;
  });

  tbody.innerHTML = '';
  document.getElementById('inventory-empty').style.display = rows.length ? 'none' : 'block';

  rows.forEach(i => {
    const st = statusOf(i);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(i.name)}</td>
      <td class="mono">${escapeHtml(i.sku)}</td>
      <td class="mono">${i.qty}</td>
      <td class="mono">${i.reorder}</td>
      <td class="mono">${fmtMoney(i.cost)}</td>
      <td class="mono">${fmtMoney(i.qty * i.cost)}</td>
      <td><span class="status-pill status-${st}">${statusLabel[st]}</span></td>
      <td><button class="btn-icon" data-delete-item="${i.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ---- Render: Ledger ----
function renderLedger(){
  const tbody = document.getElementById('ledger-body');
  tbody.innerHTML = '';
  document.getElementById('ledger-empty').style.display = ledger.length ? 'none' : 'block';

  let cashIn = 0, cashOut = 0;
  ledger.forEach(e => {
    if(e.type === 'in') cashIn += Number(e.amount); else cashOut += Number(e.amount);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono">${e.date}</td>
      <td>${escapeHtml(e.desc)}</td>
      <td><span class="status-pill ${e.type === 'in' ? 'status-ok' : 'status-out'}">${e.type === 'in' ? 'Cash in' : 'Cash out'}</span></td>
      <td class="mono">${fmtMoney(e.amount)}</td>
      <td><button class="btn-icon" data-delete-ledger="${e.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('stat-in').textContent = fmtMoney(cashIn);
  document.getElementById('stat-out').textContent = fmtMoney(cashOut);
  document.getElementById('stat-net').textContent = fmtMoney(cashIn - cashOut);
}

function escapeHtml(s){
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function renderAll(){
  renderDashboard();
  renderInventory();
  renderLedger();
}

// ---- Navigation ----
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
    btn.classList.add('is-active');
    document.getElementById('view-' + btn.dataset.view).classList.add('is-active');
  });
});

// ---- Modals ----
const modalAdd = document.getElementById('modal-add');
const modalCash = document.getElementById('modal-cash');

document.querySelectorAll('[data-open-add]').forEach(b => b.addEventListener('click', () => modalAdd.classList.add('is-open')));
document.querySelectorAll('[data-open-cash]').forEach(b => b.addEventListener('click', () => modalCash.classList.add('is-open')));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => {
  modalAdd.classList.remove('is-open');
  modalCash.classList.remove('is-open');
}));
[modalAdd, modalCash].forEach(m => {
  m.addEventListener('click', (e) => { if(e.target === m) m.classList.remove('is-open'); });
});

// ---- Form: Add item ----
document.getElementById('form-add').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('f-name').value.trim();
  const sku = document.getElementById('f-sku').value.trim();
  const qty = Number(document.getElementById('f-qty').value);
  const reorder = Number(document.getElementById('f-reorder').value);
  const cost = Number(document.getElementById('f-cost').value);
  if(!name || !sku) return;

  items.push({ id: cryptoId(), name, sku, qty, reorder, cost });
  saveState();
  renderAll();
  e.target.reset();
  document.getElementById('f-qty').value = 0;
  document.getElementById('f-reorder').value = 5;
  document.getElementById('f-cost').value = 0;
  modalAdd.classList.remove('is-open');
});

// ---- Form: Add cash entry ----
document.getElementById('form-cash').addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = document.getElementById('c-desc').value.trim();
  const type = document.getElementById('c-type').value;
  const amount = Number(document.getElementById('c-amount').value);
  if(!desc || !amount) return;

  ledger.push({ id: cryptoId(), date: todayStr(), desc, type, amount });
  saveLedger();
  renderAll();
  e.target.reset();
  document.getElementById('c-amount').value = 0;
  modalCash.classList.remove('is-open');
});

// ---- Delete handlers (event delegation) ----
document.getElementById('inventory-body').addEventListener('click', (e) => {
  const id = e.target.dataset.deleteItem;
  if(id){
    items = items.filter(i => i.id !== id);
    saveState();
    renderAll();
  }
});
document.getElementById('ledger-body').addEventListener('click', (e) => {
  const id = e.target.dataset.deleteLedger;
  if(id){
    ledger = ledger.filter(l => l.id !== id);
    saveLedger();
    renderAll();
  }
});

// ---- Search / filter ----
document.getElementById('search').addEventListener('input', renderInventory);
document.getElementById('filter-status').addEventListener('change', renderInventory);

// ---- Init ----
renderAll();
