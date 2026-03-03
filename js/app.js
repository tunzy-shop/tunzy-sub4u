// TUNZY SUB 4 YOU - MAIN APPLICATION

// ============================================
// CONFIGURATION - REPLACE WITH YOUR API KEYS
// ============================================
const CONFIG = {
    // API Provider (VTpass or similar)
    API: {
        BASE_URL: 'https://api.vtpass.com/api',  // Change to your provider
        PUBLIC_KEY: 'YOUR_API_PUBLIC_KEY_HERE',  // 🔴 REPLACE THIS
        SECRET_KEY: 'YOUR_API_SECRET_KEY_HERE',  // 🔴 REPLACE THIS
    },
    
    // Payment Gateway (Paystack/Flutterwave)
    PAYMENT: {
        PUBLIC_KEY: 'pk_test_dca168dd5c169b6aa7e4e85a4b11867a0d52a9e5',   // 🔴 REPLACE THIS
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
    transactions: [
        {
            id: 1,
            type: 'Airtime',
            amount: 500,
            status: 'success',
            date: '2024-01-15 10:30 AM'
        },
        {
            id: 2,
            type: 'DSTV',
            amount: 3500,
            status: 'success',
            date: '2024-01-14 03:15 PM'
        },
        {
            id: 3,
            type: 'Electricity',
            amount: 2000,
            status: 'pending',
            date: '2024-01-14 11:20 AM'
        }
    ]
};

// ============================================
// API FUNCTIONS - WHERE YOU CONNECT TO PROVIDERS
// ============================================

/**
 * 1. BUY AIRTIME
 * Connects to telecom API to purchase airtime
 */
async function purchaseAirtime(phone, amount, network) {
    try {
        showLoading('Purchasing airtime...');
        
        // 🔴 YOUR API CALL HERE
        // Example with VTpass:
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: network, // 'mtn', 'glo', 'airtel', '9mobile'
                phone: phone,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000') { // Success
            hideLoading();
            showSuccess('Airtime purchased successfully!');
            updateWalletBalance(-amount);
            addTransaction('Airtime', amount, 'success');
            return true;
        } else {
            hideLoading();
            showError('Purchase failed: ' + data.response_description);
            return false;
        }
        
    } catch (error) {
        hideLoading();
        showError('Network error. Please try again.');
        console.error('API Error:', error);
        return false;
    }
}

/**
 * 2. BUY DATA BUNDLE
 */
async function purchaseData(phone, plan, network) {
    try {
        showLoading('Purchasing data...');
        
        // 🔴 YOUR API CALL HERE
        // Similar to airtime but with data plan
        
        // Simulate for now
        setTimeout(() => {
            hideLoading();
            showSuccess('Data purchased successfully!');
            updateWalletBalance(-plan.price);
            addTransaction('Data', plan.price, 'success');
        }, 2000);
        
    } catch (error) {
        hideLoading();
        showError('Data purchase failed');
    }
}

/**
 * 3. PAY CABLE TV
 */
async function payTV(provider, cardNumber, package) {
    try {
        showLoading('Processing TV subscription...');
        
        // 🔴 YOUR API CALL HERE
        // Connect to DSTV/GOTV/Startimes API
        
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: provider, // 'dstv', 'gotv', 'startimes'
                billersCode: cardNumber,
                variation_code: package
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000') {
            hideLoading();
            showSuccess('TV subscription successful!');
            addTransaction(provider.toUpperCase(), package.amount, 'success');
        } else {
            hideLoading();
            showError('Subscription failed: ' + data.response_description);
        }
        
    } catch (error) {
        hideLoading();
        showError('Subscription failed');
        console.error('TV API Error:', error);
    }
}

/**
 * 4. PAY ELECTRICITY
 */
async function payElectricity(disco, meterNumber, amount, meterType) {
    try {
        showLoading('Paying electricity bill...');
        
        // 🔴 YOUR API CALL HERE
        // Connect to electricity distribution company
        
        const response = await fetch(`${CONFIG.API.BASE_URL}/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': CONFIG.API.PUBLIC_KEY,
                'secret-key': CONFIG.API.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: disco, // 'ikeja-electric', 'eko-electric', etc.
                billersCode: meterNumber,
                variation_code: meterType, // 'prepaid' or 'postpaid'
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (data.code === '000') {
            hideLoading();
            showSuccess('Electricity bill paid successfully!');
            updateWalletBalance(-amount);
            addTransaction('Electricity', amount, 'success');
        } else {
            hideLoading();
            showError('Payment failed: ' + data.response_description);
        }
        
    } catch (error) {
        hideLoading();
        showError('Payment failed');
        console.error('Electricity API Error:', error);
    }
}

/**
 * 5. CHECK RESULTS
 */
async function checkResult(examType, examNumber, examYear, pin) {
    try {
        showLoading('Checking result...');
        
        // 🔴 YOUR API CALL HERE
        // Connect to WAEC/NECO/NABTEB API
        
        console.log('Checking:', examType, examNumber, examYear, pin);
        
        // Simulate for now
        setTimeout(() => {
            hideLoading();
            showSuccess('Result retrieved successfully!');
            // Display result
            displayResult({
                name: 'Student Name',
                subjects: [
                    { name: 'Mathematics', grade: 'A1' },
                    { name: 'English', grade: 'B2' },
                    { name: 'Physics', grade: 'C4' }
                ]
            });
        }, 3000);
        
    } catch (error) {
        hideLoading();
        showError('Result check failed');
        console.error('Result API Error:', error);
    }
}

/**
 * 6. FUND WALLET (PAYMENT GATEWAY)
 */
async function fundWallet(amount) {
    try {
        showLoading('Preparing payment...');
        
        // 🔴 INTEGRATE PAYSTACK/FLUTTERWAVE HERE
        
        // Example with Paystack:
        // You need to include Paystack script in your HTML
        if (typeof PaystackPop === 'undefined') {
            // Load Paystack script
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            document.head.appendChild(script);
            
            script.onload = function() {
                initializePayment(amount);
            };
        } else {
            initializePayment(amount);
        }
        
    } catch (error) {
        hideLoading();
        showError('Payment initialization failed');
        console.error('Payment Error:', error);
    }
}

function initializePayment(amount) {
    const handler = PaystackPop.setup({
        key: CONFIG.PAYMENT.PUBLIC_KEY,
        email: currentUser.email,
        amount: amount * 100, // Convert to kobo/cents
        currency: 'NGN',
        ref: 'TUNZY_' + Math.floor(Math.random() * 1000000000),
        callback: function(response) {
            // Payment successful
            hideLoading();
            showSuccess('Wallet funded successfully!');
            updateWalletBalance(amount);
            addTransaction('Wallet Funding', amount, 'success');
        },
        onClose: function() {
            hideLoading();
            showError('Payment cancelled');
        }
    });
    
    hideLoading();
    handler.openIframe();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Show loading overlay
function showLoading(message = 'Processing...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-spinner blue-bg">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Show success message
function showSuccess(message) {
    // You can replace with a nicer toast notification
    alert('✅ ' + message);
}

// Show error message
function showError(message) {
    alert('❌ ' + message);
}

// Update wallet balance in UI
function updateWalletBalance(amount) {
    currentUser.balance += amount;
    
    // Update all balance displays
    document.querySelectorAll('.wallet-balance').forEach(el => {
        el.textContent = `💰 ₦${currentUser.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    });
}

// Add transaction to history
function addTransaction(type, amount, status) {
    const transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        status: status,
        date: new Date().toLocaleString()
    };
    
    currentUser.transactions.unshift(transaction);
    
    // Update transaction table if on dashboard
    updateTransactionTable();
}

// Update transaction table UI
function updateTransactionTable() {
    const tableBody = document.querySelector('.transaction-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    currentUser.transactions.slice(0, 10).forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.type}</td>
            <td>₦${t.amount.toLocaleString()}</td>
            <td><span class="status-badge status-${t.status}">${t.status}</span></td>
            <td>${t.date}</td>
        `;
        tableBody.appendChild(row);
    });
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            showLoading('Logging in...');
            
            // 🔴 CONNECT TO YOUR BACKEND HERE
            // For now, simulate login
            setTimeout(() => {
                hideLoading();
                showSuccess('Login successful!');
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            
            showLoading('Creating account...');
            
            // 🔴 CONNECT TO YOUR BACKEND HERE
            setTimeout(() => {
                hideLoading();
                showSuccess('Account created! Please login.');
                window.location.href = 'login.html';
            }, 1500);
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
    
    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        // Update wallet balance
        updateWalletBalance(0);
        
        // Update transaction table
        updateTransactionTable();
    }
});

// ============================================
// EXPORT FUNCTIONS FOR USE IN HTML
// ============================================
window.purchaseAirtime = purchaseAirtime;
window.purchaseData = purchaseData;
window.payTV = payTV;
window.payElectricity = payElectricity;
window.checkResult = checkResult;
window.fundWallet = fundWallet;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
