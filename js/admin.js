// TUNZY SUB 4 YOU - ADMIN PANEL JAVASCRIPT

// Check if admin is logged in
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!isLoggedIn && !window.location.href.includes('admin-login.html')) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Set admin name
    if (adminUser) {
        document.getElementById('adminName').textContent = adminUser;
    }
    
    // Load initial dashboard
    loadDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update date time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load counts
    loadCounts();
});

// Setup all event listeners
function setupEventListeners() {
    // Menu toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('adminSidebar').classList.toggle('collapsed');
    });
    
    // Navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Load corresponding page
            const page = this.dataset.page;
            loadPage(page);
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUser');
            window.location.href = 'admin-login.html';
        }
    });
}

// Load different pages
function loadPage(page) {
    const contentArea = document.getElementById('contentArea');
    
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'services':
            loadServices();
            break;
        case 'api-settings':
            loadAPISettings();
            break;
        case 'wallet':
            loadWalletManagement();
            break;
        case 'reports':
            loadReports();
            break;
        case 'support':
            loadSupport();
            break;
        default:
            loadDashboard();
    }
}

// Load Dashboard
function loadDashboard() {
    const content = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Users</h3>
                    <div class="stat-number" id="totalUsers">1,247</div>
                </div>
                <div class="stat-icon">👥</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Today's Transactions</h3>
                    <div class="stat-number" id="todayTransactions">156</div>
                </div>
                <div class="stat-icon">💳</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Revenue Today</h3>
                    <div class="stat-number" id="todayRevenue">₦124,500</div>
                </div>
                <div class="stat-icon">💰</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Pending Transactions</h3>
                    <div class="stat-number" id="pendingTransactions">23</div>
                </div>
                <div class="stat-icon">⏳</div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h2>Recent Transactions</h2>
                <div class="table-actions">
                    <input type="text" class="search-box" placeholder="Search...">
                    <button class="btn btn-primary" onclick="exportData()">Export</button>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Service</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="recentTransactionsTable">
                    <tr>
                        <td>#T001</td>
                        <td>John Doe</td>
                        <td>Airtime</td>
                        <td>₦500</td>
                        <td><span class="status-badge status-active">Success</span></td>
                        <td>2024-01-15 10:30</td>
                        <td><button class="btn btn-primary btn-small">View</button></td>
                    </tr>
                    <tr>
                        <td>#T002</td>
                        <td>Jane Smith</td>
                        <td>DSTV</td>
                        <td>₦3,500</td>
                        <td><span class="status-badge status-active">Success</span></td>
                        <td>2024-01-15 09:15</td>
                        <td><button class="btn btn-primary btn-small">View</button></td>
                    </tr>
                    <tr>
                        <td>#T003</td>
                        <td>Mike Johnson</td>
                        <td>Electricity</td>
                        <td>₦2,000</td>
                        <td><span class="status-badge status-pending">Pending</span></td>
                        <td>2024-01-15 08:45</td>
                        <td><button class="btn btn-primary btn-small">View</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h2>Recent Users</h2>
                <button class="btn btn-primary" onclick="showAddUserModal()">Add New User</button>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="recentUsersTable">
                    <tr>
                        <td>#U001</td>
                        <td>John Doe</td>
                        <td>john@email.com</td>
                        <td>08012345678</td>
                        <td>₦5,000</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="editUser('U001')">Edit</button>
                            <button class="btn btn-danger btn-small" onclick="deleteUser('U001')">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
}

// Load Users Management
function loadUsers() {
    const content = `
        <div class="table-container">
            <div class="table-header">
                <h2>User Management</h2>
                <div class="table-actions">
                    <input type="text" class="search-box" placeholder="Search users...">
                    <button class="btn btn-success" onclick="showAddUserModal()">+ Add User</button>
                    <button class="btn btn-primary" onclick="exportUsers()">Export</button>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Balance</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    <tr>
                        <td>#U001</td>
                        <td>John Doe</td>
                        <td>john@email.com</td>
                        <td>08012345678</td>
                        <td>₦5,000</td>
                        <td>2024-01-01</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="editUser('U001')">Edit</button>
                            <button class="btn btn-warning btn-small" onclick="fundUser('U001')">Fund</button>
                            <button class="btn btn-danger btn-small" onclick="deleteUser('U001')">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#U002</td>
                        <td>Jane Smith</td>
                        <td>jane@email.com</td>
                        <td>08087654321</td>
                        <td>₦12,500</td>
                        <td>2024-01-02</td>
                        <td><span class="status-badge status-active">Active</span></td>
                        <td>
                            <button class="btn btn-primary btn-small">Edit</button>
                            <button class="btn btn-warning btn-small">Fund</button>
                            <button class="btn btn-danger btn-small">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div class="pagination">
                <button class="btn btn-outline">Previous</button>
                <span class="page-info">Page 1 of 10</span>
                <button class="btn btn-outline">Next</button>
            </div>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
}

// Load API Settings
function loadAPISettings() {
    const content = `
        <div class="table-container">
            <div class="table-header">
                <h2>API Configuration</h2>
                <button class="btn btn-primary" onclick="testAllAPIs()">Test All APIs</button>
            </div>
            
            <div class="api-keys-container">
                <div class="api-key-item">
                    <div class="api-key-header">
                        <span class="api-key-title">VTpass API (Main Provider)</span>
                        <span class="status-badge status-active">Connected</span>
                    </div>
                    <div class="api-key-value" id="vtpassKey">sk_live_••••••••••••••••••••••</div>
                    <div class="api-key-actions">
                        <button class="btn btn-primary btn-small" onclick="showAPIKeyModal('vtpass')">Update Key</button>
                        <button class="btn btn-success btn-small" onclick="testAPI('vtpass')">Test Connection</button>
                        <button class="btn btn-warning btn-small" onclick="toggleVisibility('vtpassKey')">Show/Hide</button>
                    </div>
                </div>
                
                <div class="api-key-item">
                    <div class="api-key-header">
                        <span class="api-key-title">Paystack (Payment Gateway)</span>
                        <span class="status-badge status-active">Connected</span>
                    </div>
                    <div class="api-key-value" id="paystackKey">pk_live_••••••••••••••••••••••</div>
                    <div class="api-key-actions">
                        <button class="btn btn-primary btn-small" onclick="showAPIKeyModal('paystack')">Update Key</button>
                        <button class="btn btn-success btn-small" onclick="testAPI('paystack')">Test Connection</button>
                        <button class="btn btn-warning btn-small" onclick="toggleVisibility('paystackKey')">Show/Hide</button>
                    </div>
                </div>
                
                <div class="api-key-item">
                    <div class="api-key-header">
                        <span class="api-key-title">SMS Gateway (Notifications)</span>
                        <span class="status-badge status-warning">Not Configured</span>
                    </div>
                    <div class="api-key-value" id="smsKey">Not set</div>
                    <div class="api-key-actions">
                        <button class="btn btn-primary btn-small" onclick="showAPIKeyModal('sms')">Configure</button>
                        <button class="btn btn-success btn-small" onclick="testAPI('sms')">Test Connection</button>
                    </div>
                </div>
            </div>
            
            <div class="api-settings">
                <h3>API Endpoints</h3>
                <table class="data-table">
                    <tr>
                        <td>Base URL</td>
                        <td><input type="text" value="https://api.vtpass.com/api" class="form-control"></td>
                    </tr>
                    <tr>
                        <td>Timeout (seconds)</td>
                        <td><input type="number" value="30" class="form-control"></td>
                    </tr>
                    <tr>
                        <td>Retry Attempts</td>
                        <td><input type="number" value="3" class="form-control"></td>
                    </tr>
                </table>
                
                <button class="btn btn-primary" onclick="saveAPISettings()">Save Settings</button>
            </div>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
}

// Load Wallet Management
function loadWalletManagement() {
    const content = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Platform Balance</h3>
                    <div class="stat-number">₦2,456,780</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Today's Funding</h3>
                    <div class="stat-number">₦124,500</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Withdrawals</h3>
                    <div class="stat-number">₦1,234,560</div>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h2>Wallet Transactions</h2>
                <button class="btn btn-primary" onclick="showManualFunding()">+ Manual Funding</button>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Reference</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>Credit</td>
                        <td>₦5,000</td>
                        <td>REF123456</td>
                        <td><span class="status-badge status-active">Success</span></td>
                        <td>2024-01-15</td>
                        <td><button class="btn btn-primary btn-small">View</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
}

// Load Reports
function loadReports() {
    const content = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>This Month's Revenue</h3>
                    <div class="stat-number">₦3.2M</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Transactions</h3>
                    <div class="stat-number">15,678</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Active Users</h3>
                    <div class="stat-number">2,847</div>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h2>Generate Reports</h2>
                <div>
                    <select class="form-control" style="width: 200px;">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Custom Range</option>
                    </select>
                    <button class="btn btn-primary">Generate</button>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Transactions</th>
                        <th>Revenue</th>
                        <th>New Users</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2024-01-15</td>
                        <td>156</td>
                        <td>₦124,500</td>
                        <td>12</td>
                        <td><button class="btn btn-primary btn-small">Download</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('contentArea').innerHTML = content;
}

// Load Support/Contact Messages
function loadSupport() {
    const content = `
        <div class="table-container">
            <div class="table-header">
                <h2>Support Messages</h2>
                <select class="form-control" style="width: 150px;">
                    <option>All Messages</option>
                    <option>Unread</option>
                    <option>Replied</option>
                </select>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>Payment Issue</td>
                        <td>I paid but airtime not delivered...</td>
                        <td><span cla
