// ============================================
// MONNIFY CONFIGURATION - TUNZY SUB
// ============================================

const MONNIFY_CONFIG = {
    // LIVE KEYS
    API_KEY: 'MK_PROD_4FS0VW1PW5',
    SECRET_KEY: 'FNQLL426TMHXHNW70MHWEATGBG3XNCUT',
    CONTRACT_CODE: '513315958327',
    
    // Base URL
    BASE_URL: 'https://api.monnify.com',
    
    // Webhook URL
    WEBHOOK_URL: 'https://tunzy-sub4u.vercel.app/api/monnify-webhook',
    
    // Settings
    IS_TEST_MODE: false,
    SERVICE_FEE: 10,  // ₦10 fee per deposit
    BVN_LIMIT: 20000   // Limit for users without BVN
};

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

// Create virtual account for a user
async function createVirtualAccount(userId, userName, userEmail, bvn = null, nin = null) {
    const token = await getMonnifyToken();
    if (!token) return { success: false, message: 'Authentication failed' };
    
    const reference = `TUNZY_${userId}_${Date.now()}`;
    
    const payload = {
        accountReference: reference,
        accountName: `${userName} - TUNZY SUB`,
        currencyCode: "NGN",
        contractCode: MONNIFY_CONFIG.CONTRACT_CODE,
        customerEmail: userEmail,
        customerName: userName,
        getAllAvailableBanks: true
    };
    
    // Add BVN or NIN if provided
    if (bvn) payload.bvn = bvn;
    if (nin) payload.nin = nin;
    
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
                reservedAccountId: result.reservedAccountId,
                hasBVN: !!bvn,
                limit: bvn ? null : MONNIFY_CONFIG.BVN_LIMIT
            };
        } else {
            return { success: false, message: data.responseMessage };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Update BVN for existing account
async function updateAccountBVN(accountReference, bvn, nin = null) {
    const token = await getMonnifyToken();
    if (!token) return { success: false };
    
    const payload = { accountReference, bvn };
    if (nin) payload.nin = nin;
    
    try {
        const response = await fetch(`${MONNIFY_CONFIG.BASE_URL}/api/v1/bank-transfer/reserved-accounts/update-bvn`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        return { success: data.requestSuccessful };
    } catch (error) {
        return { success: false };
    }
}

// Export functions
window.MONNIFY_CONFIG = MONNIFY_CONFIG;
window.getMonnifyToken = getMonnifyToken;
window.createVirtualAccount = createVirtualAccount;
window.updateAccountBVN = updateAccountBVN;