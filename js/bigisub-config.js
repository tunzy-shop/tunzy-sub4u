// ============================================
// BIGISUB API CONFIGURATION
// ============================================

const BIGISUB_CONFIG = {
    // Your permanent API token
    TOKEN: 'ed27cc939ed9475a3b7e6c3ade328d72fa956ad6',
    
    // API Base URL
    BASE_URL: 'https://api.bigisub.ng/api/v2/',
    
    // Your transaction PIN (you set this on Bigisub)
    PIN_CODE: '2010', // 🔴 REPLACE '0000' WITH YOUR ACTUAL 4-DIGIT PIN
};

// Helper function for authorized fetch requests
async function bigisubRequest(endpoint, method = 'GET', data = null) {
    const url = BIGISUB_CONFIG.BASE_URL + endpoint;
    const options = {
        method: method,
        headers: {
            'Authorization': `Token ${BIGISUB_CONFIG.TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return await response.json();
}