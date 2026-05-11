const CONTRACT_ABI = [
  {
    "name": "registerActor",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "_wallet", "type": "address" },
      { "name": "_name",   "type": "string"  },
      { "name": "_role",   "type": "uint8"   }
    ],
    "outputs": []
  },
  {
    "name": "addMedicine",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "_id",          "type": "uint256" },
      { "name": "_name",        "type": "string"  },
      { "name": "_batchNumber", "type": "string"  },
      { "name": "_expiryDate",  "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "name": "transferItem",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "_id",       "type": "uint256" },
      { "name": "_newOwner", "type": "address" }
    ],
    "outputs": []
  },
  {
    "name": "getMedicine",
    "type": "function",
    "stateMutability": "view",
    "inputs":  [{ "name": "_id", "type": "uint256" }],
    "outputs": [
      { "name": "id",             "type": "uint256" },
      { "name": "name",           "type": "string"  },
      { "name": "batchNumber",    "type": "string"  },
      { "name": "productionDate", "type": "uint256" },
      { "name": "expiryDate",     "type": "uint256" },
      { "name": "currentOwner",   "type": "address" },
      { "name": "status",         "type": "uint8"   }
    ]
  },
  {
    "name": "getMedicineHistory",
    "type": "function",
    "stateMutability": "view",
    "inputs":  [{ "name": "_id", "type": "uint256" }],
    "outputs": [
      { "name": "wallets", "type": "address[]" },
      { "name": "notes",   "type": "string[]"  }
    ]
  },
  {
    "name": "verifyMedicine",
    "type": "function",
    "stateMutability": "view",
    "inputs":  [{ "name": "_id", "type": "uint256" }],
    "outputs": [
      { "name": "isValid",  "type": "bool"   },
      { "name": "message",  "type": "string" }
    ]
  },
  {
    "name": "getAllMedicineIds",
    "type": "function",
    "stateMutability": "view",
    "inputs":  [],
    "outputs": [{ "name": "", "type": "uint256[]" }]
  },
  {
    "name": "actors",
    "type": "function",
    "stateMutability": "view",
    "inputs":  [{ "name": "", "type": "address" }],
    "outputs": [
      { "name": "wallet",       "type": "address" },
      { "name": "name",         "type": "string"  },
      { "name": "role",         "type": "uint8"   },
      { "name": "isRegistered", "type": "bool"    }
    ]
  },
  {
    "name": "owner",
    "type": "function",
    "stateMutability": "view",
    "inputs":  [],
    "outputs": [{ "name": "", "type": "address" }]
  },
  {
    "name": "ActorRegistered",
    "type": "event",
    "inputs": [
      { "name": "wallet", "type": "address", "indexed": true  },
      { "name": "name",   "type": "string",  "indexed": false },
      { "name": "role",   "type": "uint8",   "indexed": false }
    ]
  },
  {
    "name": "MedicineAdded",
    "type": "event",
    "inputs": [
      { "name": "id",           "type": "uint256", "indexed": true  },
      { "name": "name",         "type": "string",  "indexed": false },
      { "name": "batchNumber",  "type": "string",  "indexed": false },
      { "name": "manufacturer", "type": "address", "indexed": false }
    ]
  },
  {
    "name": "ItemTransferred",
    "type": "event",
    "inputs": [
      { "name": "id",        "type": "uint256", "indexed": true  },
      { "name": "from",      "type": "address", "indexed": true  },
      { "name": "to",        "type": "address", "indexed": true  },
      { "name": "newStatus", "type": "uint8",   "indexed": false }
    ]
  },
  {
    "name": "ItemDelivered",
    "type": "event",
    "inputs": [
      { "name": "id",      "type": "uint256", "indexed": true },
      { "name": "pharmacy","type": "address", "indexed": true }
    ]
  }
];

const STATUS_LABEL  = { 0: 'Produced', 1: 'In Transit', 2: 'Delivered' };
const STATUS_BADGE  = { 0: 'manufactured', 1: 'distributed', 2: 'pharmacy' };
const ROLE_NUM      = { manufacturer: 1, distributor: 2, pharmacy: 3 };
const ROLE_LABEL    = { 0: 'None', 1: 'Manufacturer', 2: 'Distributor', 3: 'Pharmacy' };

const USERS = {
  manufacturer: { password: 'mfg123',   role: 'manufacturer', displayName: 'MedLab Pharma Co.',    avatar: 'M' },
  distributor:  { password: 'dist123',  role: 'distributor',  displayName: 'FastMed Distribution', avatar: 'D' },
  pharmacy:     { password: 'pharm123', role: 'pharmacy',     displayName: 'City Care Pharmacy',    avatar: 'P' },
  viewer:       { password: 'view123',  role: 'viewer',       displayName: 'Public Verifier',       avatar: 'V' },
};

const NAV_CONFIG = {
  manufacturer: [
    { id: 'dashboard',  label: 'Dashboard',        icon: '⊞' },
    { id: 'addProduct', label: 'Add Medicine',      icon: '⊕' },
    { id: 'transfer',   label: 'Transfer to Dist.', icon: '↗' },
    { id: 'verify',     label: 'Verify / History',  icon: '⬡' },
    { id: 'register',   label: 'Register Actor',    icon: '👤' },
    { id: 'settings',   label: 'Contract Settings', icon: '⚙' },
  ],
  distributor: [
    { id: 'dashboard',  label: 'Dashboard',            icon: '⊞' },
    { id: 'myProducts', label: 'My Medicines',          icon: '📦' },
    { id: 'transfer',   label: 'Transfer to Pharmacy',  icon: '↗' },
    { id: 'verify',     label: 'Verify / History',      icon: '⬡' },
    { id: 'settings',   label: 'Contract Settings',     icon: '⚙' },
  ],
  pharmacy: [
    { id: 'dashboard',  label: 'Dashboard',          icon: '⊞' },
    { id: 'myProducts', label: 'Received Medicines',  icon: '📦' },
    { id: 'verify',     label: 'Verify / History',    icon: '⬡' },
    { id: 'settings',   label: 'Contract Settings',   icon: '⚙' },
  ],
  viewer: [
    { id: 'verify',     label: 'Verify Product',   icon: '⬡' },
    { id: 'dashboard',  label: 'Dashboard',         icon: '⊞' },
  ],
};

const MY_CONTRACT_ADDRESS = "0x_DAN_DIA_CHI_CUA_BAN_VAO_DAY"; 

let mockDrugs = {}; 

let currentUser   = null;
let walletAddress = null;
let provider      = null;
let signer        = null;
let contract      = null;
let contractAddr  = MY_CONTRACT_ADDRESS;
let useMock       = false;
function fillCred(user, pass) {
  document.getElementById('loginUsername').value = user;
  document.getElementById('loginPassword').value = pass;
}

function handleLogin() {
  const u = document.getElementById('loginUsername').value.trim().toLowerCase();
  const p = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  if (USERS[u] && USERS[u].password === p) {
    errEl.classList.add('hidden');
    currentUser = { username: u, ...USERS[u] };
    initApp();
  } else {
    errEl.classList.remove('hidden');
    document.getElementById('loginPassword').value = '';
  }
}

function handleLogout() {
  currentUser = walletAddress = provider = signer = contract = null;
  useMock = true;
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('appScreen').classList.remove('active');
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
}

document.getElementById('loginPassword').addEventListener('keydown', e => { if (e.key==='Enter') handleLogin(); });
document.getElementById('loginUsername').addEventListener('keydown', e => { if (e.key==='Enter') handleLogin(); });

function initApp() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('appScreen').classList.add('active');
  buildSidebar();
  buildDashboard();
  populateTransferTargets();
  updateAbiDisplay();
  updateQuickIds();
  navigateTo(currentUser.role === 'viewer' ? 'verify' : 'dashboard');
}

function buildSidebar() {
  const badgeCls = { manufacturer:'manufactured', distributor:'distributed', pharmacy:'pharmacy', viewer:'verified' };
  document.getElementById('sidebarUser').innerHTML = `
    <div class="flex items-center gap-10">
      <div class="user-avatar">${currentUser.avatar}</div>
      <div class="user-info">
        <div class="user-name">${currentUser.displayName}</div>
        <div class="user-role-badge">
          <span class="badge badge-${badgeCls[currentUser.role]||'verified'}">${currentUser.role}</span>
        </div>
      </div>
    </div>`;

  const navEl = document.getElementById('sidebarNav');
  navEl.innerHTML = '';
  (NAV_CONFIG[currentUser.role] || []).forEach(item => {
    const btn = document.createElement('button');
    btn.className    = 'nav-item';
    btn.dataset.page = item.id;
    btn.innerHTML    = `<span class="nav-icon">${item.icon}</span>${item.label}`;
    btn.onclick      = () => navigateTo(item.id);
    navEl.appendChild(btn);
  });
}

function navigateTo(pageId) {
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === pageId));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const map = {
    dashboard:'pageDashboard', addProduct:'pageAddProduct',
    transfer:'pageTransfer',   myProducts:'pageMyProducts',
    verify:'pageVerify',       settings:'pageSettings',
    register:'pageRegister',
  };
  document.getElementById(map[pageId])?.classList.add('active');

  const nav = (NAV_CONFIG[currentUser.role]||[]).find(n => n.id===pageId);
  document.getElementById('topbarTitle').textContent = nav ? nav.label : 'PharmaChain';

  if (pageId === 'myProducts') buildMyProducts();
  if (pageId === 'dashboard')  buildDashboard();
  if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function buildDashboard() {
  const drugs = Object.values(mockDrugs);
  const role  = currentUser.role;
  let stats;

  if (role === 'manufacturer') {
    stats = [
      { icon:'⊕',  label:'Total Added',     value: drugs.length },
      { icon:'↗',  label:'Transferred Out', value: drugs.filter(d=>d.status>=1).length },
      { icon:'📋', label:'Still Produced',  value: drugs.filter(d=>d.status===0).length },
      { icon:'✓',  label:'Delivered',       value: drugs.filter(d=>d.status===2).length },
    ];
  } else if (role === 'distributor') {
    stats = [
      { icon:'📦', label:'In My Custody',   value: drugs.filter(d=>d.status===1).length },
      { icon:'↗',  label:'Forwarded',       value: drugs.filter(d=>d.status===2).length },
      { icon:'⊞',  label:'Total Handled',   value: drugs.filter(d=>d.status>=1).length },
      { icon:'✓',  label:'Delivered',       value: drugs.filter(d=>d.status===2).length },
    ];
  } else if (role === 'pharmacy') {
    stats = [
      { icon:'📦', label:'Received',        value: drugs.filter(d=>d.status===2).length },
      { icon:'⊞',  label:'Total in Chain',  value: drugs.length },
      { icon:'✓',  label:'Verified OK',     value: drugs.filter(d=>d.status===2).length },
      { icon:'⬡',  label:'On-chain IDs',    value: Object.keys(mockDrugs).length },
    ];
  } else {
    stats = [
      { icon:'⬡',  label:'Total Medicines', value: drugs.length },
      { icon:'🏭', label:'Produced',        value: drugs.filter(d=>d.status===0).length },
      { icon:'🚚', label:'In Transit',      value: drugs.filter(d=>d.status===1).length },
      { icon:'🏥', label:'Delivered',       value: drugs.filter(d=>d.status===2).length },
    ];
  }

  document.getElementById('statsGrid').innerHTML = stats.map(s=>`
    <div class="stat-card">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-note">${useMock ? 'mock data' : 'on-chain'}</div>
    </div>`).join('');

  document.getElementById('dashWelcome').textContent  = `Welcome, ${currentUser.displayName}`;
  document.getElementById('dashSubtitle').textContent = `Role: ${currentUser.role} · Mode: ${useMock ? '🟡 Mock/Demo' : '🟢 Live Blockchain'}`;
  document.getElementById('recentProducts').innerHTML  = drugs.slice(-4).reverse().map(renderCard).join('');
}

function renderCard(d) {
  const s = numStatus(d.status);
  return `
    <div class="product-card">
      <div class="product-card-header">
        <div>
          <div class="product-id">ID: ${d.id}</div>
          <div class="product-name">${d.name}</div>
          <div class="product-batch">Batch: ${d.batchNumber}</div>
        </div>
        ${statusBadgeHTML(s)}
      </div>
      <div class="product-meta">
        <div class="product-meta-row"><span class="label">Status</span><span class="value">${STATUS_LABEL[s]}</span></div>
        <div class="product-meta-row"><span class="label">Current Owner</span><span class="value">${shortAddr(d.currentOwner)}</span></div>
        <div class="product-meta-row"><span class="label">Expiry</span><span class="value">${tsToDate(d.expiryDate)}</span></div>
        <div class="product-meta-row"><span class="label">Chain Steps</span><span class="value">${d.history.length}</span></div>
      </div>
    </div>`;
}
function buildMyProducts() {
  const filterStatus = currentUser.role === 'distributor' ? 1 : 2;
  const list = Object.values(mockDrugs).filter(d => numStatus(d.status) === filterStatus);

  document.getElementById('myProductsTitle').textContent =
    currentUser.role === 'pharmacy' ? 'Received Medicines' : 'Medicines in My Custody';

  document.getElementById('myProductsList').innerHTML = list.length
    ? list.map(renderCard).join('')
    : `<div class="empty-state"><div class="empty-icon">📦</div><p>Chưa có thuốc nào trong kho của bạn.</p></div>`;
}

async function addProduct() {
  const idRaw  = document.getElementById('addProductId').value.trim();
  const name   = document.getElementById('addDrugName').value.trim();
  const batch  = document.getElementById('addBatchNo').value.trim();
  const expiry = document.getElementById('addExpiry').value;        

  if (!idRaw || !name || !batch || !expiry) {
    showToast('Vui lòng điền đầy đủ các trường bắt buộc (*).', 'warning'); return;
  }

  const id       = parseInt(idRaw);
  const expiryTs = Math.floor(new Date(expiry).getTime() / 1000);

  if (isNaN(id) || id <= 0) {
    showToast('Medicine ID phải là số nguyên dương.', 'warning'); return;
  }
  if (mockDrugs[id]) {
    showToast(`Medicine ID ${id} đã tồn tại trên chain.`, 'error'); return;
  }
  if (expiryTs <= Math.floor(Date.now() / 1000)) {
    showToast('Ngày hết hạn phải lớn hơn ngày hiện tại.', 'warning'); return;
  }

  showTxModal('Đang gửi giao dịch addMedicine lên blockchain...');

  try {
    let txHash;

    if (!useMock && contract) {
      const tx = await contract.addMedicine(id, name, batch, expiryTs);
      showTxMessage('Đang chờ xác nhận block...');
      const receipt = await tx.wait();
      txHash = receipt.transactionHash;
    } else {
      await sleep(1500);
      txHash = '0x' + randomHex(64);
    }
    const nowTs = Math.floor(Date.now() / 1000);
    mockDrugs[id] = {
      id,
      name,
      batchNumber:    batch,
      productionDate: nowTs,
      expiryDate:     expiryTs,
      currentOwner:   walletAddress || '0xMANF_MOCK',
      status:         0,  
      history:        [walletAddress || '0xMANF_MOCK'],
      statusHistory:  ['Produced by Manufacturer'],
    };

    showTxSuccess(`Thuốc "${name}" (ID: ${id}) đã đăng ký thành công!`, txHash);
    clearAddForm();
    buildDashboard();
    updateQuickIds();

  } catch (err) {
    closeTxModal();
    showToast('Lỗi addMedicine: ' + parseRevert(err), 'error');
  }
}

function clearAddForm() {
  ['addProductId','addDrugName','addBatchNo','addExpiry','addQuantity','addManufacturerName','addNotes']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}
function populateTransferTargets() {
  const targets = {
    manufacturer: [{ value: 'distributor', label: 'FastMed Distribution (Distributor)' }],
    distributor:  [{ value: 'pharmacy',    label: 'City Care Pharmacy (Pharmacy)' }],
    pharmacy:     [],
  };
  const sel = document.getElementById('transferTo');
  sel.innerHTML = '<option value="">-- Chọn người nhận --</option>' +
    (targets[currentUser.role] || []).map(t => `<option value="${t.value}">${t.label}</option>`).join('');

  const sub = {
    manufacturer: 'Chuyển quyền sở hữu từ Manufacturer → Distributor.',
    distributor:  'Chuyển quyền sở hữu từ Distributor → Pharmacy.',
    pharmacy:     'Pharmacy là điểm cuối — không chuyển tiếp được.',
  };
  document.getElementById('transferSubtitle').textContent = sub[currentUser.role] || '';
}

async function previewTransfer() {
  const id = parseInt(document.getElementById('transferProductId').value.trim());
  const el = document.getElementById('transferPreview');
  if (!id) { showToast('Nhập Medicine ID trước.', 'warning'); return; }
  let d = mockDrugs[id];
  if (!useMock && contract) {
    try {
      const m = await contract.getMedicine(id);
      d = {
        id:           m.id.toNumber(),
        name:         m.name,
        batchNumber:  m.batchNumber,
        productionDate: m.productionDate.toNumber(),
        expiryDate:   m.expiryDate.toNumber(),
        currentOwner: m.currentOwner,
        status:       m.status,
      };
      mockDrugs[id] = { ...d, history: [], statusHistory: [] };
    } catch (_) { d = null; }
  }

  if (!d) {
    el.innerHTML = `<p style="color:var(--red-500)">⚠ Không tìm thấy Medicine ID: ${id} trên chain.</p>`;
    el.classList.remove('hidden'); return;
  }
  const s = numStatus(d.status);
  let ownerWarning = '';
  if (!useMock && walletAddress) {
    if (d.currentOwner.toLowerCase() !== walletAddress.toLowerCase()) {
      ownerWarning = `<div class="preview-warning">⚠ Bạn không phải owner hiện tại của lô thuốc này.<br>
        Owner: <code>${d.currentOwner}</code><br>
        Ví của bạn: <code>${walletAddress}</code></div>`;
    }
  }

  let ownerName = await lookupActorName(d.currentOwner);

  el.innerHTML = `
    <h4>📦 Medicine Preview</h4>
    <div class="preview-grid">
      <div class="preview-row"><span class="pk">Medicine ID</span><span class="pv">${d.id}</span></div>
      <div class="preview-row"><span class="pk">Tên thuốc</span><span class="pv">${d.name}</span></div>
      <div class="preview-row"><span class="pk">Batch No</span><span class="pv">${d.batchNumber}</span></div>
      <div class="preview-row"><span class="pk">Trạng thái</span><span class="pv">${STATUS_LABEL[s]}</span></div>
      <div class="preview-row"><span class="pk">Owner hiện tại</span>
        <span class="pv">
          ${ownerName ? `<strong>${ownerName}</strong><br>` : ''}
          <span class="addr-full">${d.currentOwner}</span>
        </span>
      </div>
      <div class="preview-row"><span class="pk">Hết hạn</span><span class="pv">${tsToDate(d.expiryDate)}</span></div>
    </div>
    ${ownerWarning}`;
  el.classList.remove('hidden');
}
async function lookupActorName(addr) {
  if (!addr) return '';
  if (!useMock && contract) {
    try {
      const a = await contract.actors(addr);
      if (a.isRegistered) return `${a.name} (${ROLE_LABEL[a.role]})`;
    } catch (_) {}
    return '';
  }
  const lower = addr.toLowerCase();
  if (lower.includes('manf')) return 'MedLab Pharma Co. (Manufacturer)';
  if (lower.includes('dist')) return 'FastMed Distribution (Distributor)';
  if (lower.includes('phar')) return 'City Care Pharmacy (Pharmacy)';
  if (walletAddress && lower === walletAddress.toLowerCase()) return `${currentUser.displayName} (${currentUser.role})`;
  return '';
}

async function transferProduct() {
  const id     = parseInt(document.getElementById('transferProductId').value.trim());
  const toRole = document.getElementById('transferTo').value;

  if (!id || !toRole) { showToast('Điền Medicine ID và chọn người nhận.', 'warning'); return; }

  const recipientInput = document.getElementById('transferRecipientAddr');
  let newOwnerAddr = recipientInput ? recipientInput.value.trim() : '';

  if (!useMock && contract) {
    if (!walletAddress) { showToast('Kết nối MetaMask trước.', 'warning'); return; }
    if (!ethers.utils.isAddress(newOwnerAddr)) {
      showToast('Địa chỉ ví người nhận không hợp lệ. Bắt buộc nhập khi dùng Live mode.', 'error'); return;
    }
    try {
      const recipientActor = await contract.actors(newOwnerAddr);
      const expectedRole   = ROLE_NUM[toRole];
      if (!recipientActor.isRegistered) {
        showToast(`Địa chỉ ${shortAddr(newOwnerAddr)} chưa được registerActor.`, 'error'); return;
      }
      if (recipientActor.role !== expectedRole) {
        showToast(`Người nhận có role ${ROLE_LABEL[recipientActor.role]}, không phải ${ROLE_LABEL[expectedRole]}.`, 'error'); return;
      }
    } catch (e) {
      showToast('Không thể kiểm tra actor trên chain: ' + parseRevert(e), 'error'); return;
    }
  }
  const d = mockDrugs[id];
  if (!d && useMock) { showToast('Không tìm thấy Medicine ID trong mock data.', 'error'); return; }

  showTxModal('Đang gọi transferItem() trên blockchain...');

  try {
    let txHash;
    let recipientName = '';

    if (!useMock && contract) {
      const tx = await contract.transferItem(id, newOwnerAddr);
      showTxMessage('Giao dịch đã gửi — đang chờ xác nhận block...');
      const receipt = await tx.wait();
      txHash = receipt.transactionHash;
      try {
        const m    = await contract.getMedicine(id);
        const hist = await contract.getMedicineHistory(id);
        mockDrugs[id] = {
          id,
          name:           m.name,
          batchNumber:    m.batchNumber,
          productionDate: m.productionDate.toNumber(),
          expiryDate:     m.expiryDate.toNumber(),
          currentOwner:   m.currentOwner,
          status:         m.status,
          history:        hist.wallets,
          statusHistory:  hist.notes,
        };
      } catch (_) {}
      try {
        const ra = await contract.actors(newOwnerAddr);
        recipientName = ra.isRegistered ? ra.name : shortAddr(newOwnerAddr);
      } catch (_) { recipientName = shortAddr(newOwnerAddr); }

    } else {
      await sleep(1500);
      txHash       = '0x' + randomHex(64);
      newOwnerAddr = '0x' + toRole.toUpperCase().slice(0,4).padEnd(38,'0') + 'FF';
      recipientName = { distributor:'FastMed Distribution', pharmacy:'City Care Pharmacy' }[toRole] || toRole;
      const newStatus = toRole === 'pharmacy' ? 2 : 1;
      const noteMap   = { distributor: 'In Transit to Distributor', pharmacy: 'Delivered to Pharmacy' };
      if (d) {
        d.currentOwner = newOwnerAddr;
        d.status       = newStatus;
        d.history.push(newOwnerAddr);
        d.statusHistory.push(noteMap[toRole] || 'Transferred');
      }
    }

    showTxSuccess(
      `Medicine ID ${id} đã chuyển thành công đến ${recipientName || ROLE_LABEL[ROLE_NUM[toRole]]}!`,
      txHash
    );
    document.getElementById('transferProductId').value = '';
    document.getElementById('transferNotes').value     = '';
    document.getElementById('transferPreview').classList.add('hidden');
    if (recipientInput) recipientInput.value = '';
    buildDashboard();
    updateQuickIds();

  } catch (err) {
    closeTxModal();
    showToast('Lỗi transferItem: ' + parseRevert(err), 'error');
  }
}
async function registerActorOnChain() {
  const addr = document.getElementById('regWallet').value.trim();
  const name = document.getElementById('regName').value.trim();
  const role = parseInt(document.getElementById('regRole').value);

  if (!addr || !name || !role) { showToast('Điền đầy đủ thông tin Actor.', 'warning'); return; }

  showTxModal('Đang gửi giao dịch registerActor...');

  try {
    let txHash;
    if (!useMock && contract) {
      if (!ethers.utils.isAddress(addr)) {
        closeTxModal(); showToast('Địa chỉ ví không hợp lệ.', 'error'); return;
      }
      const contractOwner = await contract.owner();
      if (walletAddress.toLowerCase() !== contractOwner.toLowerCase()) {
        closeTxModal();
        showToast(`Chỉ Admin (${shortAddr(contractOwner)}) mới đăng ký được Actor.`, 'error'); return;
      }
      const tx = await contract.registerActor(addr, name, role);
      showTxMessage('Đang chờ xác nhận...');
      const receipt = await tx.wait();
      txHash = receipt.transactionHash;
    } else {
      await sleep(1200);
      txHash = '0x' + randomHex(64);
    }

    showTxSuccess(`Actor "${name}" (${ROLE_LABEL[role]}) đã được đăng ký!`, txHash);
    document.getElementById('regWallet').value = '';
    document.getElementById('regName').value   = '';

  } catch (err) {
    closeTxModal();
    showToast('Lỗi registerActor: ' + parseRevert(err), 'error');
  }
}
function updateQuickIds() {
  const container = document.getElementById('quickIds');
  container.querySelectorAll('.quick-id-btn').forEach(e => e.remove());
  Object.keys(mockDrugs).forEach(id => {
    const btn = document.createElement('button');
    btn.className   = 'quick-id-btn';
    btn.textContent = 'ID: ' + id;
    btn.onclick     = () => { document.getElementById('verifyProductId').value = id; verifyProduct(); };
    container.appendChild(btn);
  });
}

async function verifyProduct() {
  const idRaw = document.getElementById('verifyProductId').value.trim();
  const id    = parseInt(idRaw);
  const resEl = document.getElementById('verifyResult');
  const empEl = document.getElementById('verifyEmpty');

  if (!id) { showToast('Nhập Medicine ID.', 'warning'); return; }

  let med, wallets, notes, isValid, validMsg;

  try {
    if (!useMock && contract) {
      showToast('Đang truy vấn blockchain...', 'info');
      const m = await contract.getMedicine(id);
      med = {
        id:             m.id.toNumber(),
        name:           m.name,
        batchNumber:    m.batchNumber,
        productionDate: m.productionDate.toNumber(),
        expiryDate:     m.expiryDate.toNumber(),
        currentOwner:   m.currentOwner,
        status:         m.status,
      };
      const hist  = await contract.getMedicineHistory(id);
      wallets     = hist.wallets;       
      notes       = hist.notes;            
      const v     = await contract.verifyMedicine(id);
      isValid     = v.isValid;
      validMsg    = v.message;

      mockDrugs[id] = { ...med, history: wallets, statusHistory: notes };

    } else {
      const d = mockDrugs[id];
      if (!d) throw new Error('not_found');
      med      = d;
      wallets  = d.history;
      notes    = d.statusHistory;
      const s  = numStatus(d.status);
      isValid  = (s === 2) && (Date.now()/1000 < d.expiryDate);
      validMsg = isValid
        ? 'Lo thuoc hop le va da duoc giao thanh cong'
        : (s < 2 ? 'Lo thuoc chua duoc giao den Nha thuoc' : 'Lo thuoc da het han su dung');
    }
  } catch (err) {
    resEl.classList.add('hidden');
    empEl.classList.remove('hidden');
    if (!err.message?.includes('not_found'))
      showToast('Không tìm thấy Medicine ID này.', 'error');
    return;
  }

  empEl.classList.add('hidden');
  resEl.classList.remove('hidden');
  const s = numStatus(med.status);
  const actorInfoList = await Promise.all(wallets.map(w => lookupActorFull(w)));
  const ownerInfo = actorInfoList[actorInfoList.length - 1] || {};
  document.getElementById('verifyProductCard').innerHTML = `
    <div class="vpc-left">
      <div class="vpc-pid">Medicine ID: ${med.id}</div>
      <div class="vpc-name">${med.name}</div>
      <div class="vpc-batch">Batch No: ${med.batchNumber}</div>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
        ${statusBadgeHTML(s)}
        <span class="badge ${isValid ? 'badge-verified' : 'badge-distributed'}">
          ${isValid ? '✓ Hợp lệ' : '⚠ Chưa hợp lệ'}
        </span>
      </div>
      <div style="margin-top:8px;font-size:.82rem;color:var(--gray-500);font-style:italic">${validMsg}</div>
    </div>
    <div class="vpc-right">
      <div class="vpc-meta-row"><span class="vk">Trạng thái</span>
        <span class="vv">${STATUS_LABEL[s]}</span></div>
      <div class="vpc-meta-row"><span class="vk">Owner hiện tại</span>
        <span class="vv">
          ${ownerInfo.name ? `<strong>${ownerInfo.name}</strong><br>` : ''}
          <span class="addr-chip" onclick="copyAddr('${med.currentOwner}')" title="Click để copy">
            ${med.currentOwner}
          </span>
        </span>
      </div>
      <div class="vpc-meta-row"><span class="vk">Ngày sản xuất</span>
        <span class="vv">${tsToDate(med.productionDate)}</span></div>
      <div class="vpc-meta-row"><span class="vk">Ngày hết hạn</span>
        <span class="vv">${tsToDate(med.expiryDate)}</span></div>
      <div class="vpc-meta-row"><span class="vk">Số bước lịch sử</span>
        <span class="vv">${wallets.length} ví</span></div>
    </div>`;

  const stages = [
    { label: 'Produced',     sub: 'Manufacturer', icon: '🏭' },
    { label: 'In Transit',   sub: 'Distributor',  icon: '🚚' },
    { label: 'Delivered',    sub: 'Pharmacy',      icon: '🏥' },
  ];
  document.getElementById('verifyTimeline').innerHTML = `<div class="timeline">` +
    stages.map((st, i) => {
      const done    = i <= s;
      const current = i === s;
      const cls     = done ? (current ? 'done current' : 'done') : '';
      const actor   = actorInfoList[i] || {};
      return `
        <div class="timeline-step ${cls}">
          <div class="step-dot">${st.icon}</div>
          <div class="step-label">${st.label}<br><small>${st.sub}</small></div>
          <div class="step-time">${notes[i] || '—'}</div>
          ${actor.address ? `<div class="step-addr" onclick="copyAddr('${actor.address}')" title="${actor.address}">${shortAddr(actor.address)}</div>` : ''}
        </div>`;
    }).join('') + `</div>`;
  const walletChainHTML = wallets.map((w, i) => {
    const info = actorInfoList[i] || {};
    const roleBadge = info.roleNum !== undefined
      ? `<span class="badge badge-${['verified','manufactured','distributed','pharmacy'][info.roleNum] || 'verified'}">${ROLE_LABEL[info.roleNum] || 'Unknown'}</span>`
      : '';
    return `
      <div class="wallet-chain-item ${i === wallets.length - 1 ? 'current' : ''}">
        <div class="wc-step">${i + 1}</div>
        <div class="wc-connector ${i < wallets.length - 1 ? 'has-line' : ''}"></div>
        <div class="wc-body">
          <div class="wc-header">
            ${roleBadge}
            ${info.name ? `<span class="wc-name">${info.name}</span>` : ''}
            ${i === wallets.length - 1 ? '<span class="wc-current-tag">Current Owner</span>' : ''}
          </div>
          <div class="wc-address" onclick="copyAddr('${w}')" title="Click để copy địa chỉ">
            <span class="wc-addr-icon">⬡</span>
            <span class="wc-addr-text">${w}</span>
            <span class="wc-copy-icon">⧉</span>
          </div>
          <div class="wc-note">${notes[i] || '—'}</div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('verifyTableBody').innerHTML = wallets.map((w, i) => {
    const info = actorInfoList[i] || {};
    const roleBadge = info.roleNum !== undefined
      ? `<span class="badge badge-${['verified','manufactured','distributed','pharmacy'][info.roleNum] || 'verified'}" style="font-size:.68rem">${ROLE_LABEL[info.roleNum]}</span>`
      : '';
    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${notes[i] || '—'}</strong></td>
        <td>
          ${info.name ? `<div style="font-weight:600;font-size:.84rem">${info.name}</div>` : ''}
          ${roleBadge}
        </td>
        <td>
          <span class="addr-chip copyable" onclick="copyAddr('${w}')" title="Click để copy">
            ${w}
          </span>
        </td>
        <td>${i === 0 ? '—' : `<span class="addr-chip" style="font-size:.7rem">${shortAddr(wallets[i-1])}</span>`} → <span class="addr-chip" style="font-size:.7rem">${shortAddr(w)}</span></td>
      </tr>`;
  }).join('');

  let walletChainSection = document.getElementById('walletChainSection');
  if (!walletChainSection) {
    walletChainSection = document.createElement('div');
    walletChainSection.id = 'walletChainSection';
    document.getElementById('verifyResult').insertBefore(
      walletChainSection,
      document.querySelector('.section-title')
    );
  }
  walletChainSection.innerHTML = `
    <div class="section-title">Wallet Chain — Danh sách địa chỉ ví đã sở hữu</div>
    <div class="wallet-chain-list">${walletChainHTML}</div>`;
}

async function lookupActorFull(addr) {
  if (!addr) return {};
  if (!useMock && contract) {
    try {
      const a = await contract.actors(addr);
      return { address: addr, name: a.name, roleNum: a.role, isRegistered: a.isRegistered };
    } catch (_) {}
    return { address: addr };
  }
  const lower = addr.toLowerCase();
  if (lower.includes('manf') || lower.includes('0xmanf'))
    return { address: addr, name: 'MedLab Pharma Co.',    roleNum: 1 };
  if (lower.includes('dist') || lower.includes('0xdist'))
    return { address: addr, name: 'FastMed Distribution', roleNum: 2 };
  if (lower.includes('phar') || lower.includes('0xphar'))
    return { address: addr, name: 'City Care Pharmacy',   roleNum: 3 };
  if (walletAddress && lower === walletAddress.toLowerCase())
    return { address: addr, name: currentUser.displayName, roleNum: ROLE_NUM[currentUser.role] || 0 };
  return { address: addr };
}

function copyAddr(addr) {
  navigator.clipboard.writeText(addr).then(() => {
    showToast('Đã copy: ' + addr, 'success');
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = addr; document.body.appendChild(el);
    el.select(); document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Đã copy địa chỉ.', 'success');
  });
}

function saveContractSettings() {
  const addr   = document.getElementById('contractAddress').value.trim();
  const abiRaw = document.getElementById('contractAbi').value.trim();
  const statEl = document.getElementById('contractStatus');

  let abi = CONTRACT_ABI;
  if (abiRaw) {
    try { abi = JSON.parse(abiRaw); }
    catch { showToast('ABI JSON không hợp lệ.', 'error'); return; }
  }

  if (!addr) {
    contract = null; useMock = true; contractAddr = '';
    statEl.innerHTML  = '<span class="status-dot mock"></span> Chạy <strong>Mock / Demo Mode</strong>.';
    statEl.style.cssText = 'background:var(--amber-100);color:#78350f;border-color:#fde68a;';
    showToast('Đã xóa contract → Mock mode.', 'info'); return;
  }
  if (!provider) { showToast('Kết nối MetaMask trước!', 'warning'); return; }
  if (!ethers.utils.isAddress(addr)) { showToast('Địa chỉ contract không hợp lệ.', 'error'); return; }

  try {
    contract     = new ethers.Contract(addr, abi, signer);
    useMock      = false;
    contractAddr = addr;
    statEl.innerHTML  = `<span class="status-dot connected"></span> Đã kết nối: <strong>${addr.slice(0,8)}...${addr.slice(-6)}</strong>`;
    statEl.style.cssText = 'background:var(--mint-100);color:#065f46;border-color:#6ee7b7;';
    showToast('Contract kết nối thành công!', 'success');
    loadChainData();
  } catch (err) {
    showToast('Lỗi: ' + err.message, 'error');
  }
}

async function loadChainData() {
  if (!contract) return;
  try {
    showToast('Đang tải dữ liệu từ blockchain...', 'info');
    const ids = await contract.getAllMedicineIds();
    let count = 0;
    for (const rawId of ids) {
      const id = rawId.toNumber();
      try {
        const m    = await contract.getMedicine(id);
        const hist = await contract.getMedicineHistory(id);
        mockDrugs[id] = {
          id,
          name:           m.name,
          batchNumber:    m.batchNumber,
          productionDate: m.productionDate.toNumber(),
          expiryDate:     m.expiryDate.toNumber(),
          currentOwner:   m.currentOwner,
          status:         m.status,
          history:        hist.wallets,
          statusHistory:  hist.notes,
        };
        count++;
      } catch (_) {}
    }
    buildDashboard();
    updateQuickIds();
    showToast(`Tải xong ${count} medicine từ chain.`, 'success');
  } catch (err) {
    showToast('Lỗi tải dữ liệu: ' + parseRevert(err), 'error');
  }
}

function updateAbiDisplay() {
  document.getElementById('abiDisplay').textContent = JSON.stringify(CONTRACT_ABI, null, 2);
}

async function autoConnectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        walletAddress = accounts[0];
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const network = await provider.getNetwork();
        if (contractAddr) {
          contract = new ethers.Contract(contractAddr, CONTRACT_ABI, signer);
          useMock = false;
        }
        
        updateWalletUI(walletAddress, network.name, true);
        window.ethereum.on('accountsChanged', accs => {
          if (!accs.length) disconnectWallet();
          else { walletAddress = accs[0]; updateWalletUI(walletAddress, null, true); }
        });
        window.ethereum.on('chainChanged', () => location.reload());
      }
    } catch (e) { console.log("Auto-connect failed:", e); }
  }
}

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    showToast('Không tìm thấy MetaMask!', 'error'); return;
  }
  try {
    showToast('Đang kết nối MetaMask...', 'info');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress  = accounts[0];
    provider       = new ethers.providers.Web3Provider(window.ethereum);
    signer         = provider.getSigner();
    
    const network = await provider.getNetwork();
    updateWalletUI(walletAddress, network.name, true);
    if (contractAddr) {
      contract = new ethers.Contract(contractAddr, CONTRACT_ABI, signer);
      useMock  = false;
      loadChainData();
    }

    window.ethereum.on('accountsChanged', accs => {
      if (!accs.length) disconnectWallet();
      else { walletAddress = accs[0]; updateWalletUI(walletAddress, null, true); }
    });
    window.ethereum.on('chainChanged', () => location.reload());

    showToast('Ví đã kết nối: ' + shortAddr(walletAddress), 'success');
  } catch (err) {
    showToast('Kết nối thất bại: ' + parseRevert(err), 'error');
  }
}

function disconnectWallet() {
  walletAddress = provider = signer = contract = null;
  updateWalletUI(null, null, false);
}

function updateWalletUI(address, network, connected) {
  const statusEl = document.getElementById('walletStatus');
  const infoEl   = document.getElementById('walletInfo');
  const btn      = document.getElementById('connectWalletBtn');
  const dot      = statusEl.querySelector('.wallet-dot');
  if (connected && address) {
    dot.className = 'wallet-dot connected';
    statusEl.querySelector('span').textContent = 'Live Connected';
    document.getElementById('walletAddress').textContent = shortAddr(address);
    document.getElementById('walletNetwork').textContent = '⬡ ' + (network || 'Ganache');
    infoEl.classList.remove('hidden');
    btn.textContent = '✓ Connected'; btn.classList.add('connected');
  } else {  
    dot.className = 'wallet-dot disconnected';
    statusEl.querySelector('span').textContent = 'Wallet Disconnected';
    infoEl.classList.add('hidden');
    btn.textContent = 'Connect MetaMask'; btn.classList.remove('connected');
  }
}

autoConnectMetaMask();

function showTxModal(msg) {
  document.getElementById('txMessage').textContent = msg;
  document.getElementById('txSpinner').classList.remove('hidden');
  document.getElementById('txSuccess').classList.add('hidden');
  document.getElementById('txModal').classList.remove('hidden');
}
function showTxMessage(msg) { document.getElementById('txMessage').textContent = msg; }
function showTxSuccess(msg, tx) {
  document.getElementById('txSpinner').classList.add('hidden');
  document.getElementById('txSuccessMsg').textContent = msg;
  document.getElementById('txHashDisplay').textContent = 'Tx: ' + (tx || 'mock-' + randomHex(12));
  document.getElementById('txSuccess').classList.remove('hidden');
}
function closeTxModal() { document.getElementById('txModal').classList.add('hidden'); }
function showToast(message, type = 'info') {
  const icons = { success:'✓', error:'✕', warning:'⚠', info:'ℹ' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ'}</span>${message}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 4200);
}
function numStatus(s)  { return typeof s === 'object' ? s.toNumber() : Number(s); }

function statusBadgeHTML(s) {
  const n = numStatus(s);
  const map = {
    0: '<span class="badge badge-manufactured">Produced</span>',
    1: '<span class="badge badge-distributed">In Transit</span>',
    2: '<span class="badge badge-pharmacy">Delivered</span>',
  };
  return map[n] || '<span class="badge">Unknown</span>';
}

function shortAddr(addr) {
  if (!addr) return '—';
  if (typeof addr === 'string' && addr.startsWith('0x') && addr.length === 42)
    return addr.slice(0,6) + '...' + addr.slice(-4);
  return String(addr).slice(0,12) + '...';
}

function tsToDate(ts) {
  if (!ts) return '—';
  const n = typeof ts === 'object' ? ts.toNumber() : Number(ts);
  if (!n) return '—';
  return new Date(n * 1000).toLocaleDateString('vi-VN');
}

function parseRevert(err) {
  if (err?.data?.message)   return err.data.message;
  if (err?.reason)          return err.reason;
  if (err?.error?.message)  return err.error.message;
  if (err?.message) {
    const m = err.message.match(/"message":"([^"]+)"/);
    if (m) return m[1];
    return err.message.slice(0, 150);
  }
  return String(err);
}

function sleep(ms)      { return new Promise(r => setTimeout(r, ms)); }
function randomHex(len) { return Array.from({length:len},()=>Math.floor(Math.random()*16).toString(16)).join(''); }
updateQuickIds();
