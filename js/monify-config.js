// ============================================
// MONNIFY CONFIGURATION - TUNZY SUB 4 YOU
// ============================================

const MONNIFY_CONFIG = {
    // 🔴 TEST KEYS (replace with LIVE keys when ready)
    API_KEY: 'MK_TEST_3GVY4PHNJA',
    SECRET_KEY: '2ZZ3E7WXD9H1RM0Y6U8MEZ8FASMCS7D8',
    
    // 🔴 YOU NEED TO GET THIS FROM YOUR MONNIFY DASHBOARD
    CONTRACT_CODE: 'YOUR_CONTRACT_CODE_HERE',  // ← FIND THIS!
    
    // Base URL (TEST environment)
    BASE_URL: 'https://sandbox.monnify.com',
    
    // Live URL (when you switch to live)
    LIVE_URL: 'https://api.monnify.com',
    
    // Is this test mode?
    IS_TEST_MODE: true,
    
    // Webhook URL (where Monnify sends payment notifications)
    WEBHOOK_URL: 'https://tunzy-sub4u.vercel.app/api/monnify-webhook',
    
    // Your service fee (₦ per deposit - your profit!)
    SERVICE_FEE: 10
};

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Get authentication token
async function getMonnifyToken() {
    const authString = btoa(`${MONNIFY_CONFIG.API_KEY}:${MONNIFY_CONFIG.SECRET_KEY}`);
    
    try {
        const response = await fetch(`${MONNIFY_CONFIG.BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.requestSuccessful) {
            return data.responseBody.accessToken;
        } else {
            console.error('Auth failed:', data);
            return null;
        }
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

// ============================================
// VIRTUAL ACCOUNT FUNCTIONS
// ============================================

// Create virtual account for a user
async function createVirtualAccount(userId, userName, userEmail) {
    const token = await getMonnifyToken();
    if (!token) {
        console.error('No token');
        return null;
    }
    
    const reference = `TUNZY_${userId}_${Date.now()}`;
    
    const payload = {
        accountReference: reference,
        accountName: `${userName} - TUNZY`,
        currencyCode: "NGN",
        contractCode: MONNIFY_CONFIG.CONTRACT_CODE,
        customerEmail: userEmail,
        customerName: userName,
        getAllAvailableBanks: true
    };
    
    try {
        const response = await fetch(`${MONNIFY_CONFIG.BASE_URL}/api/v1/bank-transfer/reserved-accounts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.requestSuccessful) {
            const result = data.responseBody;
            return {
                success: true,
                accountNumber: result.accountNumber,
                bankName: result.bankName,
                accountName: result.accountName,
                reservedAccountId: result.reservedAccountId
            };
        } else {
            console.error('Create account failed:', data);
            return { success: false, message: data.responseMessage };
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: error.message };
    }
}

// Get virtual account details for a user
async function getVirtualAccount(accountReference) {
    const token = await getMonnifyToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${MONNIFY_CONFIG.BASE_URL}/api/v1/bank-transfer/reserved-accounts/${accountReference}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ============================================
// TRANSACTION FUNCTIONS
// ============================================

// Check transaction status
async function checkTransactionStatus(transactionReference) {
    const token = await getMonnifyToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${MONNIFY_CONFIG.BASE_URL}/api/v1/merchant/transactions/query?transactionReference=${transactionReference}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Function to call when user funds wallet (webhook)
function processUserDeposit(userId, amount) {
    // Get current balance
    let balance = parseFloat(localStorage.getItem(`userBalance_${userId}`)) || 0;
    
    // Add deposit
    balance += amount;
    localStorage.setItem(`userBalance_${userId}`, balance);
    
    // Record transaction
    const transaction = {
        id: Date.now(),
        userId: userId,
        amount: amount,
        date: new Date().toISOString(),
        type: 'deposit'
    };
    
    let transactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
    transactions.unshift(transaction);
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
    
    return balance;
}

// Export for use in other files
window.MONNIFY_CONFIG = MONNIFY_CONFIG;
window.getMonnifyToken = getMonnifyToken;
window.createVirtualAccount = createVirtualAccount;
window.getVirtualAccount = getVirtualAccount;
window.checkTransactionStatus = checkTransactionStatus;
window.processUserDeposit = processUserDeposit;