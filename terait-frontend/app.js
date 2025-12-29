const API_URL = 'https://terait-backend.onrender.com';
// Safe storage for browser environment
const storage = window.localStorage || {};

/* Data structures */
let currentUser = null; // {role, username, name, employeeId?}

// Call Types and Groups
const callTypes = [
  "Printer Problem",
  "Computer Problem",
  "Network Issue",
  "Software Issue",
  "Hardware Problem"
];

// Companies data structure
let companies = [
  {
    id: "C001",
    name: "ABC Corporation",
    phone: "9876543210",
    email: "info@abc.com",
    gstNo: "18AABCT1234F1Z0",
    address: {
      line1: "123 Business Street",
      line2: "Suite 100",
      line3: "Tech Park",
      pincode: "560001"
    }
  }
];

// Customers data structure
let customers = [
  {
    id: "CUS001",
    type: "individual",
    name: "cust",
    phone: "9876543210",
    email: "john@customer.com",
    address: "456 Customer Lane, Apt 5B, Downtown",
    gst: "",
    contactPerson: "",
    companyId: ""
  },
  {
    id: "CUS002",
    type: "corporate",
    name: "ABC Corporation",
    companyName: "ABC Corporation",
    phone: "9876543211",
    email: "contact@abc.com",
    address: "789 Business Ave, Suite 200, Business District",
    gst: "18AABCT1234F1Z0",
    contactPerson: "Sarah Smith",
    companyId: "C001"
  }
];

const employees = [
  { id: "E001", name: "Rajesh Kumar", email: "rajesh@company.com", phone: "9876543101", department: "IT Support", password: "rajesh123", role: "employee" },
  { id: "E002", name: "Priya Sharma", email: "priya@company.com", phone: "9876543102", department: "Sales", password: "priya123", role: "employee" },
  { id: "E003", name: "Amit Singh", email: "amit@company.com", phone: "9876543103", department: "IT Support", password: "amit123", role: "employee" },
  { id: "E004", name: "Sample Employee", email: "employee@company.com", phone: "9876543104", department: "IT Support", password: "emp123", username: "employee", role: "employee" },
  { id: "E005", name: "test1", email: "test1@company.com", phone: "9876543105", department: "IT Support", password: "123", username: "employee", role: "employee" },
  { id: "E006", name: "emp1", email: "emp@1", phone: "9876543105", department: "IT Support", password: "123", username: "emp1", role: "employee" },
  { id: "E007", name: "emp2", email: "emp@2", phone: "9876543105", department: "IT Support", password: "123", username: "emp2", role: "employee" }
];

let managers = [
  { id: "M001", name: "Sales Manager", email: "sales.mgr@company.com", phone: "9876500001", password: "manager123", username: "mgr_sales", role: "manager", assignedGroups: ["GRP001"], assignedDepartments: ["Sales"] },
  { id: "M002", name: "Installation Manager", email: "install.mgr@company.com", phone: "9876500002", password: "manager123", username: "mgr_install", role: "manager", assignedGroups: ["GRP002"], assignedDepartments: ["Technical", "IT", "CCTV", "Biometric"] },
  { id: "M003", name: "Services Manager", email: "services.mgr@company.com", phone: "9876500003", password: "manager123", username: "mgr_services", role: "manager", assignedGroups: ["GRP003"], assignedDepartments: ["Technical", "IT", "CCTV", "Biometric"] },
  { id: "M004", name: "Complaints Manager", email: "complaints.mgr@company.com", phone: "9876500004", password: "manager123", username: "mgr_complaints", role: "manager", assignedGroups: ["GRP004"], assignedDepartments: ["Technical", "IT", "CCTV", "Biometric"] },
  // { id: "M005", name: "mgr1", email: "mgr@1", phone: "9876500004", password: "123", username: "mgr1", role: "manager", assignedGroups: ["GRP002"], assignedDepartments: ["sales"] },
  // { id: "M006", name: "mgr2", email: "mgr@2", phone: "9876500004", password: "123", username: "mgr2", role: "manager", assignedGroups: ["GRP001"], assignedDepartments: ["Technical"] }
];

// Call Groups structure
let callGroups = [
  { id: "GRP001", name: "Sales Group", callType: "Sales" },
  { id: "GRP002", name: "Installation Group", callType: "Installation" },
  { id: "GRP003", name: "Services Group", callType: "Services" },
  { id: "GRP004", name: "Complaints Group", callType: "Complaints" }
];

let frontOfficeUsers = [
  { id: "F001", name: "Front Office User", email: "frontoffice@company.com", phone: "9876511111", department: "Front Office", password: "123", username: "fo", role: "frontoffice" }
];

let financeUsers = [
  { id: "FN001", name: "Finance User", email: "finance@company.com", phone: "9876522222", department: "Finance", password: "123", username: "finance", role: "finance" }
];

// Help Desk users
let helpDeskUsers = [
  { id: "HD001", name: "Help Desk User", email: "helpdesk@company.com", phone: "9876533333", department: "Help Desk", password: "123", username: "helpdesk", role: "helpdesk" }
];

let hrUsers = [
  { id: "HR001", name: "HR User", email: "hr@company.com", phone: "9876540000", department: "HR", password: "123", username: "hr", role: "hr" }
];

// Departments used by Help Desk
const departmentsList = ["IT", "Technical", "CCTV", "Biometric", "Sales"];

// Admin users with permissions
let admins = [
  { id: "A001", name: "Default Admin", email: "admin@company.com", username: "admin", password: "123", role: "admin", permissions: { canEdit: true, canDelete: true } }
];

function getCurrentAdminPerms() {
  if (!currentUser || currentUser.role !== 'admin') return { canEdit: false, canDelete: false };
  const a = admins.find(x => x.username === currentUser.username);
  return (a && a.permissions) ? a.permissions : { canEdit: false, canDelete: false };
}

let tickets = [
  {
    id: "TK001",
    customerName: "John Doe",
    customerEmail: "john@customer.com",
    customerId: "CUS001",
    companyId: "C001",
    callType: null,
    callGroup: null,
    serviceType: "IT Support",
    description: "Laptop not connecting to WiFi",
    status: "Raised",
    raisedDate: "2025-11-27",
    frontOfficeUser: "frontoffice",
    assignedEmployeeId: null,
    completedDate: null,
    taskStatus: null,
    taskStartedDate: null,
    taskStartedTime: null,
    taskProgress: 0,
    taskNeeds: "",
    taskCompletionImage: null,
    reportedToManager: false,
    tasks: []
  },
  {
    id: "TK002",
    customerName: "Sarah Smith",
    customerEmail: "sarah@customer.com",
    customerId: "CUS002",
    companyId: "C001",
    callType: null,
    callGroup: null,
    serviceType: "Sales",
    description: "Need consultation for new project",
    status: "Assigned",
    raisedDate: "2025-11-26",
    frontOfficeUser: "frontoffice",
    assignedEmployeeId: "E002",
    completedDate: null,
    taskStatus: null,
    taskStartedDate: null,
    taskStartedTime: null,
    taskProgress: 0,
    taskNeeds: "",
    taskCompletionImage: null,
    reportedToManager: false,
    tasks: []
  }
];

let feedbacks = [];

/* Service pricing */
const servicePricing = {
  "Installation": 200,
  "Service": 100,
  "Complaints": 50,
  "Sales": 0
};

/* Utility functions */
function generateEmployeeId() {
  const num = employees.length + 1;
  return "E" + String(num).padStart(3, "0");
}

function generateTicketId() {
  const num = tickets.length + 1;
  return "TK" + String(num).padStart(3, "0");
}

function generateCompanyId() {
  const num = companies.length + 1;
  return "C" + String(num).padStart(3, "0");
}

function generateCustomerId() {
  const num = customers.length + 1;
  return "CUS" + String(num).padStart(3, "0");
}

function generateGroupId() {
  const num = callGroups.length + 1;
  return "GRP" + String(num).padStart(3, "0");
}

let selectedCustomerProgress = null;

function formatDateTime(dt = new Date()) {
  return dt.toLocaleString();
}

/* Action log for admin reporting */
let systemLogs = [];
function loadSystemLogs() {
  try {
    const raw = localStorage.getItem('systemLogs');
    systemLogs = raw ? JSON.parse(raw) : [];
  } catch (e) {
    systemLogs = [];
  }
}
function saveSystemLogs() {
  try {
    localStorage.setItem('systemLogs', JSON.stringify(systemLogs));
  } catch (e) {}
}
function logAction(actor, action, ticketId, details = '') {
  systemLogs.push({
    ts: new Date().toISOString(),
    actor,
    action,
    ticketId,
    details
  });
  saveSystemLogs();
}

// initialize persisted logs on load
loadSystemLogs();

/* DOM helpers */
function $(id) {
  // Return the element if present, otherwise return a safe proxy that no-ops
  const el = document.getElementById(id);
  if (el) return el;

  const noop = () => {};
  const fakeEl = {
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    style: {},
    dataset: {},
    addEventListener: noop,
    removeEventListener: noop,
    appendChild: noop,
    removeChild: noop,
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementsByTagName: () => [],
    innerHTML: '',
    textContent: '',
    value: '',
    setAttribute: noop,
    removeAttribute: noop,
    focus: noop,
    scrollTo: noop
  };

  return new Proxy(fakeEl, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return noop;
    },
    set() { return true; }
  });
}

function showSection(sectionId) {
  console.log("Showing section:", sectionId);
  
  // Hide all known sections
  const idsToHide = [
    "loginPage",
    "dashboards",
    "adminDashboard",
    "frontOfficeDashboard",
    "financeDashboard",
    "managerDashboard",
    "employeeDashboard",
    "helpDeskDashboard",
    "hrDashboard",
    "newCompanyPage",
    "newCustomerPage",
    "newGroupPage",
    "forgotPasswordPage",
    "paymentPage"
  ];

  idsToHide.forEach(id => {
    const el = $(id);
    if (el) {
      el.classList.add("hidden");
    }
  });

  if (!sectionId) return;

  // Show dashboards container if showing a dashboard
  if (sectionId !== "loginPage") {
    const dashboardsEl = $("dashboards");
    if (dashboardsEl) {
      dashboardsEl.classList.remove("hidden");
    }
  } else {
    // Show login page
    const loginPageEl = $("loginPage");
    if (loginPageEl) {
      loginPageEl.classList.remove("hidden");
    }
    return;
  }

  // Show the target section
  const target = $(sectionId);
  if (target) {
    target.classList.remove("hidden");
    console.log("Section shown:", sectionId);
  } else {
    console.error("Section not found:", sectionId);
  }
}

function updateHeader() {
  const logoutBtn = $("logoutBtn");
  
  if (!currentUser) {
    $("currentUserInfo").textContent = "";
    if (logoutBtn) logoutBtn.classList.add("hidden");
    return;
  }
  
  $("currentUserInfo").textContent =
    `Logged in as ${currentUser.name} (${currentUser.role.toUpperCase()})`;
  if (logoutBtn) logoutBtn.classList.remove("hidden");
}

/* Stats */
function updateStats() {
  $("statTotalEmployees").textContent = employees.length;
  $("statTotalTickets").textContent = tickets.length;
  $("statPendingTickets").textContent = tickets.filter(t => t.status !== "Finished").length;
  $("statCompletedTickets").textContent = tickets.filter(t => t.status === "Finished").length;
  updateRoleDashboards();
}

function updateRoleDashboards() {
  if (!currentUser) return;
  const role = currentUser.role;
  if (role === 'frontoffice') {
    const my = tickets.filter(t => t.frontOfficeUser === currentUser.userId);
    const completed = my.filter(t => t.status === 'Finished' || t.status === 'Reported').length;
    if ($('foStatMyTickets')) $('foStatMyTickets').textContent = my.length;
    if ($('foStatCompleted')) $('foStatCompleted').textContent = completed;
  } else if (role === 'helpdesk') {
    const awaiting = tickets.filter(t => (!t.department || t.department === '') && (t.status === 'Raised' || t.status === 'Pending Assignment')).length;
    const routed = tickets.filter(t => !!t.department).length;
    if ($('hdStatAwaitingDept')) $('hdStatAwaitingDept').textContent = awaiting;
    if ($('hdStatRouted')) $('hdStatRouted').textContent = routed;
  } else if (role === 'manager') {
    const myId = currentUser.userId;
    const pendingAssign = tickets.filter(t => t.status === 'Pending Assignment' && t.assignedManagerIds && t.assignedManagerIds.includes(myId) && !t.acceptedByManager).length;
    const assigned = tickets.filter(t => t.acceptedByManager === myId && (['Assigned','In Progress','Completed','Reported','Finished'].includes(t.status))).length;
    const salesApproval = tickets.filter(t => t.routeToSales && t.status === 'Pending Sales Approval').length;
    const handover = tickets.filter(t => t.acceptedByManager === myId && t.awaitingHandover).length;
    if ($('mgrStatPendingAssign')) $('mgrStatPendingAssign').textContent = pendingAssign;
    if ($('mgrStatAssigned')) $('mgrStatAssigned').textContent = assigned;
    if ($('mgrStatSalesApproval')) $('mgrStatSalesApproval').textContent = salesApproval;
    if ($('mgrStatHandover')) $('mgrStatHandover').textContent = handover;
  } else if (role === 'employee') {
    const myId = currentUser.userId;
    const myTickets = tickets.filter(t => t.assignedEmployeeId === myId);
    const pending = myTickets.filter(t => t.status === 'Assigned').length;
    const inprog = myTickets.filter(t => t.status === 'In Progress').length;
    const reported = myTickets.filter(t => t.status === 'Reported').length;
    if ($('empStatPending')) $('empStatPending').textContent = pending;
    if ($('empStatInProgress')) $('empStatInProgress').textContent = inprog;
    if ($('empStatReported')) $('empStatReported').textContent = reported;
    renderEmployeeTickets();
  } else if (role === 'finance') {
    const awaiting = tickets.filter(t => t.financeReady || (t.status === 'Reported' && t.verifiedByManager) || t.financeAdvanceRequired).length;
    const part = tickets.filter(t => (t.paymentStatus || '').toLowerCase() === 'part payment').length;
    const full = tickets.filter(t => (t.paymentStatus || '').toLowerCase() === 'full payment').length;
    if ($('finStatAwaiting')) $('finStatAwaiting').textContent = awaiting;
    if ($('finStatPart')) $('finStatPart').textContent = part;
    if ($('finStatFull')) $('finStatFull').textContent = full;
  }
}

let columnVisibility = {};
function getDefaultVisibleColumns(tbodyId) {
  const mobile = window.innerWidth <= 480;
  if (!mobile) return null;
  if (tbodyId === 'pendingTicketsTableBody') return [0,1,4,7];
  if (tbodyId === 'salesApprovalTableBody') return [0,1,3,5];
  if (tbodyId === 'financeTicketsTableBody') return [0,1,3,4,5];
  return null;
}
function setTableColumnVisibility(tbodyId, visibleIdx) {
  const tbody = $(tbodyId);
  if (!tbody) return;
  const table = tbody.closest('table');
  if (!table) return;
  const ths = Array.from(table.querySelectorAll('thead th'));
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const allIdx = ths.map((_, i) => i);
  const visible = visibleIdx && visibleIdx.length ? visibleIdx : allIdx;
  ths.forEach((th, i) => { th.style.display = visible.includes(i) ? '' : 'none'; });
  rows.forEach(tr => {
    const cells = Array.from(tr.children);
    cells.forEach((td, i) => { td.style.display = visible.includes(i) ? '' : 'none'; });
  });
  columnVisibility[tbodyId] = visible;
}
function attachColumnSelectorForTable(tbodyId, defaults) {
  const tbody = $(tbodyId);
  if (!tbody) return;
  const table = tbody.closest('table');
  if (!table) return;
  const card = table.closest('.card');
  if (!card) return;
  const selId = `colSel_${tbodyId}`;
  if (document.getElementById(selId)) return;
  const ths = Array.from(table.querySelectorAll('thead th'));
  const wrap = document.createElement('div');
  wrap.id = selId;
  wrap.style.display = 'flex';
  wrap.style.gap = '6px';
  wrap.style.alignItems = 'center';
  wrap.style.marginBottom = '8px';
  const btn = document.createElement('button');
  btn.className = 'btn small secondary';
  btn.textContent = 'Columns';
  const panel = document.createElement('div');
  panel.style.display = 'none';
  panel.style.position = 'relative';
  panel.style.background = 'rgba(255,255,255,0.08)';
  panel.style.border = '1px solid rgba(255,255,255,0.15)';
  panel.style.borderRadius = '8px';
  panel.style.padding = '8px';
  panel.style.zIndex = '10';
  const list = document.createElement('div');
  ths.forEach((th, i) => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.fontSize = '12px';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.value = String(i);
    chk.checked = (columnVisibility[tbodyId] ? columnVisibility[tbodyId].includes(i) : (defaults ? defaults.includes(i) : true));
    label.appendChild(chk);
    const span = document.createElement('span');
    span.textContent = th.textContent || `Col ${i+1}`;
    span.style.marginLeft = '6px';
    label.appendChild(span);
    list.appendChild(label);
  });
  panel.appendChild(list);
  wrap.appendChild(btn);
  wrap.appendChild(panel);
  const header = card.querySelector('h3');
  card.insertBefore(wrap, header ? header.nextSibling : card.firstChild);
  btn.onclick = () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; };
  list.onchange = () => {
    const checks = Array.from(list.querySelectorAll('input[type="checkbox"]'));
    const selected = checks.filter(c => c.checked).map(c => parseInt(c.value,10));
    setTableColumnVisibility(tbodyId, selected.length ? selected : []);
  };
  setTableColumnVisibility(tbodyId, columnVisibility[tbodyId] || defaults || null);
}
function applyColumnVisibility(tbodyId) {
  const visible = columnVisibility[tbodyId] || getDefaultVisibleColumns(tbodyId);
  setTableColumnVisibility(tbodyId, visible);
}

/* Render tables */
function renderEmployees() {
  const tbody = $("employeesTableBody");
  tbody.innerHTML = "";
  
  // Combine all user types
  const allUsers = [
    ...employees.map(e => ({ ...e, type: "employee" })),
    ...managers.map(m => ({ ...m, type: "manager" })),
    ...frontOfficeUsers.map(f => ({ ...f, type: "frontoffice" }))
  ];
  
  allUsers.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role || user.type}</td>
      <td>${user.department}</td>
      <td><button class="btn small secondary" data-user-id="${user.id}" data-user-type="${user.type}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-user-id]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-user-id");
      const type = btn.getAttribute("data-user-type");
      if (!confirm("Are you sure you want to delete this user?")) return;
      
      if (type === "employee") {
        const index = employees.findIndex(e => e.id === id);
        if (index >= 0) employees.splice(index, 1);
      } else if (type === "manager") {
        const index = managers.findIndex(m => m.id === id);
        if (index >= 0) managers.splice(index, 1);
      } else if (type === "frontoffice") {
        const index = frontOfficeUsers.findIndex(f => f.id === id);
        if (index >= 0) frontOfficeUsers.splice(index, 1);
      }
      
      renderEmployees();
      updateStats();
    };
  });
}

function renderAdminTickets() {
  const tbody = $("adminTicketsTableBody");
  tbody.innerHTML = "";
  tickets.forEach(t => {
    const emp = t.assignedEmployeeId
      ? employees.find(e => e.id === t.assignedEmployeeId)
      : null;
    const empName = emp ? emp.name : "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.serviceType}</td>
      <td>${t.status}</td>
      <td>${empName}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderEmployeeTickets() {
  const tbody = $("employeeActiveTasksTableBody");
  tbody.innerHTML = "";
  if (!currentUser || currentUser.role !== 'employee') return;

  const myId = currentUser.userId;
  const myTickets = tickets.filter(t => t.assignedEmployeeId === myId && t.status !== 'Finished' && t.status !== 'Reported');

  myTickets.forEach(t => {
    const customer = customers.find(c => c.id === t.customerId);
    const customerName = customer ? customer.name : "N/A";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${customerName}</td>
      <td>${t.serviceType}</td>
      <td>${t.estimatedTime || 'N/A'}</td>
      <td>${t.status}</td>
      <td>
        <button class="btn small primary" data-ticket-id="${t.id}">View</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAdminCompanies() {
  const tbody = $("companiesTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  companies.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${c.gstNo}</td>
      <td>
        <button class="btn small primary" data-edit-company="${c.id}">Edit</button>
        <button class="btn small secondary" data-del-company="${c.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-del-company]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-del-company");
      if (!confirm("Delete this company?")) return;
      const idx = companies.findIndex(c => c.id === id);
      if (idx >= 0) {
        companies.splice(idx, 1);
        renderAdminCompanies();
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-edit-company]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-company");
      const company = companies.find(c => c.id === id);
      if (company) {
        $("companyName").value = company.name;
        $("companyPhone").value = company.phone;
        $("companyEmail").value = company.email;
        $("companyGST").value = company.gstNo;
        $("companyAddr1").value = company.address.line1;
        $("companyAddr2").value = company.address.line2;
        $("companyAddr3").value = company.address.line3;
        $("companyPincode").value = company.address.pincode;
        // Store the ID for update
        $("companyName").dataset.editId = id;
        showSection("newCompanyPage");
      }
    };
  });
}

function renderAdminCustomers() {
  const tbody = $("customersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  customers.forEach(c => {
    const comp = companies.find(co => co.id === c.companyId);
    const compName = comp ? comp.name : "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${compName}</td>
      <td>
        <button class="btn small primary" data-edit-customer="${c.id}">Edit</button>
        <button class="btn small secondary" data-del-customer="${c.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-del-customer]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-del-customer");
      if (!confirm("Delete this customer?")) return;
      const idx = customers.findIndex(c => c.id === id);
      if (idx >= 0) {
        customers.splice(idx, 1);
        renderAdminCustomers();
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-edit-customer]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-customer");
      const customer = customers.find(c => c.id === id);
      if (customer) {
        $("newCustName").value = customer.name;
        $("newCustPhone").value = customer.phone;
        $("newCustEmail").value = customer.email;
        $("newCustCompany").value = customer.companyId;
        $("newCustAddr1").value = customer.address.line1;
        $("newCustAddr2").value = customer.address.line2;
        $("newCustAddr3").value = customer.address.line3;
        $("newCustPincode").value = customer.address.pincode;
        $("newCustName").dataset.editId = id;
        showSection("newCustomerPage");
      }
    };
  });
}

function renderCallGroups() {
  const tbody = $("callGroupsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  callGroups.forEach(g => {
    // Handle both 'managers' and 'assignedManagers' properties for compatibility
    const managerList = g.managers || g.assignedManagers || [];
    const managerNames = managerList.map(mId => {
      const mgr = managers.find(m => m.id === mId);
      return mgr ? mgr.name : mId;
    }).join(", ") || "None";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.id}</td>
      <td>${g.name}</td>
      <td>${g.department || g.callType || "-"}</td>
      <td>${(g.services || []).join(", ") || "-"}</td>
      <td>${managerNames}</td>
      <td>
        <button class="btn small primary" data-edit-group="${g.id}">Edit</button>
        <button class="btn small secondary" data-del-group="${g.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-del-group]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-del-group");
      if (!confirm("Delete this group?")) return;
      const idx = callGroups.findIndex(g => g.id === id);
      if (idx >= 0) {
        callGroups.splice(idx, 1);
        renderCallGroups();
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-edit-group]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-group");
      const group = callGroups.find(g => g.id === id);
      if (group) {
        $("groupName").value = group.name;
        $("groupCallType").value = group.callType || group.department || "";
        $("groupServices").value = (group.services || []).join(", ");
        $("groupName").dataset.editId = id;
        populateGroupManagers(group.managers || group.assignedManagers || []);
        showSection("newGroupPage");
      }
    };
  });
}

function populateGroupManagers(assignedManagers = []) {
  const managersList = $("groupManagersList");
  managersList.innerHTML = "";
  managers.forEach(m => {
    const isChecked = assignedManagers.includes(m.id);
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.padding = "5px 0";
    label.innerHTML = `
      <input type="checkbox" value="${m.id}" ${isChecked ? "checked" : ""} class="manager-checkbox" />
      ${m.name} (${m.email})
    `;
    managersList.appendChild(label);
  });
}

function renderPendingTicketsForManager() {
  const tbody = $("pendingTicketsTableBody");
  tbody.innerHTML = "";
  const myManagerId = currentUser.userId;
  
  // Show tickets routed to this manager by explicit assignment or matching department
  const myDepts = (managers.find(m => m.id === myManagerId)?.assignedDepartments) || [];
  const pending = tickets.filter(t => 
    t.status === "Pending Assignment" &&
    !t.acceptedByManager &&
    (
      (Array.isArray(t.assignedManagerIds) && t.assignedManagerIds.includes(myManagerId)) ||
      (t.department && myDepts.includes(t.department))
    )
  );
  
  pending.forEach(t => {
    const tr = document.createElement("tr");
    const employeeOptions = employees
      .filter(e => e.managerId === myManagerId || !e.managerId)
      .map(e => `<option value="${e.id}">${e.name} (${e.phone || '-'})</option>`)
      .join("");
    const salesManagerOptions = managers
      .filter(m => (m.assignedDepartments || []).some(d => (d || '').toLowerCase() === 'sales'))
      .map(m => `<option value="${m.id}">${m.name}</option>`)
      .join('');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.callType || "-"}</td>
      <td>${t.callGroup || "-"}</td>
      <td>${t.description}</td>
      <td>${t.raisedDate}</td>
      <td>
        <button class="btn small secondary" data-show-assign="${t.id}">Assign...</button>
        <div data-assign-box="${t.id}" class="hidden" style="margin-top:6px; display:flex; flex-direction:column; gap:6px;">
          <select data-assign-ticket="${t.id}">
            <option value="">Select Employee</option>
            ${employeeOptions}
          </select>
          <select data-site-visit="${t.id}">
            <option value="">Site Visit?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <select data-visit-by="${t.id}" class="hidden">
            <option value="">Visit By</option>
            <option value="manager">Manager</option>
            <option value="self">Self (Manager)</option>
            <option value="employee">Employee</option>
          </select>
          <input data-quotation-time="${t.id}" class="hidden" type="text" placeholder="Quotation / time needed (e.g., 2 days)" />
          <input data-no-visit-desc="${t.id}" class="hidden" type="text" placeholder="Description (no site visit)" />
          <input data-no-visit-photo="${t.id}" class="hidden" type="file" accept="image/*" />
          <input data-manager-visit-desc="${t.id}" class="hidden" type="text" placeholder="Manager visit description" />
          <input data-manager-visit-photo="${t.id}" class="hidden" type="file" accept="image/*" />
          <select data-sales-manager="${t.id}" class="hidden">
            <option value="">Select Sales Manager</option>
            ${salesManagerOptions}
          </select>
        </div>
      </td>
      <td>
        <button class="btn small primary" data-accept-btn="${t.id}" style="margin-bottom: 4px;">Accept Task</button><br/>
        <button class="btn small secondary" data-decline-btn="${t.id}" style="margin-bottom: 4px;">Decline Task</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Show assign controls
  Array.from(tbody.querySelectorAll("button[data-show-assign]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-show-assign");
      Array.from(tbody.querySelectorAll("div[data-assign-box]")).forEach(div => {
        if (div.getAttribute("data-assign-box") !== id) div.classList.add("hidden");
      });
      const box = tbody.querySelector(`div[data-assign-box="${id}"]`);
      if (box) box.classList.toggle("hidden");
      const t = tickets.find(x => x.id === id);
      const visitSel = tbody.querySelector(`select[data-site-visit="${id}"]`);
      const visitBySelToggle = tbody.querySelector(`select[data-visit-by="${id}"]`);
      const qtInput = tbody.querySelector(`input[data-quotation-time="${id}"]`);
      const salesSel = tbody.querySelector(`select[data-sales-manager="${id}"]`);
      const noDesc = tbody.querySelector(`input[data-no-visit-desc="${id}"]`);
      const noPhoto = tbody.querySelector(`input[data-no-visit-photo="${id}"]`);
      const mgrDesc = tbody.querySelector(`input[data-manager-visit-desc="${id}"]`);
      const mgrPhoto = tbody.querySelector(`input[data-manager-visit-photo="${id}"]`);
      if (visitSel && qtInput) {
        const updateUI = () => {
          const v = visitSel.value;
          if (v === 'no') {
            qtInput.classList.remove('hidden');
            if (salesSel) salesSel.classList.remove('hidden');
            if (visitBySelToggle) visitBySelToggle.classList.add('hidden');
            if (noDesc) noDesc.classList.remove('hidden');
            if (noPhoto) noPhoto.classList.remove('hidden');
            if (mgrDesc) mgrDesc.classList.add('hidden');
            if (mgrPhoto) mgrPhoto.classList.add('hidden');
          } else if (v === 'yes') {
            qtInput.classList.add('hidden');
            qtInput.value = '';
            if (visitBySelToggle) visitBySelToggle.classList.remove('hidden');
            if (noDesc) { noDesc.classList.add('hidden'); noDesc.value = ''; }
            if (noPhoto) { noPhoto.classList.add('hidden'); noPhoto.value = ''; }
            const by = visitBySelToggle ? visitBySelToggle.value : '';
            if (by === 'manager') {
              if (salesSel) salesSel.classList.remove('hidden');
              if (mgrDesc) mgrDesc.classList.remove('hidden');
              if (mgrPhoto) mgrPhoto.classList.remove('hidden');
            } else {
              if (salesSel) salesSel.classList.add('hidden');
              if (mgrDesc) mgrDesc.classList.add('hidden');
              if (mgrPhoto) mgrPhoto.classList.add('hidden');
            }
          } else {
            qtInput.classList.add('hidden');
            if (salesSel) salesSel.classList.add('hidden');
            if (visitBySelToggle) visitBySelToggle.classList.add('hidden');
            if (noDesc) noDesc.classList.add('hidden');
            if (noPhoto) noPhoto.classList.add('hidden');
            if (mgrDesc) mgrDesc.classList.add('hidden');
            if (mgrPhoto) mgrPhoto.classList.add('hidden');
          }
        };
        visitSel.onchange = updateUI;
        if (visitBySelToggle) visitBySelToggle.onchange = updateUI;
        const postStage = !!(t && (t.salesApproved || t.managerSiteVisitDescription || t.noSiteVisitDescription || t.siteVisitStatus));
        if (postStage) {
          // After sales return or site visit done: do not ask site visit, show only employee select
          visitSel.classList.add('hidden');
          visitSel.value = '';
          if (visitBySelToggle) { visitBySelToggle.classList.add('hidden'); visitBySelToggle.value = ''; }
          if (qtInput) qtInput.classList.add('hidden');
          if (salesSel) salesSel.classList.add('hidden');
          if (noDesc) noDesc.classList.add('hidden');
          if (noPhoto) noPhoto.classList.add('hidden');
          if (mgrDesc) mgrDesc.classList.add('hidden');
          if (mgrPhoto) mgrPhoto.classList.add('hidden');
        } else {
          // Pre-sales: show everything by default
          visitSel.value = 'yes';
          if (visitBySelToggle) visitBySelToggle.value = 'manager';
          updateUI();
        }
      }
    };
  });

  // Approve button
  Array.from(tbody.querySelectorAll("button[data-approve-btn]")).forEach(btn => {
    btn.onclick = () => {
      btn.disabled = true;
      const ticketId = btn.getAttribute("data-approve-btn");
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      ticket.departmentApproved = true;
      ticket.departmentApprovedBy = currentUser.userId;
      logAction('manager','department_approve', ticket.id);
      if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Ticket approved by department manager.";
      renderPendingTicketsForManager();
      renderAdminAllTickets();
      updateStats();
    };
  });

  // Add event listeners
  Array.from(tbody.querySelectorAll("button[data-accept-btn]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-accept-btn");
      const ticket = tickets.find(t => t.id === ticketId);
      const box = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
      const alreadyVisited = !!(ticket && (ticket.siteVisitStatus || ticket.managerSiteVisitDescription || ticket.noSiteVisitDescription));
      const isPostSalesApproval = !!(ticket && ticket.salesApproved);
      if (box && box.classList.contains('hidden') && !alreadyVisited && !isPostSalesApproval) { openManagerVisitModal(ticketId); return; }
      if (box && box.classList.contains('hidden')) { box.classList.remove('hidden'); }
      const select = tbody.querySelector(`select[data-assign-ticket="${ticketId}"]`);
      const visitSel = tbody.querySelector(`select[data-site-visit="${ticketId}"]`);
      const visitBySel = tbody.querySelector(`select[data-visit-by="${ticketId}"]`);
      const salesSelForTicket = tbody.querySelector(`select[data-sales-manager="${ticketId}"]`);
      const empId = select ? select.value : '';
      ticket.departmentApproved = true;
      ticket.acceptedByManager = currentUser.userId;
      const treatAsPostSales = isPostSalesApproval || alreadyVisited;
      if (!treatAsPostSales) {
        if (!visitSel || !visitSel.value) {
          if ($("mgrActionErr")) $("mgrActionErr").textContent = "Please select Site Visit option.";
          return;
        }
        const siteVisit = visitSel.value === 'yes';
      const selectedSalesMgr = salesSelForTicket ? salesSelForTicket.value : '';
        if (siteVisit) {
          if (!visitBySel || !visitBySel.value) {
            if ($("mgrActionErr")) $("mgrActionErr").textContent = "Select who will visit (Manager/Employee).";
            return;
          }
          if (visitBySel.value === 'manager' || visitBySel.value === 'self') {
            const mgrDescEl = tbody.querySelector(`input[data-manager-visit-desc="${ticketId}"]`);
            const mgrPhotoEl = tbody.querySelector(`input[data-manager-visit-photo="${ticketId}"]`);
            const desc = mgrDescEl ? mgrDescEl.value.trim() : '';
            const file = mgrPhotoEl && mgrPhotoEl.files && mgrPhotoEl.files[0];
            if (!selectedSalesMgr) { if ($("mgrActionErr")) $("mgrActionErr").textContent = "Select a Sales Manager."; if (salesSelForTicket) salesSelForTicket.focus(); return; }
            if (!desc) { if ($("mgrActionErr")) $("mgrActionErr").textContent = "Enter manager visit description."; if (mgrDescEl) mgrDescEl.focus(); return; }
          const finalize = (photoName, photoData) => {
            ticket.acceptedByManager = currentUser.userId;
            ticket.siteVisitRequired = true;
            ticket.visitBy = 'Manager';
            ticket.managerSiteVisitDescription = desc;
            ticket.managerSiteVisitPhotoName = photoName || '';
            ticket.managerSiteVisitPhotoData = photoData || '';
            ticket.routeToSales = true;
            ticket.salesRequestedByManagerId = currentUser.userId;
            ticket.salesManagerId = selectedSalesMgr;
            ticket.assignedManagerIds = [selectedSalesMgr];
            ticket.status = "Pending Sales Approval";
            btn.disabled = true;
            const assignBox = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
            if (assignBox) assignBox.classList.add('hidden');
            logAction('manager','self_site_visit_and_route_sales', ticket.id);
            renderPendingTicketsForManager();
            renderSalesApprovalsForManager();
            renderAdminAllTickets();
            updateStats();
            if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Manager visit recorded and sent to Sales manager.";
          };
            if (file) {
              const reader = new FileReader();
              reader.onload = () => finalize(file.name, reader.result);
              reader.readAsDataURL(file);
            } else {
              finalize('', '');
            }
            return;
          }
          if (!empId) {
            const box = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
            if (box) box.classList.remove("hidden");
            if (select) select.focus();
            if ($("mgrActionErr")) $("mgrActionErr").textContent = "Please select an employee for site visit";
            return;
          }
          ticket.acceptedByManager = currentUser.userId;
          ticket.assignedEmployeeId = empId;
          ticket.siteVisitRequired = true;
          // Sales manager will be selected later after employee report
          const empIdx = employees.findIndex(e => e.id === empId);
          if (empIdx >= 0 && !employees[empIdx].managerId) {
            employees[empIdx].managerId = currentUser.userId;
          }
          ticket.status = "Assigned";
          btn.disabled = true;
          const assignBox = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
          if (assignBox) assignBox.classList.add('hidden');
          logAction('manager','assign_site_visit', ticket.id, `emp:${empId}`);
          renderPendingTicketsForManager();
          renderAssignedTicketsForManager();
          renderAdminAllTickets();
          renderEmployeeTicketsIfEmployeeLoggedIn();
          updateStats();
          if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Site visit assigned to employee.";
        } else {
          if (!selectedSalesMgr) { if ($("mgrActionErr")) $("mgrActionErr").textContent = "Select a Sales Manager."; if (salesSelForTicket) salesSelForTicket.focus(); return; }
          const qtInput = tbody.querySelector(`input[data-quotation-time="${ticketId}"]`);
          const qtVal = qtInput ? qtInput.value.trim() : '';
          const noDescEl = tbody.querySelector(`input[data-no-visit-desc="${ticketId}"]`);
          const noPhotoEl = tbody.querySelector(`input[data-no-visit-photo="${ticketId}"]`);
          const desc = noDescEl ? noDescEl.value.trim() : '';
          const file = noPhotoEl && noPhotoEl.files && noPhotoEl.files[0];
          if (!desc) { if ($("mgrActionErr")) $("mgrActionErr").textContent = "Enter description for no site visit."; if (noDescEl) noDescEl.focus(); return; }
          const finalizeNoVisit = (photoName, photoData) => {
            ticket.routeToSales = true;
            ticket.status = "Pending Sales Approval";
            ticket.siteVisitRequired = false;
            ticket.salesRequestedByManagerId = currentUser.userId;
            ticket.quotationTime = qtVal;
            ticket.noSiteVisitDescription = desc;
            ticket.noSiteVisitPhotoName = photoName || '';
            ticket.noSiteVisitPhotoData = photoData || '';
            ticket.salesManagerId = selectedSalesMgr;
            ticket.assignedManagerIds = [selectedSalesMgr];
            btn.disabled = true;
            const assignBox = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
            if (assignBox) assignBox.classList.add('hidden');
            logAction('manager','route_to_sales_no_visit', ticket.id, ticket.quotationTime || '');
            renderPendingTicketsForManager();
            renderSalesApprovalsForManager();
            renderAdminAllTickets();
            updateStats();
            if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Sent to Sales with description and image.";
          };
          if (file) {
            const reader = new FileReader();
            reader.onload = () => finalizeNoVisit(file.name, reader.result);
            reader.readAsDataURL(file);
          } else {
            finalizeNoVisit('', '');
          }
        }
      } else {
        if (!empId) {
          const box = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
          if (box) box.classList.remove("hidden");
          if (select) select.focus();
          if ($("mgrActionErr")) $("mgrActionErr").textContent = "Please select an employee first";
          return;
        }
        ticket.acceptedByManager = currentUser.userId;
        ticket.assignedEmployeeId = empId;
        ticket.siteVisitRequired = false;
        const empIdx = employees.findIndex(e => e.id === empId);
        if (empIdx >= 0 && !employees[empIdx].managerId) {
          employees[empIdx].managerId = currentUser.userId;
        }
        ticket.status = "Assigned";
        btn.disabled = true;
        const assignBox = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
        if (assignBox) assignBox.classList.add('hidden');
        logAction('manager','assign_after_sales_or_visit', ticket.id, `emp:${empId}`);
        renderPendingTicketsForManager();
        renderAssignedTicketsForManager();
        renderAdminAllTickets();
        renderEmployeeTicketsIfEmployeeLoggedIn();
        updateStats();
        if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Ticket assigned to employee.";
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-decline-btn]")).forEach(btn => {
    btn.onclick = () => {
      btn.disabled = true;
      const ticketId = btn.getAttribute("data-decline-btn");
      const ticket = tickets.find(t => t.id === ticketId);
      // Keep ticket pending for other managers in the group
      logAction('manager','decline_ticket', ticket.id);
      if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Declined. Other managers in the group will see it.";
      renderPendingTicketsForManager();
    };
  });

  Array.from(tbody.querySelectorAll("button[data-swap-btn]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-swap-btn");
      Array.from(tbody.querySelectorAll("div[data-swap-box]")).forEach(div => {
        if (div.getAttribute("data-swap-box") !== ticketId) div.classList.add("hidden");
      });
      const box = tbody.querySelector(`div[data-swap-box="${ticketId}"]`);
      if (box) box.classList.toggle("hidden");
      const ctSel = tbody.querySelector(`select[data-swap-calltype="${ticketId}"]`);
      const grpSel = tbody.querySelector(`select[data-swap-group="${ticketId}"]`);
      const populateGroups = () => {
        const ctVal = ctSel.value;
        const groupsForCt = callGroups.filter(g => g.callType === ctVal);
        grpSel.innerHTML = groupsForCt.map(g => `<option value="${g.id}">${g.name}</option>`).join("");
      };
      if (ctSel && grpSel) {
        ctSel.onchange = populateGroups;
        populateGroups();
      }
      const applyBtn = tbody.querySelector(`button[data-apply-swap="${ticketId}"]`);
      if (applyBtn) {
        applyBtn.onclick = () => {
          const ticket = tickets.find(t => t.id === ticketId);
          const newCt = ctSel.value;
          const newGrp = grpSel.value;
          ticket.callType = newCt;
          ticket.callGroup = newGrp;
          ticket.acceptedByManager = null;
          ticket.assignedEmployeeId = null;
          ticket.status = "Pending Assignment";
          const mgrIds = managers.filter(m => (m.assignedGroups || []).includes(newGrp)).map(m => m.id);
          ticket.assignedManagerIds = mgrIds;
          logAction('manager','swap_department', ticket.id, `${newCt}/${newGrp}`);
          renderPendingTicketsForManager();
          renderAssignedTicketsForManager();
          renderAdminAllTickets();
          updateStats();
        };
      }
    };
  });
  attachColumnSelectorForTable('pendingTicketsTableBody', getDefaultVisibleColumns('pendingTicketsTableBody'));
  applyColumnVisibility('pendingTicketsTableBody');
}

function openManagerVisitModal(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  ticket.departmentApproved = true;
  ticket.acceptedByManager = currentUser.userId;
  let modal = document.getElementById('managerVisitModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'managerVisitModal';
    modal.className = 'modal';
    const inner = document.createElement('div');
    inner.id = 'managerVisitContent';
    inner.style.padding = '20px';
    inner.style.background = 'rgba(25,25,25,0.95)';
    inner.style.borderRadius = '12px';
    inner.style.maxWidth = '520px';
    inner.style.margin = '60px auto';
    inner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
    inner.innerHTML = `
      <h3 style="color:#e84c3d; margin:0 0 12px 0;">Manager Action</h3>
      <div style="color:rgba(255,255,255,0.85); margin-bottom:10px;">${ticket.id} • ${ticket.customerName}</div>
      <div style="display:grid; gap:10px;">
        <label style="color:rgba(255,255,255,0.75);">Site Visit?</label>
        <div>
          <select id="mvSiteVisit" style="width:100%">
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div id="mvVisitByWrap" class="hidden">
          <label style="color:rgba(255,255,255,0.75);">Who will visit?</label>
          <select id="mvVisitBy" style="width:100%">
            <option value="">Select</option>
            <option value="self">Self (Manager)</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <div id="mvMgrFields" class="hidden">
          <input id="mvMgrDesc" type="text" placeholder="Manager visit description" style="width:100%" />
          <input id="mvMgrPhoto" type="file" accept="image/*" />
          <select id="mvSalesMgr" style="width:100%"><option value="">Select Sales Manager</option></select>
        </div>
        <div id="mvEmpFields" class="hidden">
          <select id="mvEmpSelect" style="width:100%"><option value="">Select Employee</option></select>
          <select id="mvSalesMgrEmp" style="width:100%"><option value="">Select Sales Manager (optional)</option></select>
        </div>
        <div id="mvNoVisitFields" class="hidden">
          <input id="mvNoDesc" type="text" placeholder="Description (no site visit)" style="width:100%" />
          <input id="mvNoPhoto" type="file" accept="image/*" />
          <input id="mvQt" type="text" placeholder="Quotation / time needed (e.g., 2 days)" style="width:100%" />
          <select id="mvSalesMgrNo" style="width:100%"><option value="">Select Sales Manager</option></select>
        </div>
        <div id="managerVisitErr" style="color:#ff6666; min-height:18px;"></div>
        <div id="managerVisitMsg" style="color:#66cc66; min-height:18px;"></div>
        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
          <button class="btn small secondary" id="mvCancel">Cancel</button>
          <button class="btn small primary" id="mvConfirm">Confirm</button>
        </div>
      </div>
    `;
    modal.appendChild(inner);
    document.body.appendChild(modal);
  }
  const salesMgrs = managers.filter(m => (m.assignedDepartments || []).some(d => (d || '').toLowerCase() === 'sales'));
  const salesOpts = salesMgrs.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  const mvSalesMgr = document.getElementById('mvSalesMgr');
  const mvSalesMgrNo = document.getElementById('mvSalesMgrNo');
  if (mvSalesMgr) mvSalesMgr.innerHTML = `<option value="">Select Sales Manager</option>` + salesOpts;
  if (mvSalesMgrNo) mvSalesMgrNo.innerHTML = `<option value="">Select Sales Manager</option>` + salesOpts;
  const myManagerId = currentUser.userId;
  const candidates = employees.filter(e => e.managerId === myManagerId || !e.managerId);
  const mvEmpSelect = document.getElementById('mvEmpSelect');
  if (mvEmpSelect) mvEmpSelect.innerHTML = `<option value="">Select Employee</option>` + candidates.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  const mvSalesMgrEmp = document.getElementById('mvSalesMgrEmp');
  if (mvSalesMgrEmp) mvSalesMgrEmp.innerHTML = `<option value="">Select Sales Manager (optional)</option>` + salesOpts;
  const mvSiteVisit = document.getElementById('mvSiteVisit');
  const mvVisitByWrap = document.getElementById('mvVisitByWrap');
  const mvVisitBy = document.getElementById('mvVisitBy');
  const mvMgrFields = document.getElementById('mvMgrFields');
  const mvEmpFields = document.getElementById('mvEmpFields');
  const mvNoVisitFields = document.getElementById('mvNoVisitFields');
  const err = document.getElementById('managerVisitErr');
  const msg = document.getElementById('managerVisitMsg');
  err.textContent = '';
  msg.textContent = '';
  const toggle = () => {
    const v = mvSiteVisit ? mvSiteVisit.value : '';
    mvVisitByWrap.classList.toggle('hidden', v !== 'yes');
    mvMgrFields.classList.add('hidden');
    mvEmpFields.classList.add('hidden');
    mvNoVisitFields.classList.add('hidden');
    if (v === 'no') mvNoVisitFields.classList.remove('hidden');
    if (v === 'yes') {
      const by = mvVisitBy ? mvVisitBy.value : '';
      if (by === 'self') mvMgrFields.classList.remove('hidden');
      if (by === 'employee') mvEmpFields.classList.remove('hidden');
    }
  };
  if (mvSiteVisit) mvSiteVisit.onchange = toggle;
  if (mvVisitBy) mvVisitBy.onchange = toggle;
  toggle();
  modal.classList.remove('hidden');
  const cancel = document.getElementById('mvCancel');
  const confirm = document.getElementById('mvConfirm');
  if (cancel) cancel.onclick = () => { modal.classList.add('hidden'); };
  if (confirm) confirm.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    const v = mvSiteVisit ? mvSiteVisit.value : '';
    if (!v) { err.textContent = 'Select Site Visit option.'; return; }
    if (v === 'no') {
      const qtVal = document.getElementById('mvQt').value.trim();
      const desc = document.getElementById('mvNoDesc').value.trim();
      const fileInput = document.getElementById('mvNoPhoto');
      const file = fileInput && fileInput.files && fileInput.files[0];
      const salesSel = document.getElementById('mvSalesMgrNo');
      const selectedSalesMgr = salesSel ? salesSel.value : '';
      if (!selectedSalesMgr) { err.textContent = 'Select a Sales Manager.'; return; }
      if (!desc) { err.textContent = 'Enter description for no site visit.'; return; }
      const finalize = (photoName, photoData) => {
        ticket.routeToSales = true;
        ticket.status = 'Pending Sales Approval';
        ticket.siteVisitRequired = false;
        ticket.salesRequestedByManagerId = currentUser.userId;
        ticket.quotationTime = qtVal;
        ticket.noSiteVisitDescription = desc;
        ticket.noSiteVisitPhotoName = photoName || '';
        ticket.noSiteVisitPhotoData = photoData || '';
        ticket.salesManagerId = selectedSalesMgr;
        ticket.assignedManagerIds = [selectedSalesMgr];
        logAction('manager','route_to_sales_no_visit', ticket.id, ticket.quotationTime || '');
        renderPendingTicketsForManager();
        renderSalesApprovalsForManager();
        renderAdminAllTickets();
        updateStats();
        msg.textContent = 'Sent to Sales with description and image.';
        modal.classList.add('hidden');
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = () => finalize(file.name, reader.result);
        reader.readAsDataURL(file);
      } else {
        finalize('', '');
      }
      return;
    }
    const by = mvVisitBy ? mvVisitBy.value : '';
    if (!by) { err.textContent = 'Select who will visit.'; return; }
    if (by === 'self') {
      const desc = document.getElementById('mvMgrDesc').value.trim();
      const photoInput = document.getElementById('mvMgrPhoto');
      const file = photoInput && photoInput.files && photoInput.files[0];
      const salesSel = document.getElementById('mvSalesMgr');
      const selectedSalesMgr = salesSel ? salesSel.value : '';
      if (!selectedSalesMgr) { err.textContent = 'Select a Sales Manager.'; return; }
      if (!desc) { err.textContent = 'Enter manager visit description.'; return; }
      const finalize = (photoName, photoData) => {
        ticket.siteVisitRequired = true;
        ticket.visitBy = 'Manager';
        ticket.managerSiteVisitDescription = desc;
        ticket.managerSiteVisitPhotoName = photoName || '';
        ticket.managerSiteVisitPhotoData = photoData || '';
        ticket.routeToSales = true;
        ticket.salesRequestedByManagerId = currentUser.userId;
        ticket.salesManagerId = selectedSalesMgr;
        ticket.assignedManagerIds = [selectedSalesMgr];
        ticket.status = 'Pending Sales Approval';
        logAction('manager','self_site_visit_and_route_sales', ticket.id);
        renderPendingTicketsForManager();
        renderSalesApprovalsForManager();
        renderAdminAllTickets();
        updateStats();
        msg.textContent = 'Manager visit recorded and sent to Sales manager.';
        modal.classList.add('hidden');
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = () => finalize(file.name, reader.result);
        reader.readAsDataURL(file);
      } else {
        finalize('', '');
      }
      return;
    }
    if (by === 'employee') {
      const empId = mvEmpSelect ? mvEmpSelect.value : '';
      if (!empId) { err.textContent = 'Select an employee for site visit.'; return; }
      const selectedSalesMgrEmp = mvSalesMgrEmp ? mvSalesMgrEmp.value : '';
      ticket.assignedEmployeeId = empId;
      ticket.siteVisitRequired = true;
      ticket.preselectedSalesManagerId = selectedSalesMgrEmp || '';
      const empIdx = employees.findIndex(e => e.id === empId);
      if (empIdx >= 0 && !employees[empIdx].managerId) employees[empIdx].managerId = myManagerId;
      ticket.status = 'Assigned';
      logAction('manager','assign_site_visit', ticket.id, `emp:${empId}`);
      renderPendingTicketsForManager();
      renderAssignedTicketsForManager();
      renderAdminAllTickets();
      renderEmployeeTicketsIfEmployeeLoggedIn();
      updateStats();
      msg.textContent = selectedSalesMgrEmp ? 'Site visit assigned. Sales manager preselected.' : 'Site visit assigned to employee.';
      modal.classList.add('hidden');
      return;
    }
  };
}

/* Admin Master Control Center Functions */
function setupAdminTabNavigation() {
  const navButtons = document.querySelectorAll(".admin-nav-tab");
  navButtons.forEach(btn => {
    btn.onclick = () => {
      const tabName = btn.getAttribute("data-tab");
      
      // Hide all tabs
      document.querySelectorAll(".admin-tab-content").forEach(tab => {
        tab.classList.add("hidden");
      });
      
      // Remove active class from all buttons
      navButtons.forEach(b => b.classList.remove("active"));
      
      // Show selected tab
      const tabElement = $(`adminTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
      if (tabElement) {
        tabElement.classList.remove("hidden");
      }
      
      // Add active class to clicked button
      btn.classList.add("active");
      
      // Refresh data for tab
      refreshAdminTabData(tabName);
    };
  });
}

function refreshAdminTabData(tabName) {
  switch(tabName) {
    case "employees":
      renderAdminEmployees();
      break;
    // case "managers":
    //   renderAdminManagers();
    //   break;
    // case "groups":
    //   renderAdminCallGroups();
    //   break;
    case 'managersGroups':  // NEW: combined tab
      renderAdminManagers();
      renderAdminCallGroups();
      break;
    case "managerEmployees":
      renderAdminManagerEmployees();
      break;
    case "otherEmployees":
      renderAdminOtherEmployees();
      break;
    case "customers":
      renderAdminCustomers();
      break;
    case "tickets":
      renderAdminAllTickets();
      break;
    case "reports":
      renderAdminReports();
      break;
    case "admins":
      renderAdminAdmins();
      break;
  }
}

function renderAdminManagerEmployees() {
  const mgrSel = $("hireMgrSelect");
  const empSel = $("hireEmpSelect");
  const tableBody = $("managerEmployeesTableBody");
  if (mgrSel) {
    mgrSel.innerHTML = '<option value="">-- Select Manager --</option>' + managers.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  }
  if (empSel) {
    empSel.innerHTML = '<option value="">-- Select Employee --</option>' + employees.filter(e => !e.managerId).map(e => `<option value="${e.id}">${e.name} (${e.id})</option>`).join('');
  }
  if (tableBody) {
    tableBody.innerHTML = '';
    managers.forEach(m => {
      const size = employees.filter(e => e.managerId === m.id).length;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${m.id}</td><td>${m.name}</td><td>${size}</td>`;
      tableBody.appendChild(tr);
    });
  }
}

function setupAdminManagerEmployees() {
  const modeExisting = $("hireModeExisting");
  const modeNew = $("hireModeNew");
  const existingBox = $("hireExistingBox");
  const newBox = $("hireNewBox");
  const hireBtn = $("hireEmployeeBtn");
  const refreshBtn = $("refreshHireDataBtn");

  const toggle = () => {
    const isNew = modeNew && modeNew.checked;
    if (existingBox) existingBox.classList.toggle('hidden', !!isNew);
    if (newBox) newBox.classList.toggle('hidden', !isNew);
  };
  if (modeExisting) modeExisting.onchange = toggle;
  if (modeNew) modeNew.onchange = toggle;

  if (refreshBtn) refreshBtn.onclick = () => renderAdminManagerEmployees();

  if (hireBtn) {
    hireBtn.onclick = () => {
      const mgrId = $("hireMgrSelect").value;
      $("hireErr").textContent = '';
      $("hireMsg").textContent = '';
      if (!mgrId) { $("hireErr").textContent = 'Select a manager'; return; }
      if (modeExisting && modeExisting.checked) {
        const empId = $("hireEmpSelect").value;
        if (!empId) { $("hireErr").textContent = 'Select an employee'; return; }
        const idx = employees.findIndex(e => e.id === empId);
        if (idx >= 0) {
          employees[idx].managerId = mgrId;
          $("hireMsg").textContent = `Assigned ${employees[idx].name} to manager`;
        }
      } else {
        const name = $("hireEmpName").value.trim();
        const email = $("hireEmpEmail").value.trim();
        const phone = $("hireEmpPhone").value.trim();
        const password = $("hireEmpPassword").value;
        if (!name || !email || !phone || !password) { $("hireErr").textContent = 'All fields are required'; return; }
        const newId = "E" + (employees.length + 1).toString().padStart(3, "0");
        employees.push({ id: newId, name, email, phone, password, role: 'employee', managerId: mgrId });
        $("hireMsg").textContent = `Hired ${name} and assigned to manager`;
        $("hireEmpName").value = '';
        $("hireEmpEmail").value = '';
        $("hireEmpPhone").value = '';
        $("hireEmpPassword").value = '';
      }
      renderAdminManagerEmployees();
      updateAdminStats();
      renderAdminEmployees();
    };
  }
}

function renderManagerEmployeesBox() {
  const select = $("managerEmployeesSelect");
  const list = $("managerEmployeesList");
  if (select) {
    select.innerHTML = '';
    const myId = currentUser.userId;
    employees
      .filter(e => e.managerId === myId)
      .forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `${e.id} - ${e.name} (${e.phone || '-'})`;
        select.appendChild(opt);
      });
  }
  if (list) {
    list.innerHTML = '';
    employees
      .filter(e => e.managerId === currentUser.userId)
      .forEach(e => {
        const li = document.createElement('li');
        li.style.cssText = 'padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1);';
        li.textContent = `${e.name} • ${e.phone || '-'} • ${e.id}`;
        list.appendChild(li);
      });
  }
}

function updateAdminStats() {
  $("statTotalEmployees").textContent = employees.length;
  $("statTotalManagers").textContent = managers.length;
  $("statTotalTickets").textContent = tickets.length;
  $("statPendingTickets").textContent = tickets.filter(t => t.status !== "Finished" && t.status !== "Reported").length;
  $("statCompletedTickets").textContent = tickets.filter(t => t.status === "Finished" || t.status === "Reported").length;
  $("statTotalGroups").textContent = departmentsList.length;
}

// EMPLOYEES MANAGEMENT
function renderAdminEmployees() {
  const tbody = $("employeesTableBody");
  tbody.innerHTML = "";
  const perms = getCurrentAdminPerms();

  employees.forEach(e => {
    const assignedTickets = tickets.filter(t => t.assignedEmployeeId === e.id).length;
    const mgrName = e.managerId ? (managers.find(m => m.id === e.managerId)?.name || '-') : '-';
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.name}</td>
      <td>${e.email}</td>
      <td>${e.phone || '-'}</td>
      <td>${mgrName}</td>
      <td><span style="background: rgba(255,165,0,0.2); padding: 4px 8px; border-radius: 4px;">${assignedTickets}</span></td>
      <td>
        ${perms.canEdit ? `<button class="btn small primary" data-edit-emp="${e.id}">Edit</button>` : ''}
        ${perms.canDelete ? `<button class="btn small secondary" data-delete-emp="${e.id}">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-delete-emp]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-delete-emp");
      if (confirm("Delete this employee? All assigned tickets will be unassigned.")) {
        const index = employees.findIndex(e => e.id === id);
        if (index >= 0) {
          employees.splice(index, 1);
          tickets.forEach(t => {
            if (t.assignedEmployeeId === id) t.assignedEmployeeId = null;
          });
          renderAdminEmployees();
          updateAdminStats();
        }
      }
    };
  });

  // Edit employee
  Array.from(tbody.querySelectorAll("button[data-edit-emp]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-emp");
      const emp = employees.find(e => e.id === id);
      if (!emp) return;
      const form = $("addEmployeeForm");
      form.classList.remove("hidden");
      form.dataset.editId = id;
      $("empName").value = emp.name;
      $("empEmail").value = emp.email;
      if ($("empPhone")) $("empPhone").value = emp.phone || "";
      $("empPassword").value = emp.password || "";
      const mgrSel = $("empManager");
      if (mgrSel) {
        mgrSel.innerHTML = '<option value="">-- Select Manager --</option>' + managers.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        mgrSel.value = emp.managerId || "";
      }
      $("empAddMsg").textContent = "";
      $("empAddErr").textContent = "";
    };
  });
}

function setupEmployeeForm() {
  const addBtn = $("adminAddEmployeeBtn");
  const form = $("addEmployeeForm");
  const saveBtn = $("saveEmployeeBtn");
  const cancelBtn = $("cancelEmployeeBtn");

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove("hidden");
      $("empName").value = "";
      $("empEmail").value = "";
      $("empDept").value = "";
      $("empPassword").value = "";
      const mgrSel = $("empManager");
      if (mgrSel) {
        mgrSel.innerHTML = '<option value="">-- Select Manager --</option>' + managers.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
      }
      $("empAddMsg").textContent = "";
      $("empAddErr").textContent = "";
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add("hidden");
    };
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = $("empName").value.trim();
      const email = $("empEmail").value.trim();
      const phone = $("empPhone") ? $("empPhone").value.trim() : '';
      const password = $("empPassword").value;
      const managerId = $("empManager") ? $("empManager").value : "";
      const editId = $("addEmployeeForm").dataset.editId;

      $("empAddErr").textContent = "";
      $("empAddMsg").textContent = "";

      if (!name || !email || !phone || !password) {
        $("empAddErr").textContent = "All fields are required";
        return;
      }

      if (editId) {
        const idx = employees.findIndex(e => e.id === editId);
        if (idx >= 0) {
          employees[idx].name = name;
          employees[idx].email = email;
          employees[idx].phone = phone;
          employees[idx].password = password;
          employees[idx].managerId = managerId || null;
  $("empAddMsg").textContent = `Employee ${name} updated successfully!`;
          setTimeout(() => {
            form.classList.add("hidden");
            form.dataset.editId = "";
            renderAdminEmployees();
            updateAdminStats();
          }, 1500);
          return;
        }
      }

      const newId = "E" + (employees.length + 1).toString().padStart(3, "0");
      employees.push({
        id: newId,
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: "employee",
        managerId: managerId || null
      });

  $("empAddMsg").textContent = `Employee ${name} added successfully!`;
      setTimeout(() => {
        form.classList.add("hidden");
        form.dataset.editId = "";
        renderAdminEmployees();
        updateAdminStats();
      }, 1500);
    };
  }
}

// MANAGERS MANAGEMENT
function renderAdminManagers() {
  const tbody = $("managersTableBody");
  tbody.innerHTML = "";
  const perms = getCurrentAdminPerms();

  managers.forEach(m => {
    const deptNames = (m.assignedDepartments || []).join(", ") || "No departments";

    const pendingTickets = tickets.filter(t => 
      t.assignedManagerIds && t.assignedManagerIds.includes(m.id) && t.status === "Pending Assignment"
    ).length;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.name}</td>
      <td>${m.email}</td>
      <td>${m.phone || '-'}</td>
      <td><span style="background: rgba(135,206,235,0.2); padding: 4px 8px; border-radius: 4px;">${deptNames}</span></td>
      <td><span style="background: rgba(255,107,107,0.2); padding: 4px 8px; border-radius: 4px;">${pendingTickets}</span></td>
      <td>
        ${perms.canEdit ? `<button class="btn small primary" data-edit-mgr="${m.id}">Edit</button>` : ''}
        ${perms.canDelete ? `<button class="btn small secondary" data-delete-mgr="${m.id}">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-delete-mgr]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-delete-mgr");
      if (confirm("Delete this manager? They will be removed from all assigned groups.")) {
        const index = managers.findIndex(m => m.id === id);
        if (index >= 0) {
          managers.splice(index, 1);
          renderAdminManagers();
          updateAdminStats();
        }
      }
    };
  });

  // Edit manager
  Array.from(tbody.querySelectorAll("button[data-edit-mgr]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-mgr");
      const mgr = managers.find(m => m.id === id);
      if (!mgr) return;
      const form = addManagerForm;
      form.classList.remove('hidden');
      form.dataset.editId = id;
      mgrName.value = mgr.name;
      mgrEmail.value = mgr.email;
      if (typeof mgrPhone !== 'undefined') mgrPhone.value = mgr.phone || '';
      mgrPassword.value = mgr.password || '';
      populateManagerCallGroupsDropdown();
      Array.from(mgrCallGroupDropdown.options).forEach(opt => {
        opt.selected = (mgr.assignedDepartments || []).includes(opt.value);
      });
      mgrAddMsg.textContent = '';
      mgrAddErr.textContent = '';
    };
  });
}

// ADMINS MANAGEMENT
function renderAdminAdmins() {
  const tbody = $("adminsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  admins.forEach(a => {
    const tr = document.createElement("tr");
    const permBadge = `<span style="background: rgba(135,206,235,0.2); padding: 4px 8px; border-radius: 4px;">${a.permissions?.canEdit ? 'Edit' : 'View'}</span> ` +
                      `<span style="background: rgba(255,107,107,0.2); padding: 4px 8px; border-radius: 4px;">${a.permissions?.canDelete ? 'Delete' : 'No Delete'}</span>`;
    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${a.name}</td>
      <td>${a.email}</td>
      <td>${a.username}</td>
      <td>${permBadge}</td>
      <td>
        <button class="btn small primary" data-edit-admin="${a.id}">Edit</button>
        <button class="btn small secondary" data-delete-admin="${a.id}">Delete</button>
        <div data-confirm-delete="${a.id}" class="hidden" style="margin-top:6px; display:flex; gap:6px; align-items:center;">
          <span>Confirm delete?</span>
          <button class="btn small primary" data-confirm-delete-yes="${a.id}">Yes</button>
          <button class="btn small secondary" data-confirm-delete-no="${a.id}">No</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-delete-admin]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-delete-admin");
      const admin = admins.find(x => x.id === id);
      if (!admin) return;
      if (currentUser && currentUser.role === 'admin' && (admin.username === currentUser.username)) {
        const el = $("adminActionErr") || $("adminAddErr") || $("empAddErr") || $("groupAddErr");
        if (el) el.textContent = "Cannot delete the currently logged-in admin.";
        return;
      }
      Array.from(tbody.querySelectorAll("div[data-confirm-delete]")).forEach(div => {
        if (div.getAttribute("data-confirm-delete") !== id) div.classList.add("hidden");
      });
      const box = tbody.querySelector(`div[data-confirm-delete="${id}"]`);
      if (box) box.classList.toggle("hidden");
    };
  });

  Array.from(tbody.querySelectorAll("button[data-confirm-delete-yes]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-confirm-delete-yes");
      const index = admins.findIndex(x => x.id === id);
      if (index >= 0) {
        admins.splice(index, 1);
        renderAdminAdmins();
        const msg = $("adminActionMsg");
        if (msg) msg.textContent = "Admin deleted.";
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-confirm-delete-no]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-confirm-delete-no");
      const box = tbody.querySelector(`div[data-confirm-delete="${id}"]`);
      if (box) box.classList.add("hidden");
    };
  });

  Array.from(tbody.querySelectorAll("button[data-edit-admin]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-admin");
      const a = admins.find(x => x.id === id);
      if (!a) return;
      const form = $("addAdminForm");
      form.classList.remove("hidden");
      form.dataset.editId = id;
      $("admName").value = a.name || "";
      $("admEmail").value = a.email || "";
      $("admUsername").value = a.username || "";
      $("admPassword").value = a.password || "";
      $("admCanEdit").checked = !!(a.permissions && a.permissions.canEdit);
      $("admCanDelete").checked = !!(a.permissions && a.permissions.canDelete);
      $("adminAddMsg").textContent = "";
      $("adminAddErr").textContent = "";
    };
  });
}

function setupAdminAdminForm() {
  const addBtn = $("adminAddAdminBtn");
  const form = $("addAdminForm");
  const saveBtn = $("saveAdminBtn");
  const cancelBtn = $("cancelAdminBtn");

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove("hidden");
      form.dataset.editId = "";
      $("admName").value = "";
      $("admEmail").value = "";
      $("admUsername").value = "";
      $("admPassword").value = "";
      $("admCanEdit").checked = true;
      $("admCanDelete").checked = true;
      $("adminAddMsg").textContent = "";
      $("adminAddErr").textContent = "";
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add("hidden");
    };
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = $("admName").value.trim();
      const email = $("admEmail").value.trim();
      const username = $("admUsername").value.trim();
      const password = $("admPassword").value;
      const canEdit = $("admCanEdit").checked;
      const canDelete = $("admCanDelete").checked;
      const editId = $("addAdminForm").dataset.editId;

      $("adminAddErr").textContent = "";
      $("adminAddMsg").textContent = "";

      if (!name || !email || !username || !password) {
        $("adminAddErr").textContent = "All fields are required.";
        return;
      }
      if (!email.includes("@")) {
        $("adminAddErr").textContent = "Enter a valid email.";
        return;
      }
      const emailExists = admins.some(a => a.email.toLowerCase() === email.toLowerCase());
      const usernameExists = admins.some(a => a.username.toLowerCase() === username.toLowerCase() && a.id !== editId);
      if (!editId && (emailExists || usernameExists)) {
        $("adminAddErr").textContent = "Admin with this email/username already exists.";
        return;
      }

      if (editId) {
        const idx = admins.findIndex(a => a.id === editId);
        if (idx >= 0) {
          admins[idx].name = name;
          admins[idx].email = email;
          admins[idx].username = username;
          admins[idx].password = password;
          admins[idx].permissions = { canEdit, canDelete };
          $("adminAddMsg").textContent = `Admin ${name} updated successfully!`;
          setTimeout(() => {
            form.classList.add("hidden");
            form.dataset.editId = "";
            renderAdminAdmins();
          }, 1200);
          return;
        }
      }

      const newId = 'A' + (admins.length + 1).toString().padStart(3, '0');
      admins.push({ id: newId, name, email, username, password, role: 'admin', permissions: { canEdit, canDelete } });
      $("adminAddMsg").textContent = `Admin ${name} added successfully!`;
      setTimeout(() => {
        form.classList.add("hidden");
        form.dataset.editId = "";
        renderAdminAdmins();
      }, 1200);
    };
  }
}

function applyAdminPermissionUI() {
  const perms = getCurrentAdminPerms();
  if (!perms.canEdit) {
    [
      "adminAddEmployeeBtn",
      "adminAddManagerBtn",
      "adminAddGroupBtn",
      "adminAddCompanyBtn",
      "adminAddCustomerBtn",
      "adminAddAdminBtn"
    ].forEach(id => { const el = $(id); if (el && el.classList) el.classList.add("hidden"); });
  }
}

// function setupManagerForm() {
//   const addBtn = $("adminAddManagerBtn");
//   const form = $("addManagerForm");
//   const saveBtn = $("saveManagerBtn");
//   const cancelBtn = $("cancelManagerBtn");

//   if (addBtn) {
//     addBtn.onclick = () => {
//       form.classList.remove("hidden");
//       $("mgrName").value = "";
//       $("mgrEmail").value = "";
//       $("mgrPassword").value = "";
//       populateManagerCallGroupsCheckbox();
//       $("mgrAddMsg").textContent = "";
//       $("mgrAddErr").textContent = "";
//     };
//   }

//   if (cancelBtn) {
//     cancelBtn.onclick = () => {
//       form.classList.add("hidden");
//     };
//   }

//   if (saveBtn) {
//     saveBtn.onclick = () => {
//       const name = $("mgrName").value.trim();
//       const email = $("mgrEmail").value.trim();
//       const password = $("mgrPassword").value;
//       const selectedGroups = Array.from(document.querySelectorAll("#mgrCallGroupsCheckbox input:checked"))
//         .map(cb => cb.value);

//       $("mgrAddErr").textContent = "";
//       $("mgrAddMsg").textContent = "";

//       if (!name || !email || !password) {
//         $("mgrAddErr").textContent = "Name, email and password are required";
//         return;
//       }

//       if (selectedGroups.length === 0) {
//         $("mgrAddErr").textContent = "Please select at least one call group";
//         return;
//       }

//       const newId = "M" + (managers.length + 1).toString().padStart(3, "0");
//       managers.push({
//         id: newId,
//         name: name,
//         email: email,
//         password: password,
//         role: "manager",
//         username: `mgr_${name.toLowerCase().replace(" ", "_").substring(0, 10)}`,
//         assignedGroups: selectedGroups
//       });

      // $("mgrAddMsg").textContent = `Manager ${name} added successfully!`;
//       setTimeout(() => {
//         form.classList.add("hidden");
//         renderAdminManagers();
//         updateAdminStats();
//       }, 1500);
//     };
//   }
// }

function setupManagerForm() {
  const addBtn = adminAddManagerBtn;
  const form = addManagerForm;
  const saveBtn = saveManagerBtn;
  const cancelBtn = cancelManagerBtn;

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove('hidden');
      mgrName.value = '';
      mgrEmail.value = '';
      if (typeof mgrPhone !== 'undefined') mgrPhone.value = '';
      mgrPassword.value = '';
      mgrCallGroupDropdown.value = '';
      // Reset custom UI
      const menu = $("mgrGroupsMenu");
      const toggle = $("mgrGroupsToggle");
      if (menu) menu.classList.add('hidden');
      if (toggle) toggle.textContent = '-- Select Departments --';
      mgrAddMsg.textContent = '';
      mgrAddErr.textContent = '';
      populateManagerCallGroupsDropdown(); // Populate dropdown when form opens
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add('hidden');
    };
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = mgrName.value.trim();
      const email = mgrEmail.value.trim();
      const phone = (typeof mgrPhone !== 'undefined' && mgrPhone.value) ? mgrPhone.value.trim() : '';
      const password = mgrPassword.value;
      
      const selectedOptions = Array.from(mgrCallGroupDropdown.selectedOptions);
      const selectedDepartments = selectedOptions.map(opt => opt.value);

      mgrAddErr.textContent = '';
      mgrAddMsg.textContent = '';

      if (!name || !email || !phone || !password) {
        mgrAddErr.textContent = 'Name, email, phone and password are required';
        return;
      }

      if (selectedDepartments.length === 0) {
        mgrAddErr.textContent = 'Please select at least one department';
        return;
      }

      const editId = addManagerForm.dataset.editId;
      if (editId) {
        const idx = managers.findIndex(m => m.id === editId);
        if (idx >= 0) {
          managers[idx].name = name;
          managers[idx].email = email;
          managers[idx].phone = phone;
          managers[idx].password = password;
          managers[idx].assignedDepartments = selectedDepartments;

          // Reflect selection in custom UI button
          const toggle = $("mgrGroupsToggle");
          if (toggle) toggle.textContent = selectedDepartments.length ? `${selectedDepartments.length} department(s) selected` : '-- Select Departments --';
          mgrAddMsg.textContent = `Manager ${name} updated successfully!`;
          setTimeout(() => {
            form.classList.add('hidden');
            form.dataset.editId = '';
            renderAdminManagers();
            updateAdminStats();
          }, 1500);
          return;
        }
      }

      const newId = 'M' + (managers.length + 1).toString().padStart(3, '0');
      managers.push({
        id: newId,
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: 'manager',
        username: 'mgr_' + name.toLowerCase().replace(' ', '_').substring(0, 10),
        assignedDepartments: selectedDepartments
      });
      const toggle = $("mgrGroupsToggle");
      if (toggle) toggle.textContent = selectedDepartments.length ? `${selectedDepartments.length} department(s) selected` : '-- Select Departments --';
      mgrAddMsg.textContent = `Manager ${name} added successfully!`;
      setTimeout(() => {
        form.classList.add('hidden');
        form.dataset.editId = '';
        renderAdminManagers();
        updateAdminStats();
      }, 1500);
    };
  }
}


// function populateManagerCallGroupsCheckbox() {
//   const container = mgrCallGroupsCheckbox;
//   container.innerHTML = '';

//   callGroups.forEach(g => {
//     const label = document.createElement('label');
//     label.style.cssText =
//       'display:inline-flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(255,255,255,0.35);border-radius:999px;cursor:pointer;';

//     label.innerHTML =
//       `<input type="checkbox" value="${g.id}">` +
//       `<span style="margin-left:8px;font-size:13px;color:#232f49;font-weight:600;">` +
//       `${g.name} (${g.callType})` +
//       `</span>`;

//     container.appendChild(label);
//   });
// }

function populateManagerCallGroupsDropdown() {
  const select = mgrCallGroupDropdown;
  const optionsContainer = $("mgrGroupsOptions");
  const toggleBtn = $("mgrGroupsToggle");
  const menu = $("mgrGroupsMenu");

  if (select) {
    select.innerHTML = '<option value="">-- Select Departments --</option>';
  }
  if (optionsContainer) optionsContainer.innerHTML = '';

  departmentsList.forEach(d => {
    if (select) {
      const option = document.createElement('option');
      option.value = d;
      option.textContent = d;
      select.appendChild(option);
    }
    if (optionsContainer) {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${d}"> <span>${d}</span>`;
      optionsContainer.appendChild(label);
    }
  });

  if (toggleBtn && menu) {
    toggleBtn.onclick = () => menu.classList.toggle('hidden');
  }

  const applyBtn = $("mgrGroupsApplyBtn");
  const cancelBtn = $("mgrGroupsCancelBtn");
  if (applyBtn && select) {
    applyBtn.onclick = () => {
      // Sync checked boxes to hidden select
      const checked = Array.from(optionsContainer.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
      Array.from(select.options).forEach(opt => {
        opt.selected = checked.includes(opt.value);
      });
      // Update button label
      $("mgrGroupsToggle").textContent = checked.length ? `${checked.length} department(s) selected` : '-- Select Departments --';
      if (menu) menu.classList.add('hidden');
    };
  }
  if (cancelBtn && menu) {
    cancelBtn.onclick = () => menu.classList.add('hidden');
  }
}



// CALL GROUPS MANAGEMENT
function renderAdminCallGroups() {
  const tbody = $("callGroupsTableBody");
  tbody.innerHTML = "";
  const perms = getCurrentAdminPerms();

  callGroups.forEach(g => {
    const assignedTickets = tickets.filter(t => t.callGroup === g.id).length;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.id}</td>
      <td>${g.callType}</td>
      <td>${g.name}</td>
      <td><span style="background: rgba(81,207,102,0.2); padding: 4px 8px; border-radius: 4px;">${assignedTickets}</span></td>
      <td>
        ${perms.canEdit ? `<button class="btn small primary" data-edit-group="${g.id}">Edit</button>` : ''}
        ${perms.canDelete ? `<button class="btn small secondary" data-delete-group="${g.id}">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-delete-group]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-delete-group");
      if (confirm("Delete this call group?")) {
        const index = callGroups.findIndex(g => g.id === id);
        if (index >= 0) {
          callGroups.splice(index, 1);
          renderAdminCallGroups();
          updateAdminStats();
        }
      }
    };
  });

  // Edit group
  Array.from(tbody.querySelectorAll("button[data-edit-group]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-group");
      const group = callGroups.find(g => g.id === id);
      if (!group) return;
      const form = $("addGroupForm");
      form.classList.remove("hidden");
      $("groupName").value = group.name;
      $("groupCallType").value = group.callType || group.department || "";
      $("groupServices").value = (group.services || []).join(", ");
      $("groupName").dataset.editId = id;
      populateGroupManagers(group.managers || group.assignedManagers || []);
      $("groupAddMsg").textContent = "";
      $("groupAddErr").textContent = "";
      showSection("newGroupPage");
    };
  });
}

function setupGroupForm() {
  const addBtn = $("adminAddGroupBtn");
  const form = $("addGroupForm");
  const saveBtn = $("saveGroupBtn");
  const cancelBtn = $("cancelGroupBtn");

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove("hidden");
      const nameInput = form.querySelector('#groupName');
      const typeSelect = form.querySelector('#groupCallType');
      const msg = form.querySelector('#groupAddMsg');
      const err = form.querySelector('#groupAddErr');
      if (nameInput) nameInput.value = "";
      if (typeSelect) typeSelect.value = "";
      if (msg) msg.textContent = "";
      if (err) err.textContent = "";
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add("hidden");
    };
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = (form.querySelector('#groupName')?.value || '').trim();
      const callType = form.querySelector('#groupCallType')?.value || '';

      const msg = form.querySelector('#groupAddMsg');
      const err = form.querySelector('#groupAddErr');
      if (err) err.textContent = "";
      if (msg) msg.textContent = "";

      if (!name || !callType) {
        if (err) err.textContent = "Group name and call type are required";
        return;
      }

      const newId = "GRP" + (callGroups.length + 1).toString().padStart(3, "0");
      callGroups.push({
        id: newId,
        name: name,
        callType: callType
      });

      if (msg) msg.textContent = `Call group ${name} created successfully!`;
      setTimeout(() => {
        form.classList.add("hidden");
        renderAdminCallGroups();
        updateAdminStats();
      }, 1500);
    };
  }
}


// COMPANIES MANAGEMENT
function renderAdminCompanies() {
  const tbody = $("companiesTableBody");
  tbody.innerHTML = "";
  const perms = getCurrentAdminPerms();

  companies.forEach(c => {
    const custCount = customers.filter(x => x.companyId === c.id).length;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${c.gstNo || "N/A"}</td>
      <td><span style="background: rgba(135,206,235,0.2); padding: 4px 8px; border-radius: 4px;">${custCount}</span></td>
      <td>
        ${perms.canEdit ? `<button class="btn small primary" data-edit-comp="${c.id}">Edit</button>` : ''}
        ${perms.canDelete ? `<button class="btn small secondary" data-delete-comp="${c.id}">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-delete-comp]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-delete-comp");
      if (confirm("Delete this company?")) {
        const index = companies.findIndex(c => c.id === id);
        if (index >= 0) {
          companies.splice(index, 1);
          renderAdminCompanies();
        }
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-edit-comp]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-comp");
      const company = companies.find(c => c.id === id);
      const form = $("addCompanyForm");
      if (!company || !form) return;
      form.classList.remove("hidden");
      form.dataset.editId = id;
      $("companyName").value = company.name || "";
      $("companyEmail").value = company.email || "";
      $("companyPhone").value = company.phone || "";
      $("companyGST").value = company.gstNo || "";
      $("companyAddMsg").textContent = "";
      $("companyAddErr").textContent = "";
    };
  });
}

function setupCompanyForm() {
  const addBtn = $("adminAddCompanyBtn");
  const form = $("addCompanyForm");
  const saveBtn = $("saveCompanyBtn");
  const cancelBtn = $("cancelCompanyFormBtn");

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove("hidden");
      $("companyName").value = "";
      $("companyEmail").value = "";
      $("companyPhone").value = "";
      $("companyGST").value = "";
      $("companyAddMsg").textContent = "";
      $("companyAddErr").textContent = "";
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add("hidden");
    };
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = $("companyName").value.trim();
      const email = $("companyEmail").value.trim();
      const phone = $("companyPhone").value.trim();
      const gst = $("companyGST").value.trim();
      const editId = $("addCompanyForm").dataset.editId;

      $("companyAddErr").textContent = "";
      $("companyAddMsg").textContent = "";

      if (!name) {
        $("companyAddErr").textContent = "Company name is required";
        return;
      }

      if (editId) {
        const idx = companies.findIndex(c => c.id === editId);
        if (idx >= 0) {
          companies[idx].name = name;
          companies[idx].email = email;
          companies[idx].phone = phone;
          companies[idx].gstNo = gst;
          $("companyAddMsg").textContent = `✅ Company ${name} updated successfully!`;
          setTimeout(() => {
            form.classList.add("hidden");
            form.dataset.editId = "";
            refreshAllDataViews();
          }, 1200);
          return;
        }
      }

      const newId = "C" + (companies.length + 1).toString().padStart(3, "0");
      companies.push({ id: newId, name, email, phone, gstNo: gst });
      $("companyAddMsg").textContent = `✅ Company ${name} added successfully!`;
      setTimeout(() => {
        form.classList.add("hidden");
        form.dataset.editId = "";
        refreshAllDataViews();
      }, 1200);
    };
  }
}

// CUSTOMERS MANAGEMENT
function renderAdminCustomers() {
  const tbody = $("customersTableBody");
  tbody.innerHTML = "";
  const perms = getCurrentAdminPerms();

  customers.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td><span style="background: ${c.type === "corporate" ? "rgba(135,206,235,0.2)" : "rgba(81,207,102,0.2)"}; padding: 4px 8px; border-radius: 4px;">${c.type === "corporate" ? "Corporate" : "Individual"}</span></td>
      <td>
        ${perms.canEdit ? `<button class="btn small primary" data-edit-cust="${c.id}">Edit</button>` : ''}
        ${perms.canDelete ? `<button class="btn small secondary" data-delete-cust="${c.id}">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-delete-cust]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-delete-cust");
      if (confirm("Delete this customer?")) {
        const index = customers.findIndex(c => c.id === id);
        if (index >= 0) {
          customers.splice(index, 1);
          refreshAllDataViews();
        }
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-edit-cust]")).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-edit-cust");
      const customer = customers.find(c => c.id === id);
      const form = $("addCustomerForm");
      if (!customer || !form) return;
      form.classList.remove("hidden");
      form.dataset.editId = id;
      $("custName").value = customer.name || "";
      $("custEmail").value = customer.email || "";
      $("custPhone").value = customer.phone || "";
      $("custCompany").value = customer.companyId || "";
      $("customerAddMsg").textContent = "";
      $("customerAddErr").textContent = "";
    };
  });
}

function setupCustomerForm() {
  const addBtn = $("adminAddCustomerBtn");
  const form = $("addCustomerForm");
  const saveBtn = $("saveCustomerBtn");
  const cancelBtn = $("cancelCustomerFormBtn");
  const custCompanySelect = $("custCompany");

  // Populate company dropdown
  if (custCompanySelect) {
    custCompanySelect.innerHTML = "<option value=''>-- None (Individual) --</option>";
    companies.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      custCompanySelect.appendChild(opt);
    });
  }

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove("hidden");
      $("custName").value = "";
      $("custEmail").value = "";
      $("custPhone").value = "";
      $("custCompany").value = "";
      $("customerAddMsg").textContent = "";
      $("customerAddErr").textContent = "";
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add("hidden");
    };
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = $("custName").value.trim();
      const email = $("custEmail").value.trim();
      const phone = $("custPhone").value.trim();
      const companyId = $("custCompany").value;
      const editId = $("addCustomerForm").dataset.editId;

      $("customerAddErr").textContent = "";
      $("customerAddMsg").textContent = "";

      if (!name || !phone) {
        $("customerAddErr").textContent = "Name and phone are required";
        return;
      }

      if (editId) {
        const idx = customers.findIndex(c => c.id === editId);
        if (idx >= 0) {
          customers[idx].name = name;
          customers[idx].email = email;
          customers[idx].phone = phone;
          customers[idx].companyId = companyId;
          customers[idx].type = companyId ? "corporate" : "individual";
          $("customerAddMsg").textContent = `Customer ${name} updated successfully!`;
          setTimeout(() => {
            form.classList.add("hidden");
            form.dataset.editId = "";
            refreshAllDataViews();
          }, 1200);
          return;
        }
      }

      const newId = "CUS" + (customers.length + 1).toString().padStart(4, "0");
      customers.push({ id: newId, type: companyId ? "corporate" : "individual", name, email, phone, companyId, address: "", gst: "" });
      $("customerAddMsg").textContent = `Customer ${name} added successfully!`;
      setTimeout(() => {
        form.classList.add("hidden");
        form.dataset.editId = "";
        refreshAllDataViews();
      }, 1200);
    };
  }
}

// TICKETS VIEW
function renderAdminAllTickets() {
  const tbody = $("adminTicketsTableBody");
  tbody.innerHTML = "";

  tickets.forEach(t => {
    const manager = t.acceptedByManager
      ? (managers.find(m => m.id === t.acceptedByManager)?.name || "Unassigned")
      : (t.assignedManagerIds && t.assignedManagerIds.length > 0
        ? (managers.find(m => m.id === t.assignedManagerIds[0])?.name || "Unassigned")
        : "Unassigned");
    const employee = t.assignedEmployeeId ? employees.find(e => e.id === t.assignedEmployeeId)?.name || "Unassigned" : "Unassigned";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.callType || "General"}</td>
      <td><span style="background: ${t.status === "Pending Assignment" ? "rgba(255,165,0,0.2)" : "rgba(81,207,102,0.2)"}; padding: 4px 8px; border-radius: 4px;">${t.status}</span></td>
      <td>${manager}</td>
      <td>${employee}</td>
      <td>${t.raisedDate || "N/A"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// REPORTS
function renderAdminReports() {
  // Tickets by status
  const statusList = $("reportTicketsByStatus");
  statusList.innerHTML = "";
  
  const statuses = {};
  tickets.forEach(t => {
    statuses[t.status] = (statuses[t.status] || 0) + 1;
  });

  Object.entries(statuses).forEach(([status, count]) => {
    const li = document.createElement("li");
    li.style.cssText = "padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between;";
    li.innerHTML = `<span>${status}</span><span style="font-weight: 800; color: #ffa500;">${count}</span>`;
    statusList.appendChild(li);
  });

  // Employee performance
  const perfList = $("reportEmployeePerformance");
  perfList.innerHTML = "";

  const empPerf = {};
  employees.forEach(e => {
    const completed = tickets.filter(t => t.assignedEmployeeId === e.id && (t.status === "Reported" || t.status === "Finished")).length;
    const total = tickets.filter(t => t.assignedEmployeeId === e.id).length;
    empPerf[e.name] = { completed, total };
  });

  Object.entries(empPerf).forEach(([name, perf]) => {
    const li = document.createElement("li");
    li.style.cssText = "padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between;";
    const percentage = perf.total > 0 ? Math.round((perf.completed / perf.total) * 100) : 0;
    li.innerHTML = `<span>${name}</span><span style="font-weight: 800; color: #51cf66;">${perf.completed}/${perf.total} (${percentage}%)</span>`;
    perfList.appendChild(li);
  });

  // Action Logs (compact)
  const statusList2 = statusList; // reuse existing list to avoid layout changes
  if (systemLogs.length > 0) {
    const divider = document.createElement('li');
    divider.style.cssText = 'padding:8px 0; font-weight:700; color:#e84c3d;';
    divider.textContent = 'Action Logs';
    statusList2.appendChild(divider);
    systemLogs.forEach(log => {
      const li = document.createElement('li');
      li.style.cssText = 'padding:6px 0; font-size:12px; color:rgba(255,255,255,0.85);';
      li.textContent = `${log.ts} - ${log.actor} ${log.action} (${log.ticketId}) ${log.details||''}`;
      statusList2.appendChild(li);
    });
  }
}

// Global refresh to keep pages linked
function refreshAllDataViews() {
  try {
    if (typeof updateStats === 'function') updateStats();
    if (typeof updateAdminStats === 'function') updateAdminStats();
    if (typeof renderAdminEmployees === 'function') renderAdminEmployees();
    if (typeof renderAdminManagers === 'function') renderAdminManagers();
    // companies tab removed
    if (typeof renderAdminCustomers === 'function') renderAdminCustomers();
    if (typeof renderAdminAllTickets === 'function') renderAdminAllTickets();
    if (typeof renderFrontOfficeTickets === 'function') renderFrontOfficeTickets();
    if (typeof renderAdminManagerEmployees === 'function') renderAdminManagerEmployees();
    if (typeof renderAdminOtherEmployees === 'function') renderAdminOtherEmployees();
    if (typeof renderFinanceTickets === 'function') renderFinanceTickets();
  } catch (e) {
    console.error('Refresh views error', e);
  }
}

// Attendance tracking
let attendanceLogs = [];
function loadAttendanceLogs() {
  try {
    const raw = localStorage.getItem('attendanceLogs');
    attendanceLogs = raw ? JSON.parse(raw) : [];
  } catch (e) {
    attendanceLogs = [];
  }
}
function saveAttendanceLogs() {
  try {
    localStorage.setItem('attendanceLogs', JSON.stringify(attendanceLogs));
  } catch (e) {}
}

function saveEmployees() {
  try {
    localStorage.setItem('employees', JSON.stringify(employees));
  } catch (e) {}
}
function addAttendanceLog(employeeId, type, dateObj = new Date()) {
  const dayKey = dateObj.toISOString().split('T')[0];
  let entry = attendanceLogs.find(a => a.employeeId === employeeId && a.date === dayKey);
  if (!entry) {
    entry = { id: 'ATT' + (attendanceLogs.length + 1).toString().padStart(4, '0'), employeeId, date: dayKey, loginTime: null, logoutTime: null };
    attendanceLogs.push(entry);
  }
  const iso = dateObj.toISOString();
        if (type === 'login') {
            if (entry.loginTime) {
                console.warn(`Employee ${employeeId} already logged in today.`);
                return;
            }
            entry.loginTime = iso;
            const loginDateTime = new Date(iso);
            const loginHour = loginDateTime.getHours();
            const loginMinutes = loginDateTime.getMinutes();

            // Check for late login (after 10:00 AM)
            if (loginHour > 10 || (loginHour === 10 && loginMinutes > 0)) {
                let reason = prompt("You logged in after 10:00 AM. Please provide a reason:");
                if (!reason) {
                    reason = "No reason provided - Half Day";
                    entry.isHalfDay = true; // Mark as half-day if no reason
                }
                entry.lateLoginReason = reason;
            }
        }
        if (type === 'logout') {
            if (entry.logoutTime) {
                console.warn(`Employee ${employeeId} already logged out today.`);
                return;
            }
            entry.logoutTime = iso;
        }
  saveAttendanceLogs();
  logAction('employee', type === 'login' ? 'attendance_login' : 'attendance_logout', '', employeeId);
  renderEmployeeAttendanceToday();
  renderAdminAttendance();
}
function renderEmployeeAttendanceToday() {
  const list = $('empAttendanceTodayList');
  if (!list || !currentUser || currentUser.role !== 'employee') return;
  const eid = currentUser.employeeId;
  const dayKey = new Date().toISOString().split('T')[0];
  const entry = attendanceLogs.find(a => a.employeeId === eid && a.date === dayKey);
  list.innerHTML = '';
  const li = document.createElement('li');
  const loginDisp = entry && entry.loginTime ? formatDateTime(new Date(entry.loginTime)) : '--';
  const logoutDisp = entry && entry.logoutTime ? formatDateTime(new Date(entry.logoutTime)) : '--';
  li.textContent = `Login: ${loginDisp} | Logout: ${logoutDisp}`;
  list.appendChild(li);
}
function setupEmployeeAttendance() {
  const loginBtn = $('empLoginBtn');
  const logoutBtn = $('empLogoutBtn');
  const msg = $('empAttendanceMsg');
  const err = $('empAttendanceErr');
  if (loginBtn) loginBtn.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    if (!currentUser || currentUser.role !== 'employee') { err.textContent = 'Not an employee session.'; return; }
        if (currentUser.isLoggedIn) { err.textContent = 'You are already logged in.'; return; }
        addAttendanceLog(currentUser.employeeId, 'login');
    msg.textContent = 'Login recorded';
  };
  if (logoutBtn) logoutBtn.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    if (!currentUser || currentUser.role !== 'employee') { err.textContent = 'Not an employee session.'; return; }
        if (!currentUser.isLoggedIn) { err.textContent = 'You are not logged in.'; return; }
        addAttendanceLog(currentUser.employeeId, 'logout');
    msg.textContent = 'Logout recorded';
  };
  renderEmployeeAttendanceToday();
}
function renderAdminAttendance() {
  const tbody = $('adminAttendanceTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const rows = attendanceLogs.slice().sort((a,b) => (a.date < b.date ? 1 : -1));
  rows.forEach(rec => {
    const emp = employees.find(e => e.id === rec.employeeId) || managers.find(m => m.id === rec.employeeId) || frontOfficeUsers.find(u => u.id === rec.employeeId) || helpDeskUsers.find(h => h.id === rec.employeeId) || financeUsers.find(f => f.id === rec.employeeId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rec.date}</td>
      <td>${emp ? emp.name : rec.employeeId}</td>
      <td>${rec.loginTime ? formatDateTime(new Date(rec.loginTime)) : '--'}</td>
      <td>${rec.logoutTime ? formatDateTime(new Date(rec.logoutTime)) : '--'}</td>
    `;
    tbody.appendChild(tr);
  });
}
function setupAdminAttendancePanel() {
  const empSel = $('adminAttEmpSelect');
  const dateInput = $('adminAttDate');
  const loginInput = $('adminAttLoginTime');
  const logoutInput = $('adminAttLogoutTime');
  const saveBtn = $('adminAttSaveBtn');
  const refreshBtn = $('adminAttRefreshBtn');
  const msg = $('adminAttendanceMsg');
  const err = $('adminAttendanceErr');
  if (empSel) {
    const opts = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    empSel.innerHTML = `<option value="">-- Select Employee --</option>` + opts;
  }
  if (refreshBtn) refreshBtn.onclick = () => { renderAdminAttendance(); };
  if (saveBtn) saveBtn.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    const empId = empSel ? empSel.value : '';
    const dateVal = dateInput ? dateInput.value : '';
    const loginVal = loginInput ? loginInput.value : '';
    const logoutVal = logoutInput ? logoutInput.value : '';
    if (!empId || !dateVal) { err.textContent = 'Select employee and date.'; return; }
    const dateObj = new Date(dateVal + (loginVal ? 'T' + loginVal + ':00' : 'T00:00:00'));
    let entry = attendanceLogs.find(a => a.employeeId === empId && a.date === dateVal);
    if (!entry) {
      entry = { id: 'ATT' + (attendanceLogs.length + 1).toString().padStart(4, '0'), employeeId: empId, date: dateVal, loginTime: null, logoutTime: null };
      attendanceLogs.push(entry);
    }
    if (loginVal) entry.loginTime = new Date(dateVal + 'T' + loginVal + ':00').toISOString();
    if (logoutVal) entry.logoutTime = new Date(dateVal + 'T' + logoutVal + ':00').toISOString();
    saveAttendanceLogs();
    logAction('admin','attendance_edit','', `${empId} ${dateVal}`);
    msg.textContent = 'Attendance saved';
    renderAdminAttendance();
  };
  renderAdminAttendance();
}

// initialize persisted attendance on load
loadAttendanceLogs();

// HR dashboard functions
function renderHRAttendance() {
  const tbody = $('hrAttendanceTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const rows = attendanceLogs.slice().sort((a,b) => (a.date < b.date ? 1 : -1));
  rows.forEach(rec => {
    const emp = employees.find(e => e.id === rec.employeeId) || managers.find(m => m.id === rec.employeeId) || frontOfficeUsers.find(u => u.id === rec.employeeId) || helpDeskUsers.find(h => h.id === rec.employeeId) || financeUsers.find(f => f.id === rec.employeeId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rec.date}</td>
      <td>${emp ? emp.name : rec.employeeId}</td>
      <td>${rec.loginTime ? formatDateTime(new Date(rec.loginTime)) : '--'}</td>
      <td>${rec.logoutTime ? formatDateTime(new Date(rec.logoutTime)) : '--'}</td>
    `;
    tbody.appendChild(tr);
  });
}
function setupHRAttendancePanel() {
  const empSel = $('hrAttEmpSelect');
  const dateInput = $('hrAttDate');
  const loginInput = $('hrAttLoginTime');
  const logoutInput = $('hrAttLogoutTime');
  const saveBtn = $('hrAttSaveBtn');
  const refreshBtn = $('hrAttRefreshBtn');
  const msg = $('hrAttendanceMsg');
  const err = $('hrAttendanceErr');
  if (empSel) {
    const opts = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    empSel.innerHTML = `<option value="">-- Select Employee --</option>` + opts;
    empSel.onchange = updateHRAttendanceForm;
  }
  if (dateInput) {
    dateInput.onchange = updateHRAttendanceForm;
  }
  if (refreshBtn) refreshBtn.onclick = () => { renderHRAttendance(); };
  if (saveBtn) saveBtn.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    const empId = empSel ? empSel.value : '';
    const dateVal = dateInput ? dateInput.value : '';
    const loginVal = loginInput ? loginInput.value : '';
    const logoutVal = logoutInput ? logoutInput.value : '';
    const loginGrace = parseInt($('hrLoginGraceTime').value) || 0;
    const logoutGrace = parseInt($('hrLogoutGraceTime').value) || 0;
    if (!empId || !dateVal) { err.textContent = 'Select employee and date.'; return; }
    let entry = attendanceLogs.find(a => a.employeeId === empId && a.date === dateVal);
    if (!entry) {
      entry = { id: 'ATT' + (attendanceLogs.length + 1).toString().padStart(4, '0'), employeeId: empId, date: dateVal, loginTime: null, logoutTime: null };
      attendanceLogs.push(entry);
    }
    if (loginVal) {
      let loginDateTime = new Date(dateVal + 'T' + loginVal + ':00');
      loginDateTime.setMinutes(loginDateTime.getMinutes() - loginGrace);
      entry.loginTime = loginDateTime.toISOString();
    }
    if (logoutVal) {
      let logoutDateTime = new Date(dateVal + 'T' + logoutVal + ':00');
      logoutDateTime.setMinutes(logoutDateTime.getMinutes() + logoutGrace);
      entry.logoutTime = logoutDateTime.toISOString();
    }
    saveAttendanceLogs();
    logAction('hr','attendance_edit','', `${empId} ${dateVal}`);
    msg.textContent = 'Attendance saved';
    renderHRAttendance();
  };
  renderHRAttendance();
}

function updateHRAttendanceForm() {
  const empSel = $('hrAttEmpSelect');
  const dateInput = $('hrAttDate');
  const loginInput = $('hrAttLoginTime');
  const logoutInput = $('hrAttLogoutTime');

  const empId = empSel ? empSel.value : '';
  const dateVal = dateInput ? dateInput.value : '';

  if (empId && dateVal) {
    const entry = attendanceLogs.find(a => a.employeeId === empId && a.date === dateVal);
    if (entry) {
      loginInput.value = entry.loginTime ? new Date(entry.loginTime).toTimeString().slice(0, 5) : '';
      logoutInput.value = entry.logoutTime ? new Date(entry.logoutTime).toTimeString().slice(0, 5) : '';
    } else {
      loginInput.value = '';
      logoutInput.value = '';
    }
  } else {
    loginInput.value = '';
    logoutInput.value = '';
  }
}

function calculateEmployeeBonus() {
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  employees.forEach(emp => {
    let lateLoginCount = 0;
    let hasLeave = false;
    const employeeAttendance = attendanceLogs.filter(
      log => log.employeeId === emp.id && new Date(log.date) >= oneMonthAgo
    );

    // Check for leaves and late logins
    for (let i = 0; i < employeeAttendance.length; i++) {
      const record = employeeAttendance[i];
      if (!record.loginTime && !record.logoutTime) {
        hasLeave = true;
        break; // Found a leave, no bonus
      }

      if (record.loginTime) {
        const loginDateTime = new Date(record.loginTime);
        const loginHour = loginDateTime.getHours();
        if (loginHour >= 10) { // Late login after 10 AM
          lateLoginCount++;
        }
      }
    }

    if (!hasLeave && lateLoginCount < 3) {
      console.log(`Employee ${emp.name} (${emp.id}) is eligible for a 1000 bonus.`);
      // Here you would typically store this bonus information, e.g., in a new array or employee object
    } else {
      console.log(`Employee ${emp.name} (${emp.id}) is NOT eligible for a bonus.`);
    }
  });
}

function setupHREmployeeCreation() {
  const saveBtn = $('hrNewEmpSaveBtn');
  const cancelBtn = $('hrNewEmpCancelBtn');
  const msg = $('hrNewEmpMsg');
  const err = $('hrNewEmpErr');

  cancelBtn.onclick = () => {
    // Clear form fields
    $('hrNewEmpName').value = '';
    $('hrNewEmpEmail').value = '';
    $('hrNewEmpMobile').value = '';
    $('hrNewEmpRole').value = '';
    $('hrNewEmpId').value = '';
    $('hrNewEmpBloodGroup').value = '';
    $('hrNewEmpEmergencyContact').value = '';
    $('hrNewEmpAddress').value = '';
    $('hrNewEmpFatherName').value = '';
    $('hrNewEmpAadhaar').value = '';
    $('hrNewEmpPan').value = '';
    $('hrNewEmpEsiPf').value = '';
    $('hrNewEmpSalary').value = '';
    msg.textContent = '';
    err.textContent = '';
  };

  saveBtn.onclick = () => {
    msg.textContent = '';
    err.textContent = '';

    const name = $('hrNewEmpName').value.trim();
    const email = $('hrNewEmpEmail').value.trim();
    const mobile = $('hrNewEmpMobile').value.trim();
    const role = $('hrNewEmpRole').value.trim();
    const empId = $('hrNewEmpId').value.trim();
    const bloodGroup = $('hrNewEmpBloodGroup').value.trim();
    const emergencyContact = $('hrNewEmpEmergencyContact').value.trim();
    const address = $('hrNewEmpAddress').value.trim();
    const fatherName = $('hrNewEmpFatherName').value.trim();
    const aadhaar = $('hrNewEmpAadhaar').value.trim();
    const pan = $('hrNewEmpPan').value.trim();
    const esiPf = $('hrNewEmpEsiPf').value.trim();
    const salary = $('hrNewEmpSalary').value.trim();

    if (!name || !email || !mobile || !role || !empId || !salary) {
      err.textContent = 'Please fill all required fields (Name, Email, Mobile No, Role, Employee ID, Salary).';
      return;
    }

    if (employees.some(e => e.id === empId)) {
      err.textContent = 'Employee ID already exists. Please use a unique ID.';
      return;
    }

    const newEmployee = {
      id: empId,
      name: name,
      email: email,
      phone: mobile,
      role: role,
      password: '123', // Default password, should be changed by employee
      bloodGroup: bloodGroup,
      emergencyContact: emergencyContact,
      address: address,
      fatherName: fatherName,
      aadhaarNumber: aadhaar,
      panNumber: pan,
      esiPf: esiPf,
      salary: parseFloat(salary)
    };

    employees.push(newEmployee);
    saveEmployees(); // Assuming a saveEmployees function exists
    msg.textContent = `Employee ${name} (${empId}) added successfully!`;
    cancelBtn.onclick(); // Clear form

    renderHREmployees(); // Refresh employee list
  };
}

function renderHREmployees() {
  const tbody = $('hrEmployeesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  employees.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.email || '-'}</td>
      <td>${emp.phone || '-'}</td>
      <td>${emp.username || '-'}</td>
      <td><button class="btn small primary" data-hr-edit-emp="${emp.id}">Edit</button></td>
    `;
    tbody.appendChild(tr);
  });
  Array.from(tbody.querySelectorAll('button[data-hr-edit-emp]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-hr-edit-emp');
      const emp = employees.find(e => e.id === id);
      if (!emp) return;
      const form = $('hrEmpEditForm');
      form.classList.remove('hidden');
      form.dataset.empId = id;
      $('hrEmpEditName').value = emp.name || '';
      $('hrEmpEditEmail').value = emp.email || '';
      $('hrEmpEditPhone').value = emp.phone || '';
      $('hrEmpEditUsername').value = emp.username || '';
      $('hrEmpEditPassword').value = emp.password || '';
      $('hrEmpEditMsg').textContent = '';
      $('hrEmpEditErr').textContent = '';
    };
  });
}
function setupHREmployeeEdit() {
  const saveBtn = $('hrEmpEditSaveBtn');
  const cancelBtn = $('hrEmpEditCancelBtn');
  const form = $('hrEmpEditForm');
  const msg = $('hrEmpEditMsg');
  const err = $('hrEmpEditErr');
  if (cancelBtn) cancelBtn.onclick = () => { form.classList.add('hidden'); };
  if (saveBtn) saveBtn.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    const id = form.dataset.empId;
    const emp = employees.find(e => e.id === id);
    if (!emp) { err.textContent = 'Employee not found.'; return; }
    emp.name = $('hrEmpEditName').value.trim();
    emp.email = $('hrEmpEditEmail').value.trim();
    emp.phone = $('hrEmpEditPhone').value.trim();
    emp.username = $('hrEmpEditUsername').value.trim();
    const pwd = $('hrEmpEditPassword').value;
    if (pwd) emp.password = pwd;
    logAction('hr','edit_employee', '', id);
    msg.textContent = 'Employee updated';
    renderHREmployees();
  };
}

function renderHRManagers() {
  const tbody = $('hrManagersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  managers.forEach(m => {
    const depts = (m.assignedDepartments || []).join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.name}</td>
      <td>${m.email || '-'}</td>
      <td>${m.phone || '-'}</td>
      <td>${depts || '-'}</td>
      <td><button class="btn small primary" data-hr-edit-mgr="${m.id}">Edit</button></td>
    `;
    tbody.appendChild(tr);
  });
  Array.from(tbody.querySelectorAll('button[data-hr-edit-mgr]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-hr-edit-mgr');
      const m = managers.find(x => x.id === id);
      if (!m) return;
      const form = $('hrMgrEditForm');
      form.classList.remove('hidden');
      form.dataset.mgrId = id;
      $('hrMgrEditName').value = m.name || '';
      $('hrMgrEditEmail').value = m.email || '';
      $('hrMgrEditPhone').value = m.phone || '';
      $('hrMgrEditUsername').value = m.username || '';
      $('hrMgrEditPassword').value = m.password || '';
      $('hrMgrEditDepartments').value = (m.assignedDepartments || []).join(', ');
      $('hrMgrEditMsg').textContent = '';
      $('hrMgrEditErr').textContent = '';
    };
  });
}
function setupHRManagerEdit() {
  const saveBtn = $('hrMgrEditSaveBtn');
  const cancelBtn = $('hrMgrEditCancelBtn');
  const form = $('hrMgrEditForm');
  const msg = $('hrMgrEditMsg');
  const err = $('hrMgrEditErr');
  if (cancelBtn) cancelBtn.onclick = () => { form.classList.add('hidden'); };
  if (saveBtn) saveBtn.onclick = () => {
    err.textContent = '';
    msg.textContent = '';
    const id = form.dataset.mgrId;
    const m = managers.find(x => x.id === id);
    if (!m) { err.textContent = 'Manager not found.'; return; }
    m.name = $('hrMgrEditName').value.trim();
    m.email = $('hrMgrEditEmail').value.trim();
    m.phone = $('hrMgrEditPhone').value.trim();
    m.username = $('hrMgrEditUsername').value.trim();
    const pwd = $('hrMgrEditPassword').value;
    if (pwd) m.password = pwd;
    const rawDepts = $('hrMgrEditDepartments').value.split(',').map(s => s.trim()).filter(Boolean);
    const allowed = (typeof departmentsList !== 'undefined' && Array.isArray(departmentsList)) ? departmentsList : ["IT","Technical","CCTV","Biometric","Sales"];
    m.assignedDepartments = rawDepts.map(d => {
      const norm = d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
      return allowed.includes(norm) ? norm : d;
    }).filter(d => allowed.includes(d));
    if (!m.assignedDepartments || m.assignedDepartments.length === 0) { err.textContent = 'Please assign at least one department'; return; }
    logAction('hr','edit_manager','', id);
    msg.textContent = 'Manager updated';
    renderHRManagers();
  };
}

/* Front Office: Customer Type Selection Handler */
function setupFrontOfficeHandlers() {
  const custTypeSelect = $("foCustType");
  const custSelectionSection = $("foCustomerSelectionSection");
  const issueDetailsSection = $("foIssueDetailsSection");
  const existingCustSection = $("foExistingCustSection");
  const newCustForm = $("foNewCustForm");
  const existingCustBtn = $("foExistingCustBtn");
  const newCustBtn = $("foNewCustBtn");
  const saveNewCustBtn = $("foSaveNewCustBtn");
  const cancelNewCustBtn = $("foCancelNewCustBtn");
  const callTypeSelect = $("foCallType");
  // group selection removed; auto-assign managers by call type
  const createTicketBtn = $("foCreateTicketBtn");
  const companyNameDiv = $("foCompanyNameDiv");
  const contactPersonDiv = $("foContactPersonDiv");
  const selectExistingCust = $("foSelectExistingCust");
  const autoAssignedManagersDiv = $("foAutoAssignedManagers");

  // Step 1: Customer Type Selection
  if (custTypeSelect) {
    custTypeSelect.onchange = () => {
      const type = custTypeSelect.value;
      if (type === "individual" || type === "corporate") {
        custSelectionSection.classList.remove("hidden");
        issueDetailsSection.classList.add("hidden");
        existingCustSection.classList.remove("hidden");
        newCustForm.classList.add("hidden");
        populateExistingCustomers(type);
      } else {
        custSelectionSection.classList.add("hidden");
        issueDetailsSection.classList.add("hidden");
      }
    };
  }

  // Step 2: Existing vs New Customer
  if (existingCustBtn) {
    existingCustBtn.onclick = () => {
      existingCustSection.classList.remove("hidden");
      newCustForm.classList.add("hidden");
    };
  }

  if (newCustBtn) {
    newCustBtn.onclick = () => {
      const type = custTypeSelect.value;
      existingCustSection.classList.add("hidden");
      newCustForm.classList.remove("hidden");
      
      // Display customer type
      const typeDisplay = $("foNewCustTypeDisplay");
      if (typeDisplay) {
        const typeLabel = type === "corporate" ? "Corporate Customer" : "Individual Customer";
        typeDisplay.textContent = typeLabel;
      }
      
      // Show/hide fields based on type
      if (type === "corporate") {
        companyNameDiv.classList.remove("hidden");
        contactPersonDiv.classList.remove("hidden");
      } else {
        companyNameDiv.classList.add("hidden");
        contactPersonDiv.classList.add("hidden");
      }
      
      // Clear form
      $("foNewCustName").value = "";
      $("foNewCompanyName").value = "";
      $("foNewCustPhone").value = "";
      $("foNewCustEmail").value = "";
      $("foNewCustAddress").value = "";
      $("foNewCustGST").value = "";
      $("foNewContactPerson").value = "";
    };
  }

  // Save new customer
  if (saveNewCustBtn) {
    saveNewCustBtn.onclick = saveNewCustomer;
  }

  if (cancelNewCustBtn) {
    cancelNewCustBtn.onclick = () => {
      newCustForm.classList.add("hidden");
      existingCustSection.classList.remove("hidden");
    };
  }

  // Step 2.5: When existing customer is selected, show Step 3
  if (selectExistingCust) {
    selectExistingCust.onchange = () => {
      const custId = selectExistingCust.value;
      if (custId) {
        issueDetailsSection.classList.remove("hidden");
      } else {
        issueDetailsSection.classList.add("hidden");
      }
    };
  }

  // Step 3: Call Type -> show auto-assigned managers
  if (callTypeSelect) {
    callTypeSelect.onchange = () => {
      const type = callTypeSelect.value;
      if (!type) { autoAssignedManagersDiv.style.display = "none"; return; }
      const groupsForType = callGroups.filter(g => (g.callType && g.callType === type));
      const mgrIds = managers.filter(m => (m.assignedGroups || []).some(gid => groupsForType.some(g => g.id === gid))).map(m => m.id);
      if (mgrIds.length > 0) {
        const managerNames = mgrIds.map(mId => {
          const mgr = managers.find(m => m.id === mId);
          return mgr ? mgr.name : mId;
        }).join(", ");
        autoAssignedManagersDiv.textContent = `Auto-assigned to: ${managerNames}`;
        autoAssignedManagersDiv.style.display = "block";
      } else {
        autoAssignedManagersDiv.style.display = "none";
      }
    };
  }

  if (createTicketBtn) {
    createTicketBtn.onclick = createTicketFromFrontOffice;
  }
}

function populateExistingCustomers(type) {
  const select = $("foSelectExistingCust");
  if (!select) return;
  select.innerHTML = "<option value=''>-- Select Customer --</option>";
  
  const filteredCustomers = customers.filter(c => c.type === type);
  filteredCustomers.forEach(cust => {
    const option = document.createElement("option");
    option.value = cust.id;
    const displayName = cust.type === "corporate" ? cust.companyName : cust.name;
    option.textContent = `${displayName} (${cust.phone})`;
    select.appendChild(option);
  });
}

function saveNewCustomer() {
  const type = $("foCustType").value;
  const name = $("foNewCustName").value.trim();
  const phone = $("foNewCustPhone").value.trim();
  const email = $("foNewCustEmail").value.trim();
  const address = $("foNewCustAddress").value.trim();
  const gst = $("foNewCustGST").value.trim();
  
  $("foNewCustErr").textContent = "";
  $("foNewCustMsg").textContent = "";

  if (!name || !phone || !email || !address) {
    $("foNewCustErr").textContent = "Please fill all required fields.";
    return;
  }

  const newCustId = "CUS" + (customers.length + 1).toString().padStart(4, "0");
  
  if (type === "corporate") {
    const companyName = $("foNewCompanyName").value.trim();
    const contactPerson = $("foNewContactPerson").value.trim();
    
    if (!companyName || !contactPerson) {
      $("foNewCustErr").textContent = "Please fill company name and contact person.";
      return;
    }

    customers.push({
      id: newCustId,
      type: "corporate",
      name: contactPerson,
      companyName: companyName,
      phone: phone,
      email: email,
      address: address,
      gst: gst,
      contactPerson: contactPerson,
      companyId: ""
    });
  } else {
    customers.push({
      id: newCustId,
      type: "individual",
      name: name,
      phone: phone,
      email: email,
      address: address,
      gst: gst,
      contactPerson: "",
      companyId: ""
    });
  }

  $("foNewCustMsg").textContent = "Customer created successfully!";
  
  // Hide form and show existing customers
  setTimeout(() => {
    $("foNewCustForm").classList.add("hidden");
    $("foExistingCustSection").classList.remove("hidden");
    populateExistingCustomers(type);
  }, 1000);
}

function createTicketFromFrontOffice() {
  const custId = $("foSelectExistingCust").value;
  const callType = $("foCallType").value;
  const problemTitle = $("foProblemTitle").value.trim();
  const problemDesc = $("foProblemDesc").value.trim();

  $("foTicketErr").textContent = "";
  $("foTicketMsg").textContent = "";

  if (!custId || !callType || !problemTitle || !problemDesc) {
    $("foTicketErr").textContent = "Please fill all required fields.";
    return;
  }

  const cust = customers.find(c => c.id === custId);
  if (!cust) {
    $("foTicketErr").textContent = "Customer not found.";
    return;
  }

  // Create ticket; Help Desk will select department and assign managers
  const ticketId = "TKT" + (tickets.length + 1).toString().padStart(4, "0");
  const newTicket = {
    id: ticketId,
    customerId: cust.id,
    customerName: cust.type === "corporate" ? cust.companyName : cust.name,
    customerEmail: cust.email,
    customerPhone: cust.phone,
    callType: callType,
    problemTitle: problemTitle,
    description: problemDesc,
    callGroup: null,
    frontOfficeUser: currentUser.userId,
    assignedManagerIds: [],
    acceptedByManager: null, // Which manager accepted it
    assignedEmployeeId: null,
    taskStatus: null,
    taskProgress: 0,
    completedDate: null,
    raisedDate: new Date().toISOString().split("T")[0],
    status: "Raised",
    paymentStatus: "pending",
    paymentReceivedDate: null,
    amountPaid: 0,
    paymentHistory: []
  };

  tickets.push(newTicket);
  logAction('frontoffice','create_ticket', newTicket.id, `${callType}`);
  $("foTicketMsg").textContent = `Ticket ${ticketId} created successfully! Sent to Help Desk.`;

  // Reset and show ticket list
  setTimeout(() => {
    $("foCustType").value = "";
    $("foCustomerSelectionSection").classList.add("hidden");
    $("foIssueDetailsSection").classList.add("hidden");
    renderFrontOfficeTickets();
    updateStats();
  }, 1500);
}

function renderFrontOfficeTickets() {
  const tbody = $("foMyTicketsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const myTickets = tickets.filter(t => t.frontOfficeUser === currentUser.userId);
  myTickets.forEach(t => {
    // Get the manager who accepted it, or show the group managers if not accepted yet
    let managerName = "-";
    if (t.acceptedByManager) {
      const manager = managers.find(m => m.id === t.acceptedByManager);
      managerName = manager ? manager.name : "Unassigned";
    } else if (t.assignedManagerIds && t.assignedManagerIds.length > 0) {
      managerName = `${t.assignedManagerIds.length} managers`;
    }
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><button class="btn small primary" data-view-progress="${t.id}">${t.id}</button></td>
      <td>${t.customerName}</td>
      <td>${t.callType}</td>
      <td>${t.status}</td>
      <td>${managerName}</td>
      <td>${t.raisedDate}</td>
    `;
    tbody.appendChild(tr);
  });

  // Add progress view handlers
  Array.from(tbody.querySelectorAll("button[data-view-progress]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-view-progress");
      showTicketProgress(ticketId);
    };
  });
}

function renderEmployeeTicketsIfEmployeeLoggedIn() {
  if (!currentUser || currentUser.role !== "employee") return;
  renderEmployeeTickets();
}

let selectedTicketForEmployee = null;
let selectedTaskForWork = null;
let taskWorkSessionData = {}; // Track work sessions with breaks, start times, etc.

function renderEmployeeTasks() {
    const salesReportDiv = $("salesReportDiv");
    if (currentUser && currentUser.role === "employee" && currentUser.department === "Sales") {
      salesReportDiv.classList.remove("hidden");
    } else {
      salesReportDiv.classList.add("hidden");
    }
    const pendingTbody = $("employeePendingTasksTableBody");
    const activeTbody = $("employeeActiveTasksTableBody");
  const completedTbody = $("employeeCompletedTasksTableBody");
  
  pendingTbody.innerHTML = "";
  activeTbody.innerHTML = "";
  completedTbody.innerHTML = "";

  const myEmployeeId = currentUser.employeeId;
  const myTickets = tickets.filter(t => t.assignedEmployeeId === myEmployeeId);
  const hasSiteVisitMode = myTickets.some(t => (t.siteVisitRequired || t.salesVerification) && (t.status === 'Assigned' || t.status === 'In Progress'));

  // Separate tickets by status (exclude site visit assignments)
  const pendingTickets = myTickets.filter(t => t.status === "Assigned" && !t.siteVisitRequired && !t.salesVerification);
  const activeTickets = myTickets.filter(t => t.status === "In Progress" && !t.siteVisitRequired && !t.salesVerification);
  const completedTickets = myTickets.filter(t => t.status === "Reported" || t.status === "Finished");

  // Render Pending Tasks (Need Accept/Reject/Swap)
  pendingTickets.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.customerPhone ? t.customerPhone + " (Location)" : "Address not available"}</td>
      <td>${t.callType || t.serviceType || "General Service"}</td>
      <td>${t.description || "No description"}</td>
      <td>
        <button class="btn small primary" data-respond-task="${t.id}">Respond</button>
      </td>
    `;
    pendingTbody.appendChild(tr);
  });

  // Render Active Tasks
  activeTickets.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.callType || "Service"}</td>
      <td>~ 2 hours</td>
      <td><span style="color: #ffa500; font-weight: 800;">In Progress</span></td>
      <td>
        <button class="btn small primary" data-open-work="${t.id}">Open Work Panel</button>
      </td>
    `;
    activeTbody.appendChild(tr);
  });

  // Render Completed Tasks
  completedTickets.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.callType || "Service"}</td>
      <td>${t.completedDate || "N/A"}</td>
      <td>${t.totalWorkTime || "N/A"}</td>
      <td>
        <button class="btn small secondary" data-view-completed="${t.id}">Details</button>
      </td>
    `;
    completedTbody.appendChild(tr);
  });

  // Respond to task buttons
  Array.from(pendingTbody.querySelectorAll("button[data-respond-task]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-respond-task");
      showTaskResponseModal(ticketId);
    };
  });

  // Open work panel buttons
  Array.from(activeTbody.querySelectorAll("button[data-open-work]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-open-work");
      openTaskWorkPanel(ticketId);
    };
  });

  // View completed details
  Array.from(completedTbody.querySelectorAll("button[data-view-completed]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-view-completed");
      const ticket = tickets.find(t => t.id === ticketId);
      const el = $("workUpdateMsg");
      if (el) el.textContent = `Completed ${ticket.id} • ${ticket.customerName} • ${ticket.completedDate || ''}`;
    };
  });

  // Update performance stats
  updateEmployeePerformanceStats();
}

function showTaskResponseModal(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  selectedTicketForEmployee = ticket;
  const modal = $("taskResponseModal");
  const content = $("taskResponseContent");

  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <label style="color: rgba(255,255,255,0.7); font-size: 12px;">Ticket ID</label>
          <p style="font-size: 16px; font-weight: 800; color: #e84c3d; margin: 4px 0;">${ticket.id}</p>
        </div>
        <div>
          <label style="color: rgba(255,255,255,0.7); font-size: 12px;">Customer Name</label>
          <p style="font-size: 16px; font-weight: 800; color: rgba(255,255,255,0.9); margin: 4px 0;">${ticket.customerName}</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          <label style="color: rgba(255,255,255,0.7); font-size: 12px;">Service Type</label>
          <p style="font-size: 14px; color: rgba(255,255,255,0.9); margin: 4px 0;">${ticket.callType || "General"}</p>
        </div>
        <div>
          <label style="color: rgba(255,255,255,0.7); font-size: 12px;">Customer Location</label>
          <p style="font-size: 14px; color: rgba(255,255,255,0.9); margin: 4px 0;">${ticket.customerPhone || "Location TBD"}</p>
        </div>
      </div>
      <div style="margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #e84c3d;">
        <label style="color: rgba(255,255,255,0.7); font-size: 12px;">Issue Description</label>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0; line-height: 1.5;">${ticket.description || "No description provided"}</p>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");

  // Setup response buttons
  $("acceptTaskBtn").onclick = () => acceptTask(ticket.id);
  $("rejectTaskBtn").onclick = () => rejectTask(ticket.id);
  $("swapTaskBtn").onclick = () => {
    $("swapReasonDiv").classList.remove("hidden");
  };
  $("submitSwapBtn").onclick = () => submitSwapRequest(ticket.id);
  $("closeTaskResponseBtn").onclick = () => closeTaskResponseModal();
}

function closeTaskResponseModal() {
  $("taskResponseModal").classList.add("hidden");
  $("taskResponseContent").innerHTML = "";
  $("swapReasonDiv").classList.add("hidden");
  $("taskResponseMsg").textContent = "";
  $("taskResponseErr").textContent = "";
}

function acceptTask(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  ticket.status = "In Progress";
  ticket.acceptedDate = new Date().toISOString();
  ticket.taskStartDate = new Date().toISOString().split("T")[0];
  logAction('employee','accept_task', ticket.id);

  // Initialize work session
  taskWorkSessionData[ticketId] = {
    startTime: new Date(),
    breaks: [],
    currentBreakStart: null,
    totalBreakTime: 0,
    updates: []
  };

      $("taskResponseMsg").textContent = "Task accepted. You can now begin work.";
  setTimeout(() => {
    closeTaskResponseModal();
    renderEmployeeTickets();
    renderAssignedTicketsForManager();
    updateStats();
    openTaskWorkPanel(ticketId);
  }, 1500);
}

function rejectTask(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const reason = prompt("Why are you rejecting this task?");
  if (!reason) return;

  ticket.status = "Assigned"; // Keep assigned, will reassign to another employee
  ticket.rejectionReason = reason;
  ticket.rejectedDate = new Date().toISOString();
  logAction('employee','reject_task', ticket.id, reason);

  $("taskResponseMsg").textContent = "Task rejection submitted to manager.";
  setTimeout(() => {
    closeTaskResponseModal();
    renderEmployeeTickets();
    renderAssignedTicketsForManager();
  }, 1500);
}

function submitSwapRequest(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  const reason = $("swapReason").value.trim();

  if (!reason) {
    $("taskResponseErr").textContent = "Please provide a reason for swap request.";
    return;
  }

  ticket.swapRequested = true;
  ticket.swapReason = reason;
  ticket.swapRequestedDate = new Date().toISOString();
  logAction('employee','request_swap', ticket.id, reason);

  $("taskResponseMsg").textContent = "Swap request submitted! Manager will review your request.";
  setTimeout(() => {
    closeTaskResponseModal();
    renderEmployeeTickets();
    renderAssignedTicketsForManager();
  }, 1500);
}

function openTaskWorkPanel(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  selectedTaskForWork = ticket;

  // Initialize session if not exists
  if (!taskWorkSessionData[ticketId]) {
    taskWorkSessionData[ticketId] = {
      startTime: new Date(),
      breaks: [],
      currentBreakStart: null,
      totalBreakTime: 0,
      updates: []
    };
  }

  const panel = $("taskWorkPanel");
  panel.classList.remove("hidden");
  const upd = $("engineerUpdateSection");
  if (upd) upd.classList.remove("hidden");

  // Fill task header
  $("workTicketId").textContent = ticket.id;
  $("workCustomerLocation").textContent = ticket.customerPhone || "On-site";
  $("workServiceType").textContent = ticket.callType || "Service";
  $("workEstimatedDuration").textContent = "2 hours (estimated)";

  // Set start time if not set
  if (!$("workStartTime").value) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    $("workStartTime").value = `${hours}:${minutes}`;
  }

  // Update work time display
  updateWorkTimeDisplay();
}

function updateWorkTimeDisplay() {
  if (!selectedTaskForWork) return;

  const session = taskWorkSessionData[selectedTaskForWork.id];
  if (!session) return;

  const now = new Date();
  const totalMs = now - session.startTime - session.totalBreakTime;
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

  $("workTotalTime").textContent = `${hours}h ${minutes}m`;

  // Update break status if on break
  // Break session break the session
  if (session.currentBreakStart) {
    const breakMs = now - session.currentBreakStart;
    const breakMins = Math.floor(breakMs / (1000 * 60));
  $("breakStatus").textContent = `On break for ${breakMins} minutes`;
    $("breakInfo").style.display = "block";
  }
}

function startBreak() {
  if (!selectedTaskForWork) return;
  const session = taskWorkSessionData[selectedTaskForWork.id];
  if (session.currentBreakStart) {
    $("workUpdateErr").textContent = "Already on break";
    return;
  }

  session.currentBreakStart = new Date();
  $("startBreakBtn").classList.add("hidden");
  $("endBreakBtn").classList.remove("hidden");
  $("breakStatus").textContent = "Break started at " + new Date().toLocaleTimeString();
  $("breakInfo").style.display = "block";
}

function endBreak() {
  if (!selectedTaskForWork) return;
  const session = taskWorkSessionData[selectedTaskForWork.id];
  if (!session.currentBreakStart) {
    $("workUpdateErr").textContent = "No active break";
    return;
  }

  const breakDuration = new Date() - session.currentBreakStart;
  session.totalBreakTime += breakDuration;
  session.breaks.push({
    start: session.currentBreakStart,
    end: new Date(),
    duration: breakDuration
  });

  // Add to history
  const historyDiv = $("breakHistory");
  const breakEntry = document.createElement("div");
  breakEntry.style.cssText = "padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 6px; font-size: 12px; color: rgba(255,255,255,0.8);";
  const startTime = session.currentBreakStart.toLocaleTimeString();
  const endTime = new Date().toLocaleTimeString();
  const mins = Math.floor(breakDuration / (1000 * 60));
  breakEntry.textContent = `Break: ${startTime} - ${endTime} (${mins}m)`;
  historyDiv.appendChild(breakEntry);

  session.currentBreakStart = null;
  $("startBreakBtn").classList.remove("hidden");
  $("endBreakBtn").classList.add("hidden");
  $("breakStatus").textContent = "";
  updateWorkTimeDisplay();
}

function submitProgressUpdate() {
  if (!selectedTaskForWork) return;

  const status = $("workProgressUpdate").value;
  const blockers = $("workBlockers").value.trim();
  const notes = $("workNotes").value.trim();
  const estimatedTime = $("estimatedTimeToComplete").value;

  if (!status) {
    $("workUpdateErr").textContent = "Please select current work status.";
    return;
  }

  const session = taskWorkSessionData[selectedTaskForWork.id];
  const update = {
    timestamp: new Date().toISOString(),
    status: status,
    blockers: blockers,
    notes: notes,
    estimatedTimeRemaining: estimatedTime,
    workTimeSoFar: calculateWorkTime(session)
  };

  session.updates.push(update);
  selectedTaskForWork.workUpdates = session.updates;

  $("workUpdateMsg").textContent = "Progress update sent to manager!";
  setTimeout(() => {
    $("workUpdateMsg").textContent = "";
  }, 3000);

  // Log update
  console.log("Work update submitted:", update);
  renderAssignedTicketsForManager();
}

function completeTask() {
  if (!selectedTaskForWork) return;

  if (!confirm("Mark this task as completed? Ensure all work is done and documented.")) return;

  const session = taskWorkSessionData[selectedTaskForWork.id];
  const totalWorkTime = calculateWorkTime(session);

  selectedTaskForWork.status = "Reported";
  selectedTaskForWork.completedDate = new Date().toISOString();
  selectedTaskForWork.totalWorkTime = totalWorkTime;
  selectedTaskForWork.workNotes = $("workNotes").value;
  selectedTaskForWork.workUpdates = session.updates;
  logAction('employee','report_completed', selectedTaskForWork.id);

  $("workUpdateMsg").textContent = "Task marked as completed! Manager will review.";
  setTimeout(() => {
    $("taskWorkPanel").classList.add("hidden");
    $("workUpdateMsg").textContent = "";
    renderEmployeeTickets();
    renderAssignedTicketsForManager();
    updateEmployeePerformanceStats();
  }, 2000);
}

function calculateWorkTime(session) {
  const now = new Date();
  const totalMs = now - session.startTime - session.totalBreakTime;
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function updateEmployeePerformanceStats() {
  const myEmployeeId = currentUser.employeeId;
  const today = new Date().toISOString().split("T")[0];

  const todayCompletedTickets = tickets.filter(t => 
    t.assignedEmployeeId === myEmployeeId && 
    t.completedDate && 
    t.completedDate.startsWith(today)
  );

  let totalWorkHours = 0;
  todayCompletedTickets.forEach(t => {
    if (t.totalWorkTime) {
      const match = t.totalWorkTime.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        totalWorkHours += parseInt(match[1]) + parseInt(match[2]) / 60;
      }
    }
  });

  $("tasksCompletedToday").textContent = todayCompletedTickets.length;
  $("totalWorkHoursToday").textContent = `${Math.floor(totalWorkHours)}h ${Math.round((totalWorkHours % 1) * 60)}m`;
  
  if (todayCompletedTickets.length > 0) {
    const avgHours = totalWorkHours / todayCompletedTickets.length;
    $("avgTimePerTask").textContent = `${Math.floor(avgHours)}h ${Math.round((avgHours % 1) * 60)}m`;
  }

  const thisMonth = new Date().getMonth();
  const monthCompletedTickets = tickets.filter(t => 
    t.assignedEmployeeId === myEmployeeId && 
    t.completedDate && 
    new Date(t.completedDate).getMonth() === thisMonth
  );
  $("totalTasksMonth").textContent = monthCompletedTickets.length;
}

// tasks UI removed; replaced by description + accept/report flow for employees

/* Payment & Feedback */
let paymentTicket = null;

function openPaymentPage(ticket) {
  paymentTicket = ticket;
  $("payTicketId").textContent = ticket.id;
  $("payCustomer").textContent = ticket.customerName;
  const svc = ticket.serviceType || ticket.callType || 'Sales';
  $("payService").textContent = svc;
  $("payAmount").textContent = servicePricing[svc] || 0;
  if ($("paymentStatusSelect")) $("paymentStatusSelect").value = ticket.paymentStatus || 'pending';
  if ($("paymentAmountInput")) $("paymentAmountInput").value = ticket.amountPaid || '';
  const hist = $("paymentHistoryList");
  if (hist) {
    hist.innerHTML = (ticket.paymentHistory || []).map(h => `<li>${h.date} - ${h.method} - ${h.amount}</li>`).join('');
  }
  $("payMsg").textContent = "";
  $("feedbackMsg").textContent = "";
  $("feedbackComment").value = "";
  $("feedbackRating").value = "5";
  showSection("paymentPage");
}

/* Login handling */
function login() {
  const username = $("loginUsername").value.trim();
  const password = $("loginPassword").value;
  const role = $("loginRole").value;
  $("loginError").textContent = "";

  if (currentUser && currentUser.isLoggedIn) {
    $("loginError").textContent = "You are already logged in.";
    return;
  }

  if (!username || !password) {
    $("loginError").textContent = "Please enter username and password.";
    return;
  }

  if (role === "admin") {
    const admin = admins.find(a => (a.username === username || a.email === username) && a.password === password);
    if (admin) {
      currentUser = { role: "admin", username: admin.username, name: admin.name, userId: admin.id, isLoggedIn: true };
    } else {
      $("loginError").textContent = "Invalid admin credentials.";
      return;
    }
  } else if (role === "frontoffice") {
    const user = frontOfficeUsers.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
      currentUser = { role: "frontoffice", username, name: user.name, userId: user.id, isLoggedIn: true };
    } else {
      $("loginError").textContent = "Invalid front office credentials.";
      return;
    }
  } else if (role === "manager") {
    const user = managers.find(m => (m.username === username || m.email === username) && m.password === password);
    if (user) {
      currentUser = { role: "manager", username, name: user.name, userId: user.id, isLoggedIn: true };
    } else {
      $("loginError").textContent = "Invalid manager credentials.";
      return;
    }
  } else if (role === "employee") {
    const emp = employees.find(
      e =>
        (e.username && e.username === username) ||
        e.email === username
    );
    if (!emp || emp.password !== password) {
      $("loginError").textContent = "Invalid employee credentials.";
      return;
    }
    currentUser = {
      role: "employee",
      username,
      name: emp.name,
      employeeId: emp.id,
      isLoggedIn: true
    };
  } else if (role === "finance") {
    const fin = financeUsers.find(f => (f.username === username || f.email === username) && f.password === password);
    if (fin) {
      currentUser = { role: "finance", username, name: fin.name, userId: fin.id, isLoggedIn: true };
    } else {
      $("loginError").textContent = "Invalid finance credentials.";
      return;
    }
  } else if (role === "helpdesk") {
    const hd = helpDeskUsers.find(h => (h.username === username || h.email === username) && h.password === password);
    if (hd) {
      currentUser = { role: "helpdesk", username, name: hd.name, userId: hd.id, isLoggedIn: true };
    } else {
      $("loginError").textContent = "Invalid help desk credentials.";
      return;
    }
  } else if (role === "hr") {
    const hr = hrUsers.find(h => (h.username === username || h.email === username) && h.password === password);
    if (hr) {
      currentUser = { role: "hr", username, name: hr.name, userId: hr.id, isLoggedIn: true };
    } else {
      $("loginError").textContent = "Invalid HR credentials.";
      return;
    }
  } else {
    $("loginError").textContent = "Invalid credentials.";
    return;
  }

  $("loginUsername").value = "";
  $("loginPassword").value = "";
  onLoginSuccess();
}

function onLoginSuccess() {
  try {
    updateHeader();
    updateStats();
    updateAdminStats();
    renderEmployees();
    renderAdminAllTickets();
    renderAdminCompanies();
    renderAdminCustomers();
    renderCallGroups();
    renderPendingTicketsForManager();
    renderAssignedTicketsForManager();
    renderSalesApprovalsForManager();
    renderSalesVerificationForManager();
    renderHandoverApprovalsForManager();
    renderTaskProgressReports();
    selectedTicketForEmployee = null;
    if ($("ticketDescInfo")) $("ticketDescInfo").textContent = "Select a ticket to view description and actions.";

    startIdleTimer();

    if (currentUser.role === "admin") {
      setupAdminTabNavigation();
      setupEmployeeForm();
      setupAdminManagerEmployees();
      setupOtherEmployeeForm();
      setupManagerForm();
      // Step 8: Initialize the new functions
      populateManagerCallGroupsDropdown();
      setupManagerForm();
      setupGroupForm();
      renderAdminManagers();
      renderAdminCallGroups();
      updateAdminStats();

      setupGroupForm();
      // setupCompanyForm(); // companies removed from admin nav
      setupCustomerForm();
      renderAdminManagerEmployees();
      renderAdminOtherEmployees();
      setupAdminAdminForm();
      renderAdminAdmins();
      applyAdminPermissionUI();
      setupAdminAttendancePanel();
      renderAdminAttendance();
      
      showSection("adminDashboard");
    } else if (currentUser.role === "frontoffice") {
      setupFrontOfficeHandlers();
      renderFrontOfficeTickets();
      showSection("frontOfficeDashboard");
    } else if (currentUser.role === "helpdesk") {
      setupHelpDeskHandlers();
      renderHelpDeskTickets();
      showSection("helpDeskDashboard");
  } else if (currentUser.role === "manager") {
    renderManagerEmployeesBox();
    setupManagerNewTicketForm();
    renderSalesApprovalsForManager();
    showSection("managerDashboard");
  } else if (currentUser.role === "employee") {
    renderEmployeeTickets();
    setupEngineerUpdateSection();
    setupSiteVisitForm();
    setupSalesReportForm();
    setupEmployeeAttendance();
    setupEmployeeModeSwitch();
    showSection("employeeDashboard");
  } else if (currentUser.role === "hr") {
    setupHRAttendancePanel();
    setupHREmployeeCreation();
    renderHRAttendance();
    renderHREmployees();
    setupHREmployeeEdit();
    renderHRManagers();
    setupHRManagerEdit();
    if ($("logoutFromHR")) $("logoutFromHR").onclick = logout;
    showSection("hrDashboard");
  } else if (currentUser.role === "finance") {
    renderFinanceTickets();
    showSection("financeDashboard");
  }
  } catch (error) {
    console.error("Login error:", error);
    if ($("loginError")) $("loginError").textContent = "Error loading dashboard: " + error.message;
    currentUser = null;
    updateHeader();
  }
  const rid = currentUser && (currentUser.employeeId || currentUser.userId);
  const rrole = currentUser && currentUser.role;
  if (rid && rrole !== 'admin' && rrole !== 'hr') { addAttendanceLog(rid, 'login'); }
}

/* Logout */
function logout() {
  const rid = currentUser && (currentUser.employeeId || currentUser.userId);
  const rrole = currentUser && currentUser.role;
  if (currentUser && rrole !== 'admin' && rrole !== 'hr') { addAttendanceLog(rid, 'logout'); }
  currentUser = null;
  updateHeader();
  showSection("loginPage");
  stopIdleTimer();
  if (currentUser) currentUser.isLoggedIn = false;
}

/* Idle session management: auto-logout after 180s inactivity */
let idleTimerId = null;
const IDLE_TIMEOUT_MS = 180000; // 180 seconds

function handleIdleLogout() {
  if (!currentUser) return;
  logAction('system','auto_logout','', 'idle 180s');
  logout();
  const msg = "Session expired due to inactivity.";
  const el = $("loginError");
  if (el) el.textContent = msg;
}

function startIdleTimer() {
  stopIdleTimer();
  idleTimerId = setTimeout(handleIdleLogout, IDLE_TIMEOUT_MS);
}

function resetIdleTimer() {
  if (!currentUser) return;
  startIdleTimer();
}

function stopIdleTimer() {
  if (idleTimerId) {
    clearTimeout(idleTimerId);
    idleTimerId = null;
  }
}

/* Event listeners */
window.onload = () => {
  const appLogo = $("appLogo");
  const welcomeBackHeading = document.querySelector(".login-header h2");
  const signInParagraph = document.querySelector(".login-header p");

  if (appLogo && welcomeBackHeading && signInParagraph) {
    appLogo.addEventListener("mouseover", () => {
    });

    appLogo.addEventListener("mouseout", () => {
    });
  }
  showSection("loginPage");

  $("loginBtn").onclick = login;
  $("logoutBtn").onclick = logout;
  const lb = $("loginBtn"); if (lb) lb.textContent = "Sign In";
  const lob = $("logoutBtn"); if (lob) lob.textContent = "Sign Out";
  const navOutIds = ["logoutFromAdmin","logoutFromFrontOffice","logoutFromManager","logoutFromEmployee","logoutFromHelpDesk","logoutFromHR","logoutFromFinance"];
  navOutIds.forEach(id => { const el = $(id); if (el) el.textContent = "Sign Out"; });

  ['click','mousemove','keydown','wheel','touchstart','touchmove','scroll'].forEach(evt => {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  // Show/hide department field based on role selection
  const empRoleSelect = $("empRole");
  const deptGroup = $("deptGroup");
  
  if (empRoleSelect && deptGroup) {
    empRoleSelect.onchange = () => {
      if (empRoleSelect.value === "employee") {
        deptGroup.classList.remove("hidden");
      } else {
        deptGroup.classList.add("hidden");
      }
    };
  }

  // Call Type dropdown - populate Call Group AND Managers
  const callTypeSelect = $("callType");
  const callGroupSelect = $("callGroup");
  const managerSelect = $("assignedManagerForTicket");
  
  if (callTypeSelect) {
    callTypeSelect.onchange = () => {
      const selectedType = callTypeSelect.value;
      callGroupSelect.innerHTML = "<option value=''>Select Group</option>";
      managerSelect.innerHTML = "<option value=''>-- Manager auto-assigned from group --</option>";
      
      if (selectedType) {
        const matchingGroups = callGroups.filter(g => g.department === selectedType || g.callType === selectedType);
        matchingGroups.forEach(group => {
          const groupOption = document.createElement("option");
          groupOption.value = group.id;
          groupOption.textContent = group.name;
          groupOption.dataset.groupId = group.id;
          callGroupSelect.appendChild(groupOption);
        });
      }
    };
  }

  // Call Group dropdown - no manual manager selection needed (auto-assigned)
  if (callGroupSelect) {
    callGroupSelect.onchange = () => {
      const selectedGroupId = callGroupSelect.value;
      managerSelect.innerHTML = "";
      
      if (selectedGroupId) {
        const group = callGroups.find(g => g.id === selectedGroupId);
        const managerList = group && (group.managers || group.assignedManagers) ? (group.managers || group.assignedManagers) : [];
        
        if (managerList.length > 0) {
          const opt = document.createElement("option");
          opt.value = "";
          opt.textContent = `Auto-assigned to ${managerList.length} manager(s)`;
          opt.disabled = true;
          managerSelect.appendChild(opt);
        } else {
          const noManagerOption = document.createElement("option");
          noManagerOption.value = "";
          noManagerOption.textContent = "No managers assigned to this group";
          noManagerOption.disabled = true;
          managerSelect.appendChild(noManagerOption);
        }
      }
    };
  }

  // Forgot password flow
  const forgotLink = $("forgotLink");
  const sendResetBtn = $("sendResetBtn");
  const sendOtpBtn = $("sendOtpBtn");
  const verifyOtpBtn = $("verifyOtpBtn");
  const fpOtpInput = $("fpOtpInput");
  if (forgotLink) {
    forgotLink.onclick = () => {
      $("fpIdentifier").value = "";
      $("fpMobile").value = "";
      $("fpRole").value = "";
      $("fpMsg").textContent = "";
      $("fpErr").textContent = "";
      // ensure reset-now UI is hidden by default
      const toggle = $("fpResetNowToggle");
      const section = $("fpResetNowSection");
      if (toggle) toggle.checked = false;
      if (section) section.classList.add("hidden");
      showSection("forgotPasswordPage");
    };
  }

  // Store requests and OTPs
  let passwordResetRequests = [];
  let otpStore = {}; // key: role+ident, value: { otp, expiresAt, verified }

  function findUserByRoleAndIdent(role, ident) {
    if (role === "frontoffice") return frontOfficeUsers.find(u => u.username === ident || u.email === ident || u.phone === ident);
    if (role === "manager") return managers.find(u => u.username === ident || u.email === ident || u.phone === ident);
    if (role === "employee") return employees.find(u => (u.username && u.username === ident) || u.email === ident || u.phone === ident);
    if (role === "admin") return admins.find(u => u.username === ident || u.email === ident);
    if (role === "finance") return financeUsers.find(u => u.username === ident || u.email === ident || u.phone === ident);
    if (role === "hr") return hrUsers.find(u => u.username === ident || u.email === ident || u.phone === ident);
    return null;
  }

  if (sendOtpBtn) {
    sendOtpBtn.onclick = () => {
      const ident = $("fpIdentifier").value.trim();
      const role = $("fpRole").value;
      const mobile = $("fpMobile").value.trim();
      $("fpMsg").textContent = "";
      $("fpErr").textContent = "";
      if (!ident || !role || !mobile) {
        $("fpErr").textContent = "Enter username/email, role, and registered mobile number.";
        return;
      }
      const user = findUserByRoleAndIdent(role, ident);
      if (!user || (user.phone && user.phone !== mobile)) {
        $("fpErr").textContent = "User not found or mobile does not match.";
        return;
      }
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const key = role + ':' + (user.username || user.email || user.id);
      otpStore[key] = { otp, expiresAt: Date.now() + 5 * 60 * 1000, verified: false };
      $("fpMsg").textContent = `OTP sent to ${mobile}. For demo, OTP: ${otp}`;
    };
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.onclick = () => {
      const ident = $("fpIdentifier").value.trim();
      const role = $("fpRole").value;
      const user = findUserByRoleAndIdent(role, ident);
      if (!user) { $("fpErr").textContent = "User not found."; return; }
      const key = role + ':' + (user.username || user.email || user.id);
      const rec = otpStore[key];
      const val = fpOtpInput.value.trim();
      if (!rec || !val) { $("fpErr").textContent = "Enter OTP."; return; }
      if (Date.now() > rec.expiresAt) { $("fpErr").textContent = "OTP expired."; return; }
      if (rec.otp !== val) { $("fpErr").textContent = "Invalid OTP."; return; }
      rec.verified = true;
      $("fpMsg").textContent = "OTP verified. You may reset password now.";
      const toggle = $("fpResetNowToggle");
      if (toggle) { toggle.checked = true; toggle.onchange && toggle.onchange(); }
    };
  }
  if (sendResetBtn) {
    sendResetBtn.onclick = () => {
      const ident = $("fpIdentifier").value.trim();
      const role = $("fpRole").value;
      $("fpMsg").textContent = "";
      $("fpErr").textContent = "";

      if (!ident || !role) {
        $("fpErr").textContent = "Please enter username/email and role.";
        return;
      }

      passwordResetRequests.push({ ts: new Date().toISOString(), ident, role });
      logAction('user','request_password_reset', null, `${role}:${ident}`);
      $("fpMsg").textContent = "Request sent to Admin. You will receive a reset link or temporary password by email.";
    };
  }

  // Copy temp password button
  const copyTempBtn = $("copyTempBtn");
  if (copyTempBtn) {
    copyTempBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText("temp1234");
        $("fpMsg").textContent = "Temporary password copied to clipboard.";
      } catch (err) {
        $("fpErr").textContent = "Clipboard copy not supported in this browser.";
      }
    };
  }

  // Toggle for immediate reset
  const fpResetNowToggle = $("fpResetNowToggle");
  const fpResetNowSection = $("fpResetNowSection");
  const fpResetNowBtn = $("fpResetNowBtn");
  if (fpResetNowToggle) {
    fpResetNowToggle.onchange = () => {
      if (fpResetNowToggle.checked) {
        if (fpResetNowSection) fpResetNowSection.classList.remove("hidden");
        if (sendResetBtn) sendResetBtn.classList.add("hidden");
      } else {
        if (fpResetNowSection) fpResetNowSection.classList.add("hidden");
        if (sendResetBtn) sendResetBtn.classList.remove("hidden");
      }
    };
  }

  if (fpResetNowBtn) {
    fpResetNowBtn.onclick = () => {
      const ident = $("fpIdentifier").value.trim();
      const role = $("fpRole").value;
      const newPwd = $("fpNewPassword").value;
      const conf = $("fpConfirmPassword").value;
      $("fpMsg").textContent = "";
      $("fpErr").textContent = "";

      if (!ident || !role) {
        $("fpErr").textContent = "Please enter username/email and role.";
        return;
      }
      if (!newPwd || !conf) {
        $("fpErr").textContent = "Please enter and confirm the new password.";
        return;
      }
      if (newPwd !== conf) {
        $("fpErr").textContent = "Passwords do not match.";
        return;
      }

      let user = null;
      if (role === "frontoffice") {
        user = frontOfficeUsers.find(u => u.username === ident || u.email === ident);
      } else if (role === "manager") {
        user = managers.find(u => u.username === ident || u.email === ident);
      } else if (role === "employee") {
        user = employees.find(u => (u.username && u.username === ident) || u.email === ident);
      } else if (role === "admin") {
        user = admins.find(u => u.username === ident || u.email === ident);
      } else if (role === "hr") {
        user = hrUsers.find(u => u.username === ident || u.email === ident);
      }

      if (!user) {
        $("fpErr").textContent = "No user found with provided identifier and role.";
        return;
      }
      // Require OTP verification for non-admin roles
      if (role !== 'admin') {
        const key = role + ':' + (user.username || user.email || user.id);
        if (!otpStore[key] || !otpStore[key].verified) {
          $("fpErr").textContent = "Please verify OTP sent to your mobile before resetting.";
          return;
        }
      }

      // Set new password immediately
      user.password = newPwd;
      $("fpMsg").textContent = "Password changed successfully. You can now login with the new password.";
      // clear inputs and return to login after a moment
      setTimeout(() => {
        showSection("loginPage");
      }, 1500);
    };
  }

  // Back button delegation: any element with class 'back-btn' should navigate to its data-target
  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest('.back-btn');
    if (!btn) return;
    const target = btn.getAttribute('data-target') || 'loginPage';
    showSection(target);
  });

  // New Customer Button
  const newCustomerBtn = $("newCustomerBtn");
  if (newCustomerBtn) {
    newCustomerBtn.onclick = () => {
      // Populate company dropdown
      const companySel = $("newCustCompany");
      companySel.innerHTML = "<option value=''>Select Company</option>";
      companies.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        companySel.appendChild(opt);
      });
      showSection("newCustomerPage");
    };
  }

  // Add Company Handler
  const addCompanyBtn = $("addCompanyBtn");
  if (addCompanyBtn) {
    addCompanyBtn.onclick = () => {
      const name = $("companyName").value.trim();
      const phone = $("companyPhone").value.trim();
      const email = $("companyEmail").value.trim();
      const gst = $("companyGST").value.trim();
      const addr1 = $("companyAddr1").value.trim();
      const addr2 = $("companyAddr2").value.trim();
      const addr3 = $("companyAddr3").value.trim();
      const pincode = $("companyPincode").value.trim();
      const editId = $("companyName").dataset.editId;

      $("companyAddMsg").textContent = "";
      $("companyAddErr").textContent = "";

      if (!name || !phone || !email || !gst || !pincode) {
        $("companyAddErr").textContent = "Required fields: Name, Phone, Email, GST, Pincode";
        return;
      }

      if (editId) {
        // Update existing company
        const company = companies.find(c => c.id === editId);
        if (company) {
          company.name = name;
          company.phone = phone;
          company.email = email;
          company.gstNo = gst;
          company.address = { line1: addr1, line2: addr2, line3: addr3, pincode };
          $("companyAddMsg").textContent = `Company ${name} updated successfully`;
          renderAdminCompanies();
        }
      } else {
        // Create new company
        const id = generateCompanyId();
        companies.push({
          id,
          name,
          phone,
          email,
          gstNo: gst,
          address: { line1: addr1, line2: addr2, line3: addr3, pincode }
        });
        $("companyAddMsg").textContent = `Company ${name} added with ID ${id}`;
        setTimeout(() => showSection("newCustomerPage"), 1500);
      }

      $("companyName").value = "";
      $("companyPhone").value = "";
      $("companyEmail").value = "";
      $("companyGST").value = "";
      $("companyAddr1").value = "";
      $("companyAddr2").value = "";
      $("companyAddr3").value = "";
      $("companyPincode").value = "";
      $("companyName").dataset.editId = "";
    };
  }

  const cancelCompanyBtn = $("cancelCompanyBtn");
  if (cancelCompanyBtn) {
    cancelCompanyBtn.onclick = () => {
      showSection("frontOfficeDashboard");
      renderFrontOfficeTickets();
    };
  }

  // Add Customer Handler
  const addCustomerBtn = $("addCustomerBtn");
  if (addCustomerBtn) {
    addCustomerBtn.onclick = () => {
      const name = $("newCustName").value.trim();
      const phone = $("newCustPhone").value.trim();
      const email = $("newCustEmail").value.trim();
      const companyId = $("newCustCompany").value;
      const addr1 = $("newCustAddr1").value.trim();
      const addr2 = $("newCustAddr2").value.trim();
      const addr3 = $("newCustAddr3").value.trim();
      const pincode = $("newCustPincode").value.trim();
      const editId = $("newCustName").dataset.editId;

      $("customerAddMsg").textContent = "";
      $("customerAddErr").textContent = "";

      if (!name || !phone || !email || !companyId || !pincode) {
        $("customerAddErr").textContent = "Required fields: Name, Phone, Email, Company, Pincode";
        return;
      }

      if (editId) {
        // Update existing customer
        const customer = customers.find(c => c.id === editId);
        if (customer) {
          customer.name = name;
          customer.phone = phone;
          customer.email = email;
          customer.companyId = companyId;
          customer.address = { line1: addr1, line2: addr2, line3: addr3, pincode };
          $("customerAddMsg").textContent = `Customer ${name} updated successfully`;
          renderAdminCustomers();
        }
      } else {
        // Create new customer
        const id = generateCustomerId();
        customers.push({
          id,
          name,
          phone,
          email,
          companyId,
          address: { line1: addr1, line2: addr2, line3: addr3, pincode }
        });
        $("customerAddMsg").textContent = `Customer ${name} added with ID ${id}`;
      }

      $("newCustName").value = "";
      $("newCustPhone").value = "";
      $("newCustEmail").value = "";
      $("newCustCompany").value = "";
      $("newCustAddr1").value = "";
      $("newCustAddr2").value = "";
      $("newCustAddr3").value = "";
      $("newCustPincode").value = "";
      $("newCustName").dataset.editId = "";

      if (!editId) {
        setTimeout(() => showSection("frontOfficeDashboard"), 1500);
        renderFrontOfficeTickets();
      }
    };
  }

  const cancelCustomerBtn = $("cancelCustomerBtn");
  if (cancelCustomerBtn) {
    cancelCustomerBtn.onclick = () => {
      showSection("frontOfficeDashboard");
      renderFrontOfficeTickets();
    };
  }

  const adminAddCompanyBtn = $("adminAddCompanyBtn");
  if (adminAddCompanyBtn) {
    adminAddCompanyBtn.onclick = () => {
      // Clear form for new company
      $("companyName").value = "";
      $("companyPhone").value = "";
      $("companyEmail").value = "";
      $("companyGst").value = "";
      $("companyAddr1").value = "";
      $("companyAddr2").value = "";
      $("companyAddr3").value = "";
      $("companyPincode").value = "";
      $("companyName").dataset.editId = "";
      $("companyAddMsg").textContent = "";
      $("companyAddErr").textContent = "";
      showSection("newCompanyPage");
    };
  }

  const adminAddCustomerBtn = $("adminAddCustomerBtn");
  if (adminAddCustomerBtn) {
    adminAddCustomerBtn.onclick = () => {
      // Clear form for new customer
      $("newCustName").value = "";
      $("newCustPhone").value = "";
      $("newCustEmail").value = "";
      $("newCustCompany").value = "";
      $("newCustAddr1").value = "";
      $("newCustAddr2").value = "";
      $("newCustAddr3").value = "";
      $("newCustPincode").value = "";
      $("newCustName").dataset.editId = "";
      $("customerAddMsg").textContent = "";
      $("customerAddErr").textContent = "";
      // Populate company dropdown
      const companySelect = $("newCustCompany");
      companySelect.innerHTML = '<option value="">-- Select Company --</option>';
      companies.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        companySelect.appendChild(opt);
      });
      showSection("newCustomerPage");
    };
  }

  const adminAddGroupBtn = $("adminAddGroupBtn");
  if (adminAddGroupBtn) {
    adminAddGroupBtn.onclick = () => {
      const inlineForm = $("addGroupForm");
      if (inlineForm && inlineForm.classList) {
        inlineForm.classList.remove("hidden");
        const nameInput = inlineForm.querySelector('#groupName');
        const typeSelect = inlineForm.querySelector('#groupCallType');
        const msg = inlineForm.querySelector('#groupAddMsg');
        const err = inlineForm.querySelector('#groupAddErr');
        if (nameInput) nameInput.value = "";
        if (typeSelect) typeSelect.value = "";
        if (msg) msg.textContent = "";
        if (err) err.textContent = "";
      } else {
        // Fallback to dedicated page
        $("groupName").value = "";
        $("groupCallType").value = "";
        $("groupServices").value = "";
        $("groupName").dataset.editId = "";
        $("groupAddMsg").textContent = "";
        $("groupAddErr").textContent = "";
        populateGroupManagers([]);
        showSection("newGroupPage");
      }
    };
  }

  const cancelGroupBtn = $("cancelGroupBtn");
  if (cancelGroupBtn) {
    cancelGroupBtn.onclick = () => {
      const inlineForm = $("addGroupForm");
      if (inlineForm && inlineForm.classList) {
        inlineForm.classList.add("hidden");
        renderAdminCallGroups();
        updateAdminStats();
      } else {
        showSection("adminDashboard");
        renderCallGroups();
      }
    };
  }

  const addGroupBtn = $("addGroupBtn");
  if (addGroupBtn) {
    addGroupBtn.onclick = () => {
      const name = $("groupName").value.trim();
      const callType = $("groupCallType").value;
      const services = $("groupServices").value.split(",").map(s => s.trim()).filter(s => s);
      const editId = $("groupName").dataset.editId;

      $("groupAddMsg").textContent = "";
      $("groupAddErr").textContent = "";

      if (!name || !callType) {
        $("groupAddErr").textContent = "Group Name and Call Type are required";
        return;
      }

      // Get selected managers
      const selectedManagers = Array.from(document.querySelectorAll(".manager-checkbox:checked"))
        .map(cb => cb.value);

      if (editId) {
        // Update existing group
        const group = callGroups.find(g => g.id === editId);
        if (group) {
          group.name = name;
          group.department = callType;
          group.callType = callType;
          group.services = services.length > 0 ? services : ["IT Support"];
          group.managers = selectedManagers;
          group.assignedManagers = selectedManagers; // Keep for compatibility
          $("groupAddMsg").textContent = `Group ${name} updated successfully`;
          renderCallGroups();
        }
      } else {
        // Create new group
        const id = generateGroupId();
        callGroups.push({
          id,
          name,
          department: callType,
          callType,
          services: services.length > 0 ? services : ["IT Support"],
          managers: selectedManagers,
          assignedManagers: selectedManagers // Keep for compatibility
        });
        $("groupAddMsg").textContent = `Group ${name} added with ID ${id}`;
      }

      setTimeout(() => {
        showSection("adminDashboard");
        renderCallGroups();
      }, 1500);
    };
  }

  $("addEmployeeBtn").onclick = () => {
    const name = $("empName").value.trim();
    const email = $("empEmail").value.trim();
    const role = $("empRole").value;
    const dept = role === "employee" ? $("empDept").value : "N/A";
    const pwd = $("empPassword").value;

    $("empAddMsg").textContent = "";
    $("empAddErr").textContent = "";

    if (!name || !email || !role || !pwd) {
      $("empAddErr").textContent = "All fields are required.";
      return;
    }
    
    if (role === "employee" && !dept) {
      $("empAddErr").textContent = "Department is required for employees.";
      return;
    }
    
    if (!email.includes("@")) {
      $("empAddErr").textContent = "Enter a valid email.";
      return;
    }

    // Check if email already exists across all user types
    const emailExists = 
      employees.some(e => e.email.toLowerCase() === email.toLowerCase()) ||
      managers.some(m => m.email.toLowerCase() === email.toLowerCase()) ||
      frontOfficeUsers.some(f => f.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      $("empAddErr").textContent = "User with this email already exists.";
      return;
    }

    // Generate username from email (before @)
    const username = email.split("@")[0];

    if (role === "employee") {
      const id = generateEmployeeId();
      employees.push({
        id,
        name,
        email,
        department: dept,
        password: pwd,
        username,
        role: "employee"
      });
      $("empAddMsg").textContent = `Employee ${name} added with ID ${id}. Login with email/username: ${username}`;
    } else if (role === "manager") {
      const id = "M" + String(managers.length + 1).padStart(3, "0");
      managers.push({
        id,
        name,
        email,
        department: "Management",
        password: pwd,
        username,
        role: "manager"
      });
      $("empAddMsg").textContent = `Manager ${name} added with ID ${id}. Login with email/username: ${username}`;
    } else if (role === "frontoffice") {
      const id = "F" + String(frontOfficeUsers.length + 1).padStart(3, "0");
      frontOfficeUsers.push({
        id,
        name,
        email,
        department: "Front Office",
        password: pwd,
        username,
        role: "frontoffice"
      });
      $("empAddMsg").textContent = `Front Office user ${name} added with ID ${id}. Login with email/username: ${username}`;
    }

    $("empName").value = "";
    $("empEmail").value = "";
    $("empPassword").value = "";
    $("empRole").value = "employee";
    $("empDept").value = "IT Support";
    if (deptGroup) deptGroup.classList.remove("hidden");

    renderEmployees();
    updateStats();
  };

  $("createTicketBtn").onclick = () => {
    const custName = $("custName").value.trim();
    const custEmail = $("custEmail").value.trim();
    const callType = $("callType").value;
    const callGroup = $("callGroup").value;
    const assignedManagerId = $("assignedManagerForTicket").value;
    const service = $("serviceType").value;
    const desc = $("ticketDesc").value.trim();
    $("ticketCreateMsg").textContent = "";
    $("ticketCreateErr").textContent = "";

    if (!custName || !custEmail || !callType || !callGroup || !assignedManagerId || !desc) {
      $("ticketCreateErr").textContent = "All fields are required.";
      return;
    }
    if (!custEmail.includes("@")) {
      $("ticketCreateErr").textContent = "Enter a valid email.";
      return;
    }

    // Find customer by name/email
    const customer = customers.find(c => c.name.toLowerCase() === custName.toLowerCase() || c.email.toLowerCase() === custEmail.toLowerCase());
    const customerId = customer ? customer.id : null;
    const companyId = customer ? customer.companyId : null;

    const id = generateTicketId();
    const today = new Date().toISOString().slice(0, 10);
    tickets.push({
      id,
      customerName: custName,
      customerEmail: custEmail,
      customerId: customerId,
      companyId: companyId,
      serviceType: service,
      callType: callType,
      callGroup: callGroup,
      status: "Raised",
      raisedDate: today,
      frontOfficeUser: currentUser.username,
      assignedManagerId: assignedManagerId,
      assignedEmployeeId: null,
      completedDate: null,
      taskStatus: null,
      taskStartedDate: null,
      taskStartedTime: null,
      taskProgress: 0,
      taskNeeds: "",
      taskCompletionImage: null,
      reportedToManager: false,
      tasks: []
    });

    $("custName").value = "";
    $("custEmail").value = "";
    $("ticketDesc").value = "";
    $("callType").value = "";
    $("callGroup").value = "";
    $("assignedManagerForTicket").value = "";
    if (callGroupSelect) callGroupSelect.innerHTML = "<option value=''>Select Group</option>";
    if (managerSelect) managerSelect.innerHTML = "<option value=''>Select Manager</option>";

    $("ticketCreateMsg").textContent = `Ticket ${id} created successfully and assigned to manager.`;
    renderFrontOfficeTickets();
    renderPendingTicketsForManager();
    renderAdminAllTickets();
    updateStats();
  };

  const addTaskBtnEl = $("addTaskBtn");
  if (addTaskBtnEl) {
    addTaskBtnEl.onclick = () => {
      // tasks UI removed; nothing to do here
    };
  }

  const reportCompletedBtn = $("reportCompletedBtn");
  if (reportCompletedBtn) {
    reportCompletedBtn.onclick = () => {
      if (!selectedTicketForEmployee) {
        $("taskAddErr").textContent = "Select a ticket first.";
        return;
      }
      const ticket = selectedTicketForEmployee;
      ticket.status = "Reported";
      ticket.completedDate = formatDateTime();
      renderEmployeeTickets();
      renderAssignedTicketsForManager();
      renderAdminAllTickets();
      renderFrontOfficeReportedTickets();
      updateStats();
      const el = $("workUpdateMsg");
      if (el) el.textContent = "Reported to Front Office. Payment & feedback will be handled by FO.";
    };
  }

  $("payNowBtn").onclick = () => {
    const btn = $("payNowBtn");
    if (btn) btn.disabled = true;
    if (!paymentTicket) return;
    const invoiceDate = $("invoiceDate").value;
    const billedAmount = parseFloat($("billedAmount").value || '0');
    const receivedAmount = parseFloat($("paymentReceivedAmount").value || '0');
    const statusVal = $("paymentStatusSelect").value || 'Pending';
    paymentTicket.invoiceDate = invoiceDate || null;
    paymentTicket.billedAmount = billedAmount || 0;
    paymentTicket.amountPaid = receivedAmount || 0;
    paymentTicket.paymentStatus = statusVal;
    if (!paymentTicket.paymentHistory) paymentTicket.paymentHistory = [];
    paymentTicket.paymentHistory.push({ date: formatDateTime(), method: 'Accounts', amount: receivedAmount, status: statusVal });
    // Only close when work is completed and manager verified
    if (statusVal === 'Full Payment' && paymentTicket.status === 'Reported' && paymentTicket.verifiedByManager) {
      paymentTicket.status = 'Finished';
    }
    $("payMsg").textContent = "Accounts update saved.";
    renderFinanceTickets();
  };
  $("submitFeedbackBtn").onclick = () => {
    const submitBtn = $("submitFeedbackBtn");
    const payBtn = $("payNowBtn");
    if (submitBtn) submitBtn.disabled = true;
    if (payBtn) payBtn.disabled = true;
    if (!paymentTicket) return;
    const rating = $("feedbackRating").value;
    const comment = $("feedbackComment").value.trim();
    const confirmText = $("financeConfirmText") ? $("financeConfirmText").value.trim() : '';
    if (!confirmText) {
      $("feedbackMsg").textContent = "Please enter finance confirmation text.";
      return;
    }
    const recEl = document.querySelector("input[name=recommend]:checked");
    const rec = recEl ? recEl.value : 'yes';
    feedbacks.push({
      ticketId: paymentTicket.id,
      rating,
      comment,
      recommendation: rec
    });
    // Finalize only for completed & verified jobs
    if (paymentTicket.status === 'Reported' && paymentTicket.verifiedByManager) {
      paymentTicket.status = "Finished";
    }
    paymentTicket.paymentSentDate = formatDateTime();
    logAction('finance','confirm_and_complete', paymentTicket.id, confirmText);
    $("feedbackMsg").textContent = "Feedback submitted and payment sent. Ticket marked Finished.";
    // refresh views
    renderFrontOfficeTickets();
    renderFrontOfficeReportedTickets();
    renderAssignedTicketsForManager();
    renderAdminAllTickets();
    renderFinanceTickets();
    updateStats();
  };

  $("backToStatusBtn").onclick = () => {
    if (!currentUser) {
      showSection("loginPage");
      return;
    }
    if (currentUser.role === "employee") {
      renderEmployeeTickets();
      showSection("employeeDashboard");
    } else if (currentUser.role === "manager") {
      showSection("managerDashboard");
    } else if (currentUser.role === "frontoffice") {
      renderFrontOfficeTickets();
      showSection("frontOfficeDashboard");
    } else if (currentUser.role === "admin") {
      showSection("adminDashboard");
    }
  };

  $("logoutFromAdmin").onclick = logout;
  $("logoutFromFrontOffice").onclick = logout;
  $("logoutFromManager").onclick = logout;
  $("logoutFromEmployee").onclick = logout;
  $("logoutFromHelpDesk").onclick = logout;
  $("logoutFromHR").onclick = logout;

  // Employee Work Panel Event Listeners
  const startBreakBtn = $("startBreakBtn");
  const endBreakBtn = $("endBreakBtn");
  const submitProgressUpdateBtn = $("submitProgressUpdateBtn");
  const completeTaskBtn = $("completeTaskBtn");
  const closeWorkPanelBtn = $("closeWorkPanelBtn");
  const workProgressRange = $("workProgressRange");

  if (startBreakBtn) startBreakBtn.onclick = startBreak;
  if (endBreakBtn) endBreakBtn.onclick = endBreak;
  if (submitProgressUpdateBtn) submitProgressUpdateBtn.onclick = submitProgressUpdate;
  if (completeTaskBtn) completeTaskBtn.onclick = completeTask;
  if (closeWorkPanelBtn) {
    closeWorkPanelBtn.onclick = () => {
      $("taskWorkPanel").classList.add("hidden");
      $("workUpdateMsg").textContent = "";
      $("workUpdateErr").textContent = "";
    };
  }

  // Update work time every second when task is open
  setInterval(() => {
    if (selectedTaskForWork && !$("taskWorkPanel").classList.contains("hidden")) {
      updateWorkTimeDisplay();
    }
  }, 1000);

  // Task Progress Tracking Handlers
  const taskProgressRange = $("taskProgressRange");
  if (taskProgressRange) {
    taskProgressRange.oninput = () => {
      $("taskProgressDisplay").textContent = taskProgressRange.value + "%";
    };
  }

  const updateTaskProgressBtn = $("updateTaskProgressBtn");
  if (updateTaskProgressBtn) {
    updateTaskProgressBtn.onclick = () => {
      if (!selectedTicketForEmployee) {
        $("progressUpdateErr").textContent = "Select a ticket first";
        return;
      }
      const status = $("taskStatusSelect").value;
      const progress = parseInt($("taskProgressRange").value) || 0;
      const needs = $("taskNeeds").value.trim();
      const startDate = $("taskStartDate").value;
      const startTime = $("taskStartTime").value;

      $("progressUpdateErr").textContent = "";
      $("progressUpdateMsg").textContent = "";

      if (!status) {
        $("progressUpdateErr").textContent = "Please select a task status";
        return;
      }

      selectedTicketForEmployee.taskStatus = status;
      selectedTicketForEmployee.taskProgress = progress;
      selectedTicketForEmployee.taskNeeds = needs;
      
      if (startDate && !selectedTicketForEmployee.taskStartedDate) {
        selectedTicketForEmployee.taskStartedDate = startDate;
      }
      if (startTime && !selectedTicketForEmployee.taskStartedTime) {
        selectedTicketForEmployee.taskStartedTime = startTime;
      }

      $("progressUpdateMsg").textContent = `Progress updated: ${status}, ${progress}% complete`;
      renderEmployeeTickets();
    };
  }

  const reportTaskBtn = $("reportTaskBtn");
  if (reportTaskBtn) {
    reportTaskBtn.onclick = () => {
      if (!selectedTicketForEmployee) {
        $("progressUpdateErr").textContent = "Select a ticket first";
        return;
      }
      if (!selectedTicketForEmployee.taskStatus) {
        $("progressUpdateErr").textContent = "Update task status first";
        return;
      }

      selectedTicketForEmployee.reportedToManager = true;
      $("progressUpdateMsg").textContent = "Task progress reported to manager";
      
      // Call render function to show report in manager dashboard
      renderTaskProgressReports();
      $("progressUpdateMsg").textContent = "Details shared. Manager can view in Task Progress Reports.";
    };
  }

  const closeProgressBtn = $("closeProgressBtn");
  if (closeProgressBtn) {
    closeProgressBtn.onclick = () => {
      $("customerProgressSection").classList.add("hidden");
      selectedCustomerProgress = null;
    };
  }
};

/* Manager New Ticket Setup */
function setupManagerNewTicketForm() {
  const btn = $("mgrNewTicketBtn");
  const form = $("mgrNewTicketForm");
  const custSel = $("mgrSelectCustomer");
  const createBtn = $("mgrCreateTicketBtn");
  const cancelBtn = $("mgrCancelCreateBtn");
  const newCustBtn = $("mgrNewCustomerBtn");
  const newCustForm = $("mgrNewCustomerForm");
  const custTypeSel = $("mgrCustType");
  const individualBox = $("mgrIndividualNameBox");
  const companyBox = $("mgrCompanyNameBox");
  const contactBox = $("mgrContactPersonBox");
  const gstBox = $("mgrCustGSTBox");
  const saveNewCustBtn = $("mgrSaveNewCustomerBtn");
  const cancelNewCustBtn = $("mgrCancelNewCustomerBtn");
  if (btn) {
    btn.onclick = () => {
      form.classList.remove("hidden");
      // populate customers
      custSel.innerHTML = '<option value="">-- Select Customer --</option>' + customers.map(c => `<option value="${c.id}">${c.type === 'corporate' ? c.companyName : c.name} (${c.phone})</option>`).join('');
      $("mgrNewTicketMsg").textContent = '';
      $("mgrNewTicketErr").textContent = '';
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = () => form.classList.add("hidden");
  }
  if (newCustBtn && newCustForm) {
    newCustBtn.onclick = () => {
      newCustForm.classList.remove('hidden');
      $("mgrNewCustomerMsg").textContent = '';
      $("mgrNewCustomerErr").textContent = '';
      if (custTypeSel) custTypeSel.value = '';
      $("mgrCustName").value = '';
      $("mgrCompanyName").value = '';
      $("mgrContactPerson").value = '';
      $("mgrCustPhone").value = '';
      $("mgrCustEmail").value = '';
      $("mgrCustAddress").value = '';
      $("mgrCustGST").value = '';
      individualBox.classList.remove('hidden');
      companyBox.classList.add('hidden');
      contactBox.classList.add('hidden');
      gstBox.classList.add('hidden');
    };
  }
  if (custTypeSel) {
    custTypeSel.onchange = () => {
      const v = custTypeSel.value;
      if (v === 'corporate') {
        individualBox.classList.add('hidden');
        companyBox.classList.remove('hidden');
        contactBox.classList.remove('hidden');
        gstBox.classList.remove('hidden');
      } else {
        individualBox.classList.remove('hidden');
        companyBox.classList.add('hidden');
        contactBox.classList.add('hidden');
        gstBox.classList.add('hidden');
      }
    };
  }
  if (cancelNewCustBtn && newCustForm) {
    cancelNewCustBtn.onclick = () => newCustForm.classList.add('hidden');
  }
  if (saveNewCustBtn) {
    saveNewCustBtn.onclick = () => {
      const type = custTypeSel.value;
      const name = $("mgrCustName").value.trim();
      const companyName = $("mgrCompanyName").value.trim();
      const contactPerson = $("mgrContactPerson").value.trim();
      const phone = $("mgrCustPhone").value.trim();
      const email = $("mgrCustEmail").value.trim();
      const address = $("mgrCustAddress").value.trim();
      const gst = $("mgrCustGST").value.trim();
      $("mgrNewCustomerErr").textContent = '';
      $("mgrNewCustomerMsg").textContent = '';
      if (!type || !phone || !email || (!name && !companyName)) { $("mgrNewCustomerErr").textContent = 'Fill required fields.'; return; }
      const id = 'CUS' + (customers.length + 1).toString().padStart(3, '0');
      customers.push({ id, type, name: type === 'individual' ? name : companyName, companyName: type === 'corporate' ? companyName : '', phone, email, address, gst: type === 'corporate' ? gst : '', contactPerson: type === 'corporate' ? contactPerson : '', companyId: '' });
      custSel.innerHTML = '<option value="">-- Select Customer --</option>' + customers.map(c => `<option value="${c.id}">${c.type === 'corporate' ? c.companyName : c.name} (${c.phone})</option>`).join('');
      custSel.value = id;
      $("mgrNewCustomerMsg").textContent = 'Customer saved.';
      setTimeout(() => { newCustForm.classList.add('hidden'); }, 1200);
    };
  }
  if (createBtn) {
    createBtn.onclick = () => {
      const custId = custSel.value;
      const ct = $("mgrCallType").value;
      const title = $("mgrProblemTitle").value.trim();
      const desc = $("mgrProblemDesc").value.trim();
      const referredName = $("mgrReferredName") ? $("mgrReferredName").value.trim() : '';
      $("mgrNewTicketErr").textContent = '';
      $("mgrNewTicketMsg").textContent = '';
      if (!custId || !ct || !title || !desc) { $("mgrNewTicketErr").textContent = 'Fill all fields.'; return; }
      const cust = customers.find(c => c.id === custId);
      const id = "TKT" + (tickets.length + 1).toString().padStart(4, "0");
      tickets.push({
        id,
        customerId: cust.id,
        customerName: cust.type === 'corporate' ? cust.companyName : cust.name,
        customerEmail: cust.email,
        customerPhone: cust.phone,
        callType: ct,
        problemTitle: title,
        description: desc,
        callGroup: null,
        raisedByManager: currentUser.userId,
        referralType: referredName ? 'Manager' : '',
        referredByName: referredName || '',
        referredByManagerId: referredName ? currentUser.userId : null,
        assignedManagerIds: [],
        acceptedByManager: null,
        assignedEmployeeId: null,
        taskStatus: null,
        taskProgress: 0,
        completedDate: null,
        raisedDate: new Date().toISOString().split("T")[0],
        status: "Raised",
        paymentStatus: "pending",
        paymentHistory: []
      });
      logAction('manager','create_ticket', id, ct);
      $("mgrNewTicketMsg").textContent = `Ticket ${id} created. Sent to Help Desk.`;
      setTimeout(() => {
        form.classList.add("hidden");
        renderHelpDeskTickets();
        renderAdminAllTickets();
        updateStats();
      }, 1200);
    };
  }
}

/* Engineer Update Section Logic */
function setupEngineerUpdateSection() {
  const statusSel = $("engStatus");
  const completeBox = $("engCompleteFields");
  const incompleteBox = $("engIncompleteFields");
  const submitBtn = $("engSubmitUpdateBtn");
  if (statusSel) {
    statusSel.onchange = () => {
      const v = statusSel.value;
      completeBox.classList.toggle('hidden', v !== 'Complete');
      incompleteBox.classList.toggle('hidden', v !== 'Incomplete');
    };
  }
  if (submitBtn) {
    submitBtn.onclick = () => {
      $("engUpdateErr").textContent = '';
      $("engUpdateMsg").textContent = '';
      const v = $("engStatus").value;
      if (!selectedTaskForWork) { $("engUpdateErr").textContent = 'Open a task in Work Panel first.'; return; }
      const t = selectedTaskForWork;
      t.taskStartDateTime = $("engTaskStart").value || null;
      t.taskEndDateTime = $("engTaskEnd").value || null;
      if (v === 'Complete') {
        t.dcNo = $("engDCNo").value.trim();
        t.engineerRemarks = $("engRemarks").value.trim();
        t.materialsUsed = $("engMaterialsUsed").value.trim();
        if (t.siteVisitRequired) {
          t.status = 'Quotation Ready';
          t.reportedToManager = true;
          t.awaitingManagerQuotationReview = true;
          $("engUpdateMsg").textContent = 'Quotation sent to Manager for review.';
        } else {
          t.status = 'Reported';
          t.awaitingHandover = true;
          $("engUpdateMsg").textContent = 'Engineer update saved.';
        }
      } else if (v === 'Incomplete') {
        t.status = 'In Progress';
        t.pendingReason = $("engPendingReason").value.trim();
        t.nextFollowUpDate = $("engNextFollowUp").value || null;
        $("engUpdateMsg").textContent = 'Engineer update saved.';
      }
      renderAssignedTicketsForManager();
      renderHandoverApprovalsForManager();
      renderEmployeeTickets();
    };
  }
}

function setupSiteVisitForm() {
  const photoInput = $("siteVisitPhoto");
  const preview = $("siteVisitPhotoPreview");
  const submitBtn = $("siteVisitSubmitBtn");
  const ticketSel = $("siteVisitSelectTicket");
  // Populate ticket dropdown with employee-assigned tickets relevant to site visit or sales verification
  if (ticketSel) {
    const myEmployeeId = currentUser && currentUser.employeeId;
              const myTickets = tickets.filter(t => t.assignedEmployeeId === myEmployeeId && (t.status === 'Assigned' || t.status === 'In Progress'));
              const visitable = myTickets.filter(t => t.siteVisitRequired || t.salesVerification);
              ticketSel.innerHTML = '<option value="">-- Select Ticket --</option>' + visitable.map(t => `<option value="${t.id}">${t.id} • ${t.customerName}</option>`).join('');
  }
  if (photoInput && preview) {
    photoInput.onchange = () => {
      preview.innerHTML = "";
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "6px";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    };
  }
  if (submitBtn) {
    submitBtn.onclick = () => {
      $("siteVisitErr").textContent = "";
      $("siteVisitMsg").textContent = "";
      const tid = ticketSel ? ticketSel.value : '';
      if (!tid) { $("siteVisitErr").textContent = "Select a ticket for site visit."; return; }
      const t = tickets.find(x => x.id === tid);
      if (!t || t.assignedEmployeeId !== currentUser.employeeId) { $("siteVisitErr").textContent = "Invalid ticket selection."; return; }
      const statusRaw = $("siteVisitedSelect").value;
      const quotation = $("siteVisitQuotation").value.trim();
      const file = $("siteVisitPhoto").files && $("siteVisitPhoto").files[0];
      if (!statusRaw) { $("siteVisitErr").textContent = "Select site visit status."; return; }
      const status = (statusRaw === 'yes_im_in_site' || statusRaw === 'yes') ? 'OnSite' :
                     (statusRaw === 'on_the_way') ? 'OnTheWay' :
                     (statusRaw === 'no') ? 'NotOnSite' : statusRaw;
      if (!quotation) { $("siteVisitErr").textContent = "Enter description."; return; }
      const finalize = (photoName, photoData) => {
        t.siteVisitStatus = status;
        t.engineerRemarks = quotation;
        t.siteVisitPhotoName = photoName || '';
        t.siteVisitPhotoData = photoData || '';
        if (t.salesVerification) {
          t.awaitingSalesEmployeeVerification = false;
          t.awaitingSalesManagerVerification = true;
          t.routeToSales = true;
          t.status = 'Pending Sales Approval';
          $("siteVisitMsg").textContent = "Sales verification report submitted to Sales Manager.";
          renderSalesVerificationForManager();
        } else {
          t.status = 'Quotation Ready';
          t.reportedToManager = true;
          t.awaitingManagerQuotationReview = true;
          $("siteVisitMsg").textContent = "Site visit report submitted to Manager.";
          renderAssignedTicketsForManager();
        }
        renderEmployeeTickets();
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = () => finalize(file.name, reader.result);
        reader.readAsDataURL(file);
      } else {
        finalize('', '');
      }
    };
  }
}

function setupSalesReportForm() {
  const ticketSel = $("salesReportSelectTicket");
  const photoInput = $("salesReportPhoto");
  const preview = $("salesReportPhotoPreview");
  const verifyBtn = $("salesReportVerifyBtn");
  const declineBtn = $("salesReportDeclineBtn");
  if (ticketSel) {
    const myEmployeeId = currentUser && currentUser.employeeId;
    const myTickets = tickets.filter(t => t.assignedEmployeeId === myEmployeeId && (t.status === 'Assigned' || t.status === 'In Progress') && t.salesVerification);
    ticketSel.innerHTML = '<option value="">-- Select Ticket --</option>' + myTickets.map(t => `<option value="${t.id}">${t.id} • ${t.customerName}</option>`).join('');
  }
  if (photoInput && preview) {
    photoInput.onchange = () => {
      preview.innerHTML = "";
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "6px";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    };
  }
  if (verifyBtn) {
    verifyBtn.onclick = () => {
      $("salesReportErr").textContent = "";
      $("salesReportMsg").textContent = "";
      const tid = ticketSel ? ticketSel.value : '';
      if (!tid) { $("salesReportErr").textContent = "Select a ticket."; return; }
      const t = tickets.find(x => x.id === tid);
      if (!t || t.assignedEmployeeId !== currentUser.employeeId) { $("salesReportErr").textContent = "Invalid ticket selection."; return; }
      const desc = $("salesReportDesc").value.trim();
      const file = $("salesReportPhoto").files && $("salesReportPhoto").files[0];
      const finalize = (photoName, photoData) => {
        t.salesEmployeeReportDesc = desc || '';
        t.salesEmployeeReportPhotoName = photoName || '';
        t.salesEmployeeReportPhotoData = photoData || '';
        t.awaitingSalesEmployeeVerification = false;
        t.awaitingSalesManagerVerification = true;
        t.routeToSales = true;
        t.status = 'Pending Sales Approval';
        $("salesReportMsg").textContent = "Verification sent to Sales Manager.";
        renderSalesVerificationForManager();
        renderSalesApprovalsForManager();
        renderEmployeeTickets();
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = () => finalize(file.name, reader.result);
        reader.readAsDataURL(file);
      } else {
        finalize('', '');
      }
    };
  }
  if (declineBtn) {
    declineBtn.onclick = () => {
      $("salesReportErr").textContent = "";
      $("salesReportMsg").textContent = "";
      const tid = ticketSel ? ticketSel.value : '';
      if (!tid) { $("salesReportErr").textContent = "Select a ticket."; return; }
      const t = tickets.find(x => x.id === tid);
      if (!t || t.assignedEmployeeId !== currentUser.employeeId) { $("salesReportErr").textContent = "Invalid ticket selection."; return; }
      const desc = $("salesReportDesc").value.trim();
      const file = $("salesReportPhoto").files && $("salesReportPhoto").files[0];
      if (!desc) { $("salesReportErr").textContent = "Enter reason for decline."; return; }
      const finalize = (photoName, photoData) => {
        t.salesEmployeeDeclined = true;
        t.salesEmployeeDeclineRemark = desc;
        t.salesEmployeeDeclinePhotoName = photoName || '';
        t.salesEmployeeDeclinePhotoData = photoData || '';
        t.awaitingSalesEmployeeVerification = false;
        t.awaitingSalesManagerVerification = false;
        t.routeToSales = true;
        t.status = 'Pending Sales Approval';
        $("salesReportMsg").textContent = "Decline sent to Sales Manager.";
        renderSalesApprovalsForManager();
        renderEmployeeTickets();
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = () => finalize(file.name, reader.result);
        reader.readAsDataURL(file);
      } else {
        finalize('', '');
      }
    };
  }
}

function setupEmployeeModeSwitch() {
  const btnTask = $("showTaskModeBtn");
  const btnVisit = $("showSiteVisitModeBtn");
  const showTask = () => {
    ["employeePendingCard","employeeActiveCard","employeeCompletedCard"].forEach(id => { const el = $(id); if (el) el.classList.remove('hidden'); });
    ["taskWorkPanel","engineerUpdateSection","employeeHistoryCard"].forEach(id => { const el = $(id); if (el) el.classList.add('hidden'); });
    const sv = $("siteVisitSection"); if (sv) sv.classList.add('hidden');
  };
  const showVisit = () => {
    const sectionsTask = ["employeePendingCard","employeeActiveCard","taskWorkPanel","engineerUpdateSection","employeeCompletedCard","employeeHistoryCard"];
    sectionsTask.forEach(id => { const el = $(id); if (el) el.classList.add('hidden'); });
    const sv = $("siteVisitSection"); if (sv) sv.classList.remove('hidden');
  };
  if (btnTask) btnTask.onclick = showTask;
  if (btnVisit) btnVisit.onclick = showVisit;
  showTask();
}

/* Front Office: render reported tickets and send payment */
function renderFrontOfficeReportedTickets() {
  const tbody = $("frontOfficeReportedTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const reported = tickets.filter(t => t.status === "Reported" && t.frontOfficeUser === currentUser.username && t.verifiedByManager);
  reported.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.serviceType}</td>
      <td>${t.completedDate || ""}</td>
      <td><button class="btn small primary" data-send-payment="${t.id}">Send Payment & Feedback</button></td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-send-payment]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-send-payment");
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      // simulate sending to customer (email/phone)
      if ($("payMsg")) $("payMsg").textContent = `Payment & feedback link prepared for ${ticket.customerEmail}`;
      openPaymentPage(ticket);
      logAction('frontoffice','send_payment_link', ticket.id);
    };
  });
}

/* Show Ticket Progress - Modal/Alert Display */
function showTicketProgress(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) {
    const el = $("mgrActionErr") || $("foTicketErr") || $("progressUpdateErr");
    if (el) el.textContent = "Ticket not found";
    return;
  }
  
  const emp = ticket.assignedEmployeeId ? employees.find(e => e.id === ticket.assignedEmployeeId) : null;
  const empName = emp ? emp.name : "Unassigned";
  const existing = document.getElementById('ticketProgressModal');
  let modal = existing;
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ticketProgressModal';
    modal.className = 'modal';
    const inner = document.createElement('div');
    inner.id = 'ticketProgressContent';
    inner.style.padding = '20px';
    inner.style.background = 'rgba(25,25,25,0.95)';
    inner.style.borderRadius = '12px';
    inner.style.maxWidth = '560px';
    inner.style.margin = '60px auto';
    inner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
    modal.appendChild(inner);
    document.body.appendChild(modal);
  }
  const inner = document.getElementById('ticketProgressContent');
  const progress = Math.max(0, Math.min(100, ticket.taskProgress || 0));
  const status = ticket.taskStatus || 'Not Started';
  inner.innerHTML = `
    <h3 style="color:#e84c3d; margin:0 0 12px 0;">Ticket Progress</h3>
    <div style="color:rgba(255,255,255,0.85); margin-bottom:10px;">${ticket.id} • ${ticket.customerName}</div>
    <div style="display:grid; gap:10px;">
      <div style="color:rgba(255,255,255,0.75)">Assigned: ${empName} • Status: ${ticket.status}</div>
      <div style="background:rgba(255,255,255,0.08); border-radius:10px; padding:8px;">
        <div style="height:16px; background:rgba(255,255,255,0.1); border-radius:8px; overflow:hidden;">
          <div style="height:100%; width:${progress}%; background:linear-gradient(90deg,#5ea2d6,#e84c3d);"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px; color:rgba(255,255,255,0.8)">
          <span>${status}</span>
          <span>${progress}%</span>
        </div>
      </div>
      <div style="color:rgba(255,255,255,0.8);">${ticket.problemTitle || '-'} • ${ticket.description || '-'}</div>
      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
        <button class="btn small secondary" id="tpClose">Close</button>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  const closeBtn = document.getElementById('tpClose');
  if (closeBtn) closeBtn.onclick = () => { modal.classList.add('hidden'); };
}

/* Manager: Task Progress Reports */
function renderTaskProgressReports() {
  const tbody = $("taskReportsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const reported = tickets.filter(t => t.reportedToManager && (t.status === "In Progress" || t.status === "Reported"));
  
  reported.forEach(t => {
    const emp = employees.find(e => e.id === t.assignedEmployeeId);
    const empName = emp ? emp.name : "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${empName}</td>
      <td>${t.taskStatus || "-"}</td>
      <td>${t.taskProgress || 0}%</td>
      <td>${t.taskStartedDate || "-"}</td>
      <td><button class="btn small primary" data-view-task-details="${t.id}">View Details</button></td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll("button[data-view-task-details]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-view-task-details");
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      const emp = employees.find(e => e.id === ticket.assignedEmployeeId);
      const message = `
Ticket: ${ticket.id}
Customer: ${ticket.customerName}
Employee: ${emp ? emp.name : "-"}
Task Status: ${ticket.taskStatus}
Progress: ${ticket.taskProgress}%
Date Started: ${ticket.taskStartedDate}
Time Started: ${ticket.taskStartedTime}
Task Needs: ${ticket.taskNeeds}
      `;
      const el = $("mgrActionMsg");
      if (el) el.textContent = message.replace(/\n/g, " • ");
    };
  });
}

/* Manager: include accepted date in assigned tickets */
function renderAssignedTicketsForManager() {
  const tbody = $("assignedTicketsTableBody");
  tbody.innerHTML = "";
  const myManagerId = currentUser.userId;
  const assigned = tickets.filter(t => 
    (t.acceptedByManager === myManagerId) && 
    (t.status === "Assigned" || t.status === "In Progress" || t.status === "Completed" || t.status === "Reported" || t.status === "Finished" || t.status === "Quotation Ready" || t.status === "Manager Site Visit")
  );
  
  assigned.forEach(t => {
    const emp = t.assignedEmployeeId ? employees.find(e => e.id === t.assignedEmployeeId) : null;
    const empName = emp ? emp.name : "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><button class="btn small primary" data-view-ticket="${t.id}">${t.id}</button></td>
      <td>${t.customerName}</td>
      <td>${t.description}</td>
      <td>${empName}</td>
      <td>${t.acceptedDate || "-"}</td>
      <td>${t.status}</td>
      <td>
        ${t.status === "Quotation Ready" ? '<button class="btn small primary" data-forward-quotation="' + t.id + '">Send Quotation to Sales</button>' : ''}
        ${t.status === "Reported" && !t.verifiedByManager ? '<button class="btn small primary" data-verify="' + t.id + '">Verify</button>' : ''}
        ${t.status !== "Finished" ? '<button class="btn small secondary" data-reassign="' + t.id + '">Reassign</button>' : ''}
        ${t.status === "Manager Site Visit" ? '<button class="btn small primary" data-manager-sitevisit="' + t.id + '">Submit Site Visit Report</button>' : ''}
        <div data-manager-sitevisit-box="${t.id}" class="hidden" style="margin-top:6px; display:flex; flex-direction:column; gap:6px;">
          <select data-manager-sitevisit-status="${t.id}">
            <option value="">Site Visited?</option>
            <option value="Visited">Visited</option>
            <option value="Not Visited">Not Visited</option>
          </select>
          <textarea data-manager-sitevisit-quotation="${t.id}" placeholder="Quotation Description"></textarea>
          <input data-manager-sitevisit-photo="${t.id}" type="file" accept="image/*" />
          <button class="btn small primary" data-manager-sitevisit-submit="${t.id}">Submit</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Add click handlers for viewing ticket progress
  Array.from(tbody.querySelectorAll("button[data-view-ticket]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-view-ticket");
      showTicketProgress(ticketId);
    };
  });

  Array.from(tbody.querySelectorAll("button[data-reassign]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-reassign");
      const ticket = tickets.find(t => t.id === ticketId);
      const employeeNames = employees.map(e => `${e.id} - ${e.name} (${e.department})`).join("\n");
      const empId = prompt("Enter employee ID to reassign to:\n" + employeeNames);
      if (!empId) return;
      const emp = employees.find(e => e.id === empId.trim());
      if (!emp) {
        const msg = $("mgrActionErr");
        if (msg) msg.textContent = "Invalid employee ID";
        return;
      }
      ticket.assignedEmployeeId = emp.id;
      ticket.status = "Assigned";
      ticket.acceptedDate = null;
      ticket.acceptedByEmployeeId = null;
      renderAssignedTicketsForManager();
      renderEmployeeTicketsIfEmployeeLoggedIn();
      renderAdminAllTickets();
      updateStats();
    };
  });

  Array.from(tbody.querySelectorAll("button[data-forward-quotation]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-forward-quotation");
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      const row = btn.closest('tr');
      const cell = row && row.children && row.children[6];
      if (cell) {
        const selId = `forwardSalesMgr_${ticketId}`;
        const salesMgrs = managers.filter(m => (m.assignedDepartments || []).some(d => (d || '').toLowerCase() === 'sales'));
        const wrap = document.createElement('div');
        wrap.innerHTML = `<select id="${selId}"><option value="">Select Sales Manager</option>${salesMgrs.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}</select> <button class="btn small primary" data-confirm-forward-sales="${ticketId}">Send</button>`;
        cell.appendChild(wrap);
        const confirmBtn = wrap.querySelector(`[data-confirm-forward-sales="${ticketId}"]`);
        if (confirmBtn) {
          confirmBtn.onclick = () => {
            const sel = document.getElementById(selId);
            const salesMgr = sel ? sel.value : '';
            if (!salesMgr) return;
            ticket.salesManagerId = salesMgr;
            ticket.routeToSales = true;
            ticket.assignedManagerIds = [salesMgr];
            ticket.salesRequestedByManagerId = currentUser.userId;
            ticket.status = "Pending Sales Approval";
            logAction('manager','forward_quotation_to_sales', ticket.id, ticket.engineerRemarks || '');
            renderAssignedTicketsForManager();
            renderSalesApprovalsForManager();
            renderAdminAllTickets();
            updateStats();
            const msg = $("mgrActionMsg");
            if (msg) msg.textContent = "Quotation sent to Sales manager for approval.";
          };
        }
      }
    };
  });

  Array.from(tbody.querySelectorAll("button[data-verify]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-verify");
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      ticket.verifiedByManager = true;
      ticket.financeReady = true;
      logAction('manager','verify_ticket', ticket.id);
      renderAssignedTicketsForManager();
      renderAdminAllTickets();
      renderFinanceTickets();
      updateStats();
      if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Ticket verified and sent to Finance.";
    };
  });

  Array.from(tbody.querySelectorAll("button[data-manager-sitevisit]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-manager-sitevisit");
      const box = tbody.querySelector(`div[data-manager-sitevisit-box="${ticketId}"]`);
      if (box) box.classList.toggle("hidden");
    };
  });

  Array.from(tbody.querySelectorAll("button[data-manager-sitevisit-submit]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-manager-sitevisit-submit");
      const t = tickets.find(x => x.id === ticketId);
      if (!t) return;
      const statusEl = tbody.querySelector(`select[data-manager-sitevisit-status="${ticketId}"]`);
      const remarksEl = tbody.querySelector(`textarea[data-manager-sitevisit-quotation="${ticketId}"]`);
      const photoEl = tbody.querySelector(`input[data-manager-sitevisit-photo="${ticketId}"]`);
      const status = statusEl ? statusEl.value : '';
      const quotation = remarksEl ? remarksEl.value.trim() : '';
      const file = photoEl && photoEl.files ? photoEl.files[0] : null;
      if (!status) { const e = $("mgrActionErr"); if (e) e.textContent = "Select site visited status."; return; }
      if (!quotation) { const e = $("mgrActionErr"); if (e) e.textContent = "Enter quotation description."; return; }
      if (!file) { const e = $("mgrActionErr"); if (e) e.textContent = "Attach a requirements photo."; return; }
      const reader = new FileReader();
      reader.onload = () => {
        t.siteVisited = status === 'Visited';
        t.engineerRemarks = quotation;
        t.siteVisitPhotoName = file.name;
        t.siteVisitPhotoData = reader.result;
        t.status = 'Quotation Ready';
        t.reportedToManager = true;
        t.awaitingManagerQuotationReview = true;
        renderAssignedTicketsForManager();
        const msg = $("mgrActionMsg");
        if (msg) msg.textContent = "Site visit report submitted. Forward to Sales for approval.";
      };
      reader.readAsDataURL(file);
    };
  });
}

function renderSalesApprovalsForManager() {
  const tbody = $("salesApprovalTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!currentUser || currentUser.role !== 'manager') return;
  const myManagerId = currentUser.userId;
  const isSalesManager = !!(managers.find(m => m.id === myManagerId && (m.assignedDepartments || []).some(d => (d || '').toLowerCase() === 'sales')));
  if (!isSalesManager) { tbody.innerHTML = ""; return; }
  const list = tickets.filter(t => t.routeToSales && t.status === "Pending Sales Approval" && Array.isArray(t.assignedManagerIds) && t.assignedManagerIds.includes(myManagerId));
  list.forEach(t => {
    const tr = document.createElement('tr');
    const desc = t.engineerRemarks || t.managerSiteVisitDescription || t.noSiteVisitDescription || '-';
    const photo = t.siteVisitPhotoData || t.managerSiteVisitPhotoData || t.noSiteVisitPhotoData || '';
    const photoHtml = photo ? `<img src="${photo}" alt="Photo" style="max-width:80px; border-radius:6px;"/>` : '-';
    const employeeOptions = employees
      .filter(e => e.managerId === myManagerId || !e.managerId)
      .map(e => `<option value="${e.id}">${e.name}</option>`)
      .join('');
    const declineInfo = t.salesEmployeeDeclined ? (t.salesEmployeeDeclineRemark || '') : '';
    const declinePhoto = t.salesEmployeeDeclined ? (t.salesEmployeeDeclinePhotoData || '') : '';
    const declinePhotoHtml = declinePhoto ? `<img src="${declinePhoto}" alt="Decline Photo" style="max-width:80px; border-radius:6px;"/>` : '';
    const actionHtml = t.salesEmployeeDeclined
      ? `<div style="margin-bottom:6px; font-size:12px; color:rgba(255,255,255,0.8)">Declined by employee: ${declineInfo || '-'}</div>${declinePhotoHtml ? `<div>${declinePhotoHtml}</div>` : ''}<button class="btn small secondary" data-sales-reject="${t.id}">Cancel Ticket</button>`
      : (!t.salesVerification
        ? `<select id="salesVerifyEmp_${t.id}"><option value="">-- Select Employee --</option>${employeeOptions}</select> <button class="btn small primary" data-confirm-assign-sales-verifier="${t.id}">Assign Verifier</button>`
        : (t.awaitingSalesEmployeeVerification ? `<span>Awaiting employee acceptance</span>` : `<span>Awaiting final verification</span>`));
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${t.quotationTime || '-'}</td>
      <td>${desc}</td>
      <td>${photoHtml}</td>
      <td>${actionHtml}</td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll('button[data-sales-approve]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-sales-approve');
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      t.salesApproved = true;
      t.routeToSales = false;
      const mgrId = t.salesRequestedByManagerId || (t.assignedManagerIds && t.assignedManagerIds[0]);
      t.assignedManagerIds = mgrId ? [mgrId] : [];
      t.acceptedByManager = null;
      t.assignedEmployeeId = null;
      t.status = 'Pending Assignment';
      logAction('sales','approve_return_manager', t.id, t.quotationTime || '');
      renderSalesApprovalsForManager();
      renderPendingTicketsForManager();
      renderAdminAllTickets();
      updateStats();
      const msg = $("mgrActionMsg");
      if (msg) msg.textContent = "Sales approved. Ticket returned to manager for main task assignment.";
    };
  });

  Array.from(tbody.querySelectorAll('button[data-sales-reject]')).forEach(btn => {
    btn.onclick = () => {
      btn.disabled = true;
      const id = btn.getAttribute('data-sales-reject');
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      const remarkInputId = `salesRejectRemark_${id}`;
      let remarkInput = document.getElementById(remarkInputId);
      if (!remarkInput) {
        const row = btn.closest('tr');
        const cell = row && row.children && row.children[3];
        if (cell) {
          const wrap = document.createElement('div');
          wrap.innerHTML = `<input id="${remarkInputId}" type="text" placeholder="Enter reason for cancellation" style="margin-top:6px;" /> <button class="btn small secondary" data-confirm-sales-reject="${id}">Confirm Cancel</button>`;
          cell.appendChild(wrap);
          const inputEl = wrap.querySelector(`#${remarkInputId}`);
          if (inputEl) { inputEl.value = t.salesEmployeeDeclineRemark || ''; }
        }
      }
    };
  });

  Array.from(tbody.querySelectorAll('button[data-confirm-assign-sales-verifier]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-confirm-assign-sales-verifier');
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      const sel = document.getElementById(`salesVerifyEmp_${id}`);
      const empId = sel ? sel.value : '';
      if (!empId) return;
      t.assignedEmployeeId = empId;
      t.assignedManagerIds = [currentUser.userId];
      t.acceptedByManager = null;
      t.salesVerification = true;
      t.awaitingSalesEmployeeVerification = true;
      t.status = 'Assigned';
      logAction('sales','assign_verifier', t.id, empId);
      renderSalesApprovalsForManager();
      renderEmployeeTicketsIfEmployeeLoggedIn();
      renderAdminAllTickets();
      updateStats();
      const msg = $("mgrActionMsg");
      if (msg) msg.textContent = "Sales verifier assigned. Employee will verify and report.";
    };
  });

  Array.from(tbody.querySelectorAll('button[data-confirm-sales-reject]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-confirm-sales-reject');
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      const remarkEl = document.getElementById(`salesRejectRemark_${id}`);
      const remark = remarkEl ? remarkEl.value.trim() : '';
      if (!remark) { return; }
      t.salesApproved = false;
      t.salesApprovalRemark = remark;
      t.routeToSales = false;
      t.status = "Closed";
      t.closedReason = remark;
      t.closedBy = currentUser.userId;
      logAction('sales','reject_close', t.id, t.salesApprovalRemark);
      renderSalesApprovalsForManager();
      renderAdminAllTickets();
      updateStats();
      if ($("mgrActionMsg")) $("mgrActionMsg").textContent = "Sales cancelled the ticket with reason. Ticket closed.";
    };
  });
  attachColumnSelectorForTable('salesApprovalTableBody', getDefaultVisibleColumns('salesApprovalTableBody'));
  applyColumnVisibility('salesApprovalTableBody');
}

function renderSalesVerificationForManager() {
  const tbody = $("salesVerificationTableBody");
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!currentUser || currentUser.role !== 'manager') return;
  const myManagerId = currentUser.userId;
  const isSalesManager = !!(managers.find(m => m.id === myManagerId && (m.assignedDepartments || []).some(d => (d || '').toLowerCase() === 'sales')));
  if (!isSalesManager) { tbody.innerHTML = ''; return; }
  const list = tickets.filter(t => t.awaitingSalesManagerVerification && Array.isArray(t.assignedManagerIds) && t.assignedManagerIds.includes(myManagerId));
  list.forEach(t => {
    const emp = t.assignedEmployeeId ? employees.find(e => e.id === t.assignedEmployeeId) : null;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${emp ? emp.name : '-'}</td>
      <td>
        <button class="btn small primary" data-sales-verify-final="${t.id}">Verify</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll('button[data-sales-verify-final]')).forEach(btn => {
    btn.onclick = () => {
      btn.disabled = true;
      const id = btn.getAttribute('data-sales-verify-final');
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      t.salesVerified = true;
      t.awaitingSalesManagerVerification = false;
      const mgrId = t.salesRequestedByManagerId || (t.originalManagerId || null);
      t.assignedManagerIds = mgrId ? [mgrId] : [];
      t.acceptedByManager = null;
      t.salesVerification = false;
      t.awaitingSalesEmployeeVerification = false;
      t.assignedEmployeeId = null;
      t.status = 'Pending Assignment';
      logAction('sales','verify_return_manager', t.id);
      renderSalesVerificationForManager();
      renderPendingTicketsForManager();
      renderAdminAllTickets();
      updateStats();
      const msg = $("mgrActionMsg");
      if (msg) msg.textContent = "Sales verified. Ticket returned to original manager for final assignment.";
    };
  });
}

function renderHandoverApprovalsForManager() {
  const tbody = $("handoverApprovalsTableBody");
  if (!tbody) return;
  tbody.innerHTML = '';
  const myManagerId = currentUser.userId;
  const list = tickets.filter(t => t.acceptedByManager === myManagerId && t.awaitingHandover);
  list.forEach(t => {
    const emp = employees.find(e => e.id === t.assignedEmployeeId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${emp ? emp.name : '-'}</td>
      <td>${t.materialsUsed || t.engineerRemarks || '-'}</td>
      <td><button class="btn small primary" data-approve-handover="${t.id}">Approve</button></td>
    `;
    tbody.appendChild(tr);
  });
  Array.from(tbody.querySelectorAll('button[data-approve-handover]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-approve-handover');
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      t.awaitingHandover = false;
      t.handoverApproved = true;
      t.verifiedByManager = true;
      t.financeReady = true;
      logAction('manager','handover_approved', t.id);
      renderHandoverApprovalsForManager();
      renderFinanceTickets();
      renderAdminAllTickets();
      updateStats();
    };
  });
}
function renderFinanceTickets() {
  const tbody = $("financeTicketsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const list = tickets.filter(t => t.financeReady || (t.status === "Reported" && t.verifiedByManager) || t.financeAdvanceRequired);
  list.forEach(t => {
    const svcName = t.serviceType || t.callType || 'Sales';
    const amount = servicePricing[svcName] || 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.customerName}</td>
      <td>${svcName}</td>
      <td>${amount}</td>
      <td>${t.paymentStatus || 'pending'}</td>
      <td>
        <button class="btn small primary" data-record-cash="${t.id}">Record Cash Payment</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll('button[data-record-cash]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-record-cash');
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) return;
      openPaymentPage(ticket);
    };
  });
  attachColumnSelectorForTable('financeTicketsTableBody', getDefaultVisibleColumns('financeTicketsTableBody'));
  applyColumnVisibility('financeTicketsTableBody');
}
/* Help Desk */
let hdSelectedTicket = null;
function renderHelpDeskTickets() {
  const tbody = $("helpDeskTicketsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const list = tickets.filter(t => (!t.department || t.department === "") && (t.status === "Pending Assignment" || t.status === "Raised"));
  list.forEach(t => {
    const raisedBy = t.frontOfficeUser ? "Front Office" : (t.raisedByManager ? "Manager" : "-");
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${raisedBy}</td>
      <td>${t.customerName}</td>
      <td>${t.callType || '-'}</td>
      <td>${t.status}</td>
      <td><button class="btn small primary" data-hd-process="${t.id}">Process</button></td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll('button[data-hd-process]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-hd-process');
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) return;
      hdSelectedTicket = ticket;
      $("helpDeskProcessCard").classList.remove("hidden");
      $("hdTicketId").value = ticket.id;
      $("hdCustomer").value = ticket.customerName;
      $("hdCallType").value = ticket.callType || '';
      $("hdDepartment").value = ticket.department || '';
      $("hdProduct").value = ticket.equipment?.product || '';
      $("hdConfig").value = ticket.equipment?.configuration || '';
      $("hdModel").value = ticket.equipment?.model || '';
      $("hdYear").value = ticket.equipment?.year || '';
      $("hdSerial").value = ticket.equipment?.serial || '';
      $("hdAdditional").value = ticket.equipment?.additional || '';
      $("hdRemarks").value = ticket.equipment?.remarks || '';
      const src = $("hdSourceType");
      const refBox = $("hdReferredByBox");
      const refTxt = $("hdReferredByText");
      if (ticket.referredByManagerId && ticket.referredByName) {
        if (refBox) refBox.style.display = 'block';
        if (refTxt) refTxt.value = `${ticket.referredByName} (Manager)`;
        if (src) { src.disabled = true; src.value = 'Manager'; }
      } else {
        if (refBox) refBox.style.display = 'none';
        if (src) { src.disabled = false; src.value = ticket.referralType || ticket.sourceType || ''; }
      }
      $("hdMsg").textContent = '';
      $("hdErr").textContent = '';
    };
  });
}

function setupHelpDeskHandlers() {
  const sendBtn = $("hdSendToDeptBtn");
  const cancelBtn = $("hdCancelBtn");
  const hdCustSel = $("hdSelectExistingCust");
  const hdAddCustBtn = $("hdAddCustomerBtn");
  const hdCreateBtn = $("hdCreateTicketBtn");
  const populateHdCustomers = () => {
    if (!hdCustSel) return;
    const opts = customers.map(c => `<option value="${c.id}">${c.type === 'corporate' ? (c.companyName || c.name) : c.name} (${c.phone || '-'})</option>`).join('');
    hdCustSel.innerHTML = `<option value="">-- Select Customer --</option>` + opts;
  };
  populateHdCustomers();
  if (hdAddCustBtn) {
    hdAddCustBtn.onclick = () => {
      $("hdCreateErr").textContent = '';
      $("hdCreateMsg").textContent = '';
      const name = $("hdNewCustName").value.trim();
      const email = $("hdNewCustEmail").value.trim();
      const phone = $("hdNewCustPhone").value.trim();
      if (!name || !email || !phone) { $("hdCreateErr").textContent = 'Enter name, email, and phone.'; return; }
      if (!email.includes('@')) { $("hdCreateErr").textContent = 'Enter a valid email.'; return; }
      const id = generateCustomerId();
      customers.push({ id, type: 'individual', name, phone, email, address: '', gst: '', contactPerson: '', companyId: '' });
      populateHdCustomers();
      if (hdCustSel) hdCustSel.value = id;
      $("hdCreateMsg").textContent = 'Customer created and selected.';
      $("hdNewCustName").value = '';
      $("hdNewCustEmail").value = '';
      $("hdNewCustPhone").value = '';
    };
  }
  if (hdCreateBtn) {
    hdCreateBtn.onclick = () => {
      $("hdCreateErr").textContent = '';
      $("hdCreateMsg").textContent = '';
      const custId = hdCustSel ? hdCustSel.value : '';
      const callType = $("hdNewCallType").value;
      const title = $("hdNewTitle").value.trim();
      const desc = $("hdNewDesc").value.trim();
      if (!custId || !callType || !title || !desc) { $("hdCreateErr").textContent = 'Fill all fields above.'; return; }
      const cust = customers.find(c => c.id === custId);
      const id = generateTicketId();
      tickets.push({
        id,
        customerId: cust ? cust.id : null,
        customerName: cust ? (cust.type === 'corporate' ? (cust.companyName || cust.name) : cust.name) : '',
        customerEmail: cust ? cust.email : '',
        customerPhone: cust ? cust.phone : '',
        callType,
        problemTitle: title,
        description: desc,
        callGroup: null,
        assignedManagerIds: [],
        acceptedByManager: null,
        assignedEmployeeId: null,
        taskStatus: null,
        taskProgress: 0,
        completedDate: null,
        raisedDate: new Date().toISOString().split('T')[0],
        status: 'Raised',
        paymentStatus: 'pending',
        paymentHistory: [],
        sourceType: 'HelpDesk'
      });
      logAction('helpdesk','create_ticket', id, callType);
      $("hdCreateMsg").textContent = `Ticket ${id} created.`;
      $("hdNewCallType").value = '';
      $("hdNewTitle").value = '';
      $("hdNewDesc").value = '';
      renderHelpDeskTickets();
      renderAdminAllTickets();
      updateStats();
    };
  }
  if (sendBtn) {
    sendBtn.onclick = () => {
      $("hdErr").textContent = '';
      $("hdMsg").textContent = '';
      if (!hdSelectedTicket) { $("hdErr").textContent = 'No ticket selected.'; return; }
      const dept = $("hdDepartment").value;
      if (!dept) { $("hdErr").textContent = 'Select department.'; return; }
      const equipment = {
        product: $("hdProduct").value.trim(),
        configuration: $("hdConfig").value.trim(),
        model: $("hdModel").value.trim(),
        year: $("hdYear").value.trim(),
        serial: $("hdSerial").value.trim(),
        additional: $("hdAdditional").value.trim(),
        remarks: $("hdRemarks").value.trim()
      };
      const sourceType = $("hdSourceType").value;
      hdSelectedTicket.department = dept;
      hdSelectedTicket.equipment = equipment;
      if (!hdSelectedTicket.referredByManagerId) {
        hdSelectedTicket.sourceType = sourceType;
        hdSelectedTicket.referralType = sourceType;
      } else {
        hdSelectedTicket.referralType = 'Manager';
      }
      const assignedMgrIds = managers.filter(m => (m.assignedDepartments || []).some(d => (d || '').toLowerCase() === (dept || '').toLowerCase())).map(m => m.id);
      if (!assignedMgrIds || assignedMgrIds.length === 0) {
        $("hdErr").textContent = 'No managers found for the selected department. Please assign departments to managers in Admin/HR.';
        return;
      }
      hdSelectedTicket.assignedManagerIds = assignedMgrIds;
      hdSelectedTicket.status = "Pending Assignment";
      logAction('helpdesk','process_and_route', hdSelectedTicket.id, dept);
      $("hdMsg").textContent = 'Ticket sent to department managers.';
      setTimeout(() => {
        $("helpDeskProcessCard").classList.add("hidden");
        hdSelectedTicket = null;
        renderHelpDeskTickets();
        renderPendingTicketsForManager();
        renderAdminAllTickets();
        updateStats();
      }, 1200);
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      $("helpDeskProcessCard").classList.add("hidden");
      hdSelectedTicket = null;
    };
  }
}
function renderAdminOtherEmployees() {
  const tbody = $("otherEmployeesTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const perms = getCurrentAdminPerms();
  const rows = [];
  frontOfficeUsers.forEach(u => rows.push({ id: u.id, name: u.name, email: u.email, username: u.username, role: 'frontoffice' }));
  financeUsers.forEach(u => rows.push({ id: u.id, name: u.name, email: u.email, username: u.username, role: 'finance' }));
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.name}</td>
      <td>${r.phone || '-'}</td>
      <td>${r.email}</td>
      <td>${r.username}</td>
      <td>${r.role === 'frontoffice' ? 'Front Office' : 'Finance'}</td>
      <td>
        ${perms.canEdit ? `<button class="btn small primary" data-edit-other="${r.id}" data-role="${r.role}">Edit</button>` : ''}
        ${perms.canDelete ? `<button class="btn small secondary" data-delete-other="${r.id}" data-role="${r.role}">Delete</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  Array.from(tbody.querySelectorAll('button[data-edit-other]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-edit-other');
      const role = btn.getAttribute('data-role');
      const form = $("addOtherEmployeeForm");
      form.classList.remove('hidden');
      const user = role === 'finance' ? financeUsers.find(x => x.id === id) : frontOfficeUsers.find(x => x.id === id);
      if (!user) return;
      $("otherName").value = user.name || '';
      $("otherEmail").value = user.email || '';
      $("otherUsername").value = user.username || '';
      $("otherPassword").value = user.password || '';
      $("otherPhone").value = user.phone || '';
      $("otherRole").value = role;
      form.dataset.editId = id;
      form.dataset.editRole = role;
      $("otherAddMsg").textContent = '';
      $("otherAddErr").textContent = '';
    };
  });

  Array.from(tbody.querySelectorAll('button[data-delete-other]')).forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-delete-other');
      const role = btn.getAttribute('data-role');
      if (!confirm('Delete this user?')) return;
      if (role === 'finance') {
        const idx = financeUsers.findIndex(x => x.id === id);
        if (idx >= 0) financeUsers.splice(idx, 1);
      } else {
        const idx = frontOfficeUsers.findIndex(x => x.id === id);
        if (idx >= 0) frontOfficeUsers.splice(idx, 1);
      }
      renderAdminOtherEmployees();
      updateAdminStats();
    };
  });
}

function setupOtherEmployeeForm() {
  const addBtn = $("adminAddOtherEmployeeBtn");
  const form = $("addOtherEmployeeForm");
  const saveBtn = $("saveOtherEmployeeBtn");
  const cancelBtn = $("cancelOtherEmployeeBtn");

  if (addBtn) {
    addBtn.onclick = () => {
      form.classList.remove('hidden');
      form.dataset.editId = '';
      form.dataset.editRole = '';
      $("otherName").value = '';
      $("otherEmail").value = '';
      $("otherUsername").value = '';
      $("otherPassword").value = '';
      $("otherRole").value = '';
      $("otherAddMsg").textContent = '';
      $("otherAddErr").textContent = '';
    };
  }

  function generateFrontOfficeId() {
    const num = frontOfficeUsers.length + 1;
    return 'F' + String(num).padStart(3, '0');
  }
  function generateFinanceId() {
    const num = financeUsers.length + 1;
    return 'FN' + String(num).padStart(3, '0');
  }

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = $("otherName").value.trim();
      const email = $("otherEmail").value.trim();
      const username = $("otherUsername").value.trim();
      const password = $("otherPassword").value;
      const phone = $("otherPhone").value.trim();
      const role = $("otherRole").value;
      $("otherAddErr").textContent = '';
      $("otherAddMsg").textContent = '';
      if (!name || !email || !username || !password || !phone || !role) {
        $("otherAddErr").textContent = 'All fields are required.';
        return;
      }
      const editId = form.dataset.editId;
      const editRole = form.dataset.editRole;
      if (editId) {
        if (editRole === 'finance') {
          const idx = financeUsers.findIndex(x => x.id === editId);
          if (idx >= 0) Object.assign(financeUsers[idx], { name, email, username, password, phone });
        } else {
          const idx = frontOfficeUsers.findIndex(x => x.id === editId);
          if (idx >= 0) Object.assign(frontOfficeUsers[idx], { name, email, username, password, phone });
        }
        $("otherAddMsg").textContent = `User ${name} updated successfully!`;
      } else {
        if (role === 'finance') {
          const id = generateFinanceId();
          financeUsers.push({ id, name, email, username, password, phone, role: 'finance', department: 'Finance' });
        } else {
          const id = generateFrontOfficeId();
          frontOfficeUsers.push({ id, name, email, username, password, phone, role: 'frontoffice', department: 'Front Office' });
        }
        $("otherAddMsg").textContent = `User ${name} added successfully!`;
      }
      setTimeout(() => {
        form.classList.add('hidden');
        form.dataset.editId = '';
        form.dataset.editRole = '';
        renderAdminOtherEmployees();
        updateAdminStats();
      }, 1200);
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      form.classList.add('hidden');
      form.dataset.editId = '';
      form.dataset.editRole = '';
    };
  }
}
  Array.from(tbody.querySelectorAll("button[data-show-assign]")).forEach(btn => {
    btn.onclick = () => {
      const ticketId = btn.getAttribute("data-show-assign");
      const box = tbody.querySelector(`div[data-assign-box="${ticketId}"]`);
      if (box) box.classList.toggle("hidden");
    };
  });
