// ============================================
// TUNZY SUB 4 YOU - COMPLETE APPLICATION
// ============================================

// ============================================
// CONFIGURATION - REPLACE WITH YOUR API KEYS
// ============================================
const CONFIG = {
    // API Provider (VTpass or similar)
    API: {
        BASE_URL: 'https://api.vtpass.com/api',
        PUBLIC_KEY: 'YOUR_VTPASS_PUBLIC_KEY',  // 🔴 REPLACE THIS
        SECRET_KEY: 'YOUR_VTPASS_SECRET_KEY',  // 🔴 REPLACE THIS
    },
    
    // Payment Gateway (Paystack)
    PAYMENT: {
        PUBLIC_KEY: 'pk_test_dca168dd5c169b6aa7e4e85a4b11867a0d52a9e5', // 🔴 REPLACE THIS
    },
    
    // Alternative providers (backup)
    BACKUP_API: {
        BASE_URL: 'https://api.suregifts.com/api',
        API_KEY: 'YOUR_BACKUP_API_KEY',
    }
};

// ============================================
// USER DATA (Will be replaced with real backend)
// ============================================
let currentUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08012345678',
    balance: 5000.00,
    transactions: []
};

// ============================================
// DATA PLANS (Managed from Admin Panel)
// ============================================
let dataPlans = {
    mtn: [
        { id: 'mtn-100mb', name: '100MB', price: 100, type: 'daily', apiCode: 'mtn-daily-100mb' },
        { id: 'mtn-350mb', name: '350MB', price: 200, type: 'daily', apiCode: 'mtn-daily-350mb' },
        { id: 'mtn-750mb', name: '750MB', price: 300, type: 'daily', apiCode: 'mtn-daily-750mb' },
        { id: 'mtn-1gb', name: '1GB', price: 500, type: 'monthly', apiCode: 'mtn-monthly-1gb' },
        { id: 'mtn-2gb', name: '2GB', price: 1000, type: 'monthly', apiCode: 'mtn-monthly-2gb' },
        { id: 'mtn-3gb', name: '3GB', price: 1500, type: 'monthly', apiCode: 'mtn-monthly-3gb' },
        { id: 'mtn-5gb', name: '5GB', price: 2000, type: 'monthly', apiCode: 'mtn-monthly-5gb' },
        { id: 'mtn-10gb', name: '10GB', price: 3000, type: 'monthly', apiCode: 'mtn-monthly-10gb' }
    ],
    glo: [
        { id: 'glo-500mb', name: '500MB', price: 300, type: 'weekly', apiCode: 'glo-weekly-500mb' },
        { id: 'glo-1gb', name: '1GB', price: 500, type: 'weekly', apiCode: 'glo-weekly-1gb' },
        { id: 'glo-2gb', name: '2GB', price: 800, type: 'monthly', apiCode: 'glo-monthly-2gb' },
        { id: 'glo-3gb', name: '3GB', price: 1200, type: 'monthly', apiCode: 'glo-monthly-3gb' },
        { id: 'glo-5gb', name: '5GB', price: 1800, type: 'monthly', apiCode: 'glo-monthly-5gb' },
        { id: 'glo-10gb', name: '10GB', price: 3000, type: 'monthly', apiCode: 'glo-monthly-10gb' }
    ],
    airtel: [
        { id: 'airtel-500mb', name: '500MB', price: 300, type: 'weekly', apiCode: 'airtel-weekly-500mb' },
        { id: 'airtel-1gb', name: '1GB', price: 500, type: 'weekly', apiCode: 'airtel-weekly-1gb' },
        { id: 'airtel-2gb', name: '2GB', price: 900, type: 'monthly', apiCode: 'airtel-monthly-2gb' },
        { id: 'airtel-3gb', name: '3GB', price: 1300, type: 'monthly', apiCode: 'airtel-monthly-3gb' },
        { id: 'airtel-5gb', name: '5GB', price: 2000, type: 'monthly', apiCode: 'airtel-monthly-5gb' },
        { id: 'airtel-10gb', name: '10GB', price: 3500, type: 'monthly', apiCode: 'airtel-monthly-10gb' }
    ],
    '9mobile': [
        { id: '9mobile-500mb', name: '500MB', price: 250, type: 'weekly', apiCode: '9mobile-weekly-500mb' },
        { id: '9mobile-1gb', name: '1GB', price: 500, type: 'weekly', apiCode: '9mobile-weekly-1gb' },
        { id: '9mobile-2gb', name: '2GB', price: 700, type: 'monthly', apiCode: '9mobile-monthly-2gb' },
        { id: '9mobile-3gb', name: '3GB', price: 1000, type: 'monthly', apiCode: '9mobile-monthly-3gb' },
        { id: '9mobile-5gb', name: '5GB', price: 1500, type: 'monthly', apiCode: '9mobile-monthly-5gb' },
        { id: '9mobile-10gb', name: '10GB', price: 2500, type: 'monthly', apiCode: '9mobile-monthly-10gb' }
    ]
};

// ============================================
// MAIN API FUNCTIONS
// ============================================

/**
 * 1. PURCHASE DATA (MAIN FUNCTION)
 * Connects to VTpass or your provider
 */
async function purchaseDataAPI(phone, network, planId, amount) {
    try {
        showLoading('Processing data purchase...');
        
        // Find the plan details
        const plan = findPlanById(planId);
        if (!plan) {
            throw new Error('Plan not found');
        }
        
        // Check balance
        if (currentUser.balance < amount) {
            hideLoading();
            showError('Insufficient balance. Please fund your wallet.');
            return false;
        }
        
        // Map network to API service ID
        const serviceMap = {
            'mtn': 'mtn',
            'glo': 'glo',
            'airtel': 'airtel',
            '9mobile': '9mobile'
        };
        
        // 🔴 ACTUAL API CALL TO VTPASS
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: serviceMap[network],
                phone: phone,
                variation_code: plan.apiCode,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000' || data.code === 'success') {
            // Success - deduct from wallet
            currentUser.balance -= amount;
            
            // Record transaction
            recordTransaction({
                type: 'Data',
                network: network,
                plan: plan.name,
                phone: phone,
                amount: amount,
                status: 'success',
                reference: data.requestId || 'REF' + Date.now()
            });
            
            hideLoading();
            showSuccess(`✅ ${plan.name} data purchased successfully for ${phone}!`);
            
            // Update UI
            updateBalanceDisplay();
            
            return true;
        } else {
            hideLoading();
            showError(`Purchase failed: ${data.response_description || 'Unknown error'}`);
            return false;
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error. Please try again.');
        console.error('Data purchase error:', error);
        
        // Try backup API if main fails
        return await tryBackupAPI(phone, network, planId, amount);
    }
}

/**
 * 2. PURCHASE AIRTIME
 */
async function purchaseAirtimeAPI(phone, amount, network) {
    try {
        showLoading('Purchasing airtime...');
        
        if (currentUser.balance < amount) {
            hideLoading();
            showError('Insufficient balance');
            return false;
        }
        
        const serviceMap = {
            'mtn': 'mtn',
            'glo': 'glo',
            'airtel': 'airtel',
            '9mobile': 'etisalat'
        };
        
        // 🔴 API CALL
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: serviceMap[network],
                phone: phone,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000') {
            currentUser.balance -= amount;
            recordTransaction({
                type: 'Airtime',
                network: network,
                phone: phone,
                amount: amount,
                status: 'success'
            });
            
            hideLoading();
            showSuccess(`✅ Airtime of ₦${amount} purchased for ${phone}!`);
            updateBalanceDisplay();
            return true;
        } else {
            hideLoading();
            showError('Purchase failed');
            return false;
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error');
        return false;
    }
}

/**
 * 3. PAY CABLE TV
 */
async function payTVAPI(provider, cardNumber, packageCode, amount) {
    try {
        showLoading('Processing TV subscription...');
        
        if (currentUser.balance < amount) {
            hideLoading();
            showError('Insufficient balance');
            return false;
        }
        
        // 🔴 API CALL
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: provider,
                billersCode: cardNumber,
                variation_code: packageCode,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000') {
            currentUser.balance -= amount;
            recordTransaction({
                type: 'TV',
                provider: provider,
                cardNumber: cardNumber,
                amount: amount,
                status: 'success'
            });
            
            hideLoading();
            showSuccess('✅ TV subscription successful!');
            updateBalanceDisplay();
            return true;
        } else {
            hideLoading();
            showError('Subscription failed');
            return false;
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error');
        return false;
    }
}

/**
 * 4. PAY ELECTRICITY
 */
async function payElectricityAPI(disco, meterNumber, amount, meterType) {
    try {
        showLoading('Paying electricity bill...');
        
        if (currentUser.balance < amount) {
            hideLoading();
            showError('Insufficient balance');
            return false;
        }
        
        // 🔴 API CALL
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: disco,
                billersCode: meterNumber,
                variation_code: meterType,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000') {
            currentUser.balance -= amount;
            recordTransaction({
                type: 'Electricity',
                disco: disco,
                meterNumber: meterNumber,
                amount: amount,
                status: 'success'
            });
            
            hideLoading();
            showSuccess('✅ Electricity bill paid!');
            updateBalanceDisplay();
            return true;
        } else {
            hideLoading();
            showError('Payment failed');
            return false;
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error');
        return false;
    }
}

/**
 * 5. FUND WALLET (PAYSTACK INTEGRATION)
 */
async function fundWalletAPI(amount) {
    try {
        showLoading('Preparing payment...');
        
        // Load Paystack script if not already loaded
        if (!window.PaystackPop) {
            await loadScript('https://js.paystack.co/v1/inline.js');
        }
        
        const handler = PaystackPop.setup({
            key: CONFIG.PAYMENT.PUBLIC_KEY,
            email: currentUser.email,
            amount: amount * 100, // Convert to kobo
            currency: 'NGN',
            ref: 'TUNZY_' + Math.floor(Math.random() * 1000000000) + Date.now(),
            callback: function(response) {
                // Payment successful
                currentUser.balance += amount;
                recordTransaction({
                    type: 'Funding',
                    amount: amount,
                    status: 'success',
                    reference: response.reference
                });
                
                hideLoading();
                showSuccess(`✅ Wallet funded with ₦${amount}!`);
                updateBalanceDisplay();
            },
            onClose: function() {
                hideLoading();
                showError('Payment cancelled');
            }
        });
        
        hideLoading();
        handler.openIframe();
        
    } catch (error) {
        hideLoading();
        showError('Payment failed to initialize');
        console.error('Paystack error:', error);
    }
}

// ============================================
// BACKUP API (if main fails)
// ============================================
async function tryBackupAPI(phone, network, planId, amount) {
    try {
        console.log('Trying backup API...');
        
        // Find plan
        const plan = findPlanById(planId);
        
        // 🔴 BACKUP API CALL
        const response = await fetch(`${CONFIG.BACKUP_API.BASE_URL}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.BACKUP_API.API_KEY}`
            },
            body: JSON.stringify({
                network: network,
                phone: phone,
                plan: plan.apiCode,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            currentUser.balance -= amount;
            recordTransaction({
                type: 'Data',
                network: network,
                plan: plan.name,
                phone: phone,
                amount: amount,
                status: 'success'
            });
            
            showSuccess(`✅ Data purchase successful via backup!`);
            updateBalanceDisplay();
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Backup API also failed:', error);
        showError('All payment providers unavailable. Please try again later.');
        return false;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Find plan by ID
function findPlanById(planId) {
    for (let network in dataPlans) {
        const plan = dataPlans[network].find(p => p.id === planId);
        if (plan) return plan;
    }
    return null;
}

// Record transaction
function recordTransaction(transaction) {
    transaction.id = Date.now();
    transaction.date = new Date().toLocaleString();
    
    currentUser.transactions.unshift(transaction);
    
    // Save to localStorage (temporary - replace with backend)
    localStorage.setItem('transactions', JSON.stringify(currentUser.transactions));
    
    // Update UI if on history page
    if (window.location.pathname.includes('history.html')) {
        displayTransactionHistory();
    }
}

// Load transaction history
function loadTransactionHistory() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        currentUser.transactions = JSON.parse(saved);
    }
    return currentUser.transactions;
}

// Display transaction history
function displayTransactionHistory() {
    const container = document.getElementById('transactionHistory');
    if (!container) return;
    
    const transactions = loadTransactionHistory();
    
    let html = '';
    transactions.slice(0, 10).forEach(t => {
        html += `
            <tr>
                <td>${t.type}</td>
                <td>${t.network || t.provider || ''}</td>
                <td>₦${t.amount}</td>
                <td><span class="status-badge status-${t.status}">${t.status}</span></td>
                <td>${t.date}</td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// Update balance display
function updateBalanceDisplay() {
    document.querySelectorAll('.wallet-balance').forEach(el => {
        el.textContent = `💰 ₦${currentUser.balance.toLocaleString()}.00`;
    });
}

// Load script dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function showLoading(message) {
    hideLoading();
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-spinner blue-bg">
            <div class="spinner"></div>
            <p>${message || 'Processing...'}</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoading() {
    const existing = document.getElementById('loadingOverlay');
    if (existing) existing.remove();
}

function showSuccess(message) {
    // You can replace with a nicer toast
    alert('✅ ' + message);
}

function showError(message) {
    alert('❌ ' + message);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved balance
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
        currentUser.balance = parseFloat(savedBalance);
    }
    
    // Load saved transactions
    loadTransactionHistory();
    
    // Update balance display
    updateBalanceDisplay();
    
    // Display transaction history if on history page
    if (window.location.pathname.includes('history.html')) {
        displayTransactionHistory();
    }
    
    // Mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showLoading('Logging in...');
            setTimeout(() => {
                hideLoading();
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showLoading('Creating account...');
            setTimeout(() => {
                hideLoading();
                window.location.href = 'login.html';
            }, 1000);
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});

// ============================================
// EXPORT FUNCTIONS FOR HTML
// ============================================
window.purchaseDataAPI = purchaseDataAPI;
window.purchaseAirtimeAPI = purchaseAirtimeAPI;
window.payTVAPI = payTVAPI;
window.payElectricityAPI = payElectricityAPI;
window.fundWalletAPI = fundWalletAPI;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showSuccess = showSuccess;
window.showError = showError;
window.dataPlans = dataPlans;
window.currentUser = currentUser;