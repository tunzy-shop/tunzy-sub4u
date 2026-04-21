// ============================================
// BIGISUB API CONFIGURATION
// ============================================

const BIGISUB_CONFIG = {
    TOKEN: 'ed27cc939ed9475a3b7e6c3ade328d72fa956ad6',
    BASE_URL: 'https://api.bigisub.ng/api/v2/',
    PIN_CODE: '2010'  // 🔴 YOUR PIN FROM THE SCREENSHOT
};

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

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(`Bigisub API [${endpoint}]:`, result);
        return result;
    } catch (error) {
        console.error('Bigisub API Error:', error);
        return { success: false, message: 'Network error' };
    }
}