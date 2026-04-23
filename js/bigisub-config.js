// ============================================
// BIGISUB API CONFIGURATION
// ============================================

const BIGISUB_CONFIG = {
    TOKEN: 'ed27cc939ed9475a3b76e63ade328d72fa956ad6',
    BASE_URL: 'https://api.bigisub.ng/api/v2/',
    PIN_CODE: '2010'
};

async function bigisubRequest(endpoint, method = 'GET', data = null) {
    const url = BIGISUB_CONFIG.BASE_URL + endpoint;
    const options = {
        method: method,
        headers: {
            'Authorization': `Token ${BIGISUB_CONFIG.TOKEN}`,
            'Content-Type': 'application/json'
        }
    };
    if (data) options.body = JSON.stringify(data);
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error('Bigisub API Error:', error);
        return { success: false, message: 'Network error' };
    }
}