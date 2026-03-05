// ============================================
// VTPASS MASTER CONFIGURATION - ADD YOUR KEYS HERE!
// ============================================

const VTPASS_CONFIG = {
    // 🔴🔴🔴 PASTE YOUR ACTUAL VTPASS KEYS HERE 🔴🔴🔴
    PUBLIC_KEY: 'PK_36244626c1178a2d0fe312c4a3f2bb13dd45fd94f6c',  // ← Replace with your real key
    SECRET_KEY: 'SK_592dec3ca053050dc1b889e81f8ba1cf46ecb8a3970',  // ← Replace with your real key
    
    // Base URL - DO NOT CHANGE
    BASE_URL: 'https://api.vtpass.com',
    
    // Profit Configuration - You can adjust these
    PROFIT: {
        DATA_SMALL: 50,
        DATA_MEDIUM: 100,
        DATA_LARGE: 200,
        AIRTIME: 10,
        TV: 500,
        ELECTRICITY: 100,
    },
    
    // Service IDs - DO NOT CHANGE
    services: {
        MTN_DATA: 'mtn-data',
        GLO_DATA: 'glo-data',
        GLO_SME_DATA: 'glo-sme-data',
        AIRTEL_DATA: 'airtel-data',
        NINEMOBILE_DATA: 'etisalat-data',
        MTN_AIRTIME: 'mtn',
        GLO_AIRTIME: 'glo',
        AIRTEL_AIRTIME: 'airtel',
        NINEMOBILE_AIRTIME: 'etisalat',
        DSTV: 'dstv',
        GOTV: 'gotv',
        STARTIMES: 'startimes',
        SHOWMAX: 'showmax',
        IKEDC: 'ikeja-electric',
        EKEDC: 'eko-electric',
        IBEDC: 'ibadan-electric',
        AEDC: 'abuja-electric',
        PHED: 'phed',
        KEDCO: 'kano-electric',
        KAEDCO: 'kaduna-electric',
        EEDC: 'enugu-electric',
        BEDC: 'benin-electric',
        ABA: 'aba-electric',
        YEDC: 'yola-electric',
        JEDC: 'jos-electric'
    }
};

// ============================================
// PROFIT CALCULATION FUNCTIONS
// ============================================

function calculateDataPrice(cost) {
    if (cost < 1000) return cost + VTPASS_CONFIG.PROFIT.DATA_SMALL;
    if (cost < 5000) return cost + VTPASS_CONFIG.PROFIT.DATA_MEDIUM;
    return cost + VTPASS_CONFIG.PROFIT.DATA_LARGE;
}

function calculateAirtimePrice(amount) {
    return amount + VTPASS_CONFIG.PROFIT.AIRTIME;
}

function calculateTVPrice(amount) {
    return amount + VTPASS_CONFIG.PROFIT.TV;
}

function calculateElectricityPrice(amount) {
    return amount + VTPASS_CONFIG.PROFIT.ELECTRICITY;
}

// ============================================
// PROFIT TRACKING
// ============================================

function recordProfit(service, cost, sellingPrice, details = '') {
    const profit = sellingPrice - cost;
    const profitRecord = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
        service: service,
        cost: cost,
        sellingPrice: sellingPrice,
        profit: profit,
        details: details
    };

    let profits = JSON.parse(localStorage.getItem('profitHistory')) || [];
    profits.unshift(profitRecord);
    localStorage.setItem('profitHistory', JSON.stringify(profits.slice(0, 100)));

    const today = new Date().toDateString();
    let dailyProfits = JSON.parse(localStorage.getItem('dailyProfits')) || {};
    dailyProfits[today] = (dailyProfits[today] || 0) + profit;
    localStorage.setItem('dailyProfits', JSON.stringify(dailyProfits));

    return profitRecord;
}

function getTodayProfit() {
    const today = new Date().toDateString();
    const dailyProfits = JSON.parse(localStorage.getItem('dailyProfits')) || {};
    return dailyProfits[today] || 0;
}

function getMonthProfit() {
    const profits = JSON.parse(localStorage.getItem('profitHistory')) || [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return profits.reduce((total, p) => {
        const profitDate = new Date(p.date);
        if (profitDate.getMonth() === currentMonth && profitDate.getFullYear() === currentYear) {
            total += p.profit;
        }
        return total;
    }, 0);
}

function getProfitHistory() {
    return JSON.parse(localStorage.getItem('profitHistory')) || [];
}

// ============================================
// API HELPER FUNCTIONS
// ============================================

function generateRequestId() {
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
                    (now.getMonth() + 1).toString().padStart(2, '0') +
                    now.getDate().toString().padStart(2, '0') +
                    now.getHours().toString().padStart(2, '0') +
                    now.getMinutes().toString().padStart(2, '0') +
                    now.getSeconds().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 10);
    return `${dateStr}_${random}`;
}

// ============================================
// HANDLE API RESPONSE CODES
// ============================================

function handleResponseCode(code, response_desc, customMessages = {}) {
    const messages = {
        '000': 'Transaction successful',
        '001': 'Transaction query successful',
        '010': 'Invalid plan selected. Please choose another plan',
        '011': 'Invalid request. Please check your input',
        '012': 'Service not available at the moment',
        '013': 'Amount is below minimum allowed',
        '014': 'Duplicate transaction detected',
        '015': 'Invalid transaction reference',
        '016': 'Transaction failed. Please try again',
        '017': 'Amount exceeds maximum allowed',
        '018': 'Insufficient wallet balance. Please fund your wallet',
        '019': 'Duplicate transaction. Please wait a moment',
        '021': 'Account temporarily locked',
        '022': 'Account suspended. Contact support',
        '023': 'API access not enabled for this account',
        '027': 'IP address not whitelisted',
        '028': 'Service not activated for your account',
        '030': 'Service temporarily unavailable. Try again later',
        '034': 'Service suspended',
        '083': 'System error. Please try again',
        '089': 'Processing your request. Please wait',
        '091': 'Transaction could not be processed',
        '099': 'Transaction is processing. Please check later',
        ...customMessages
    };

    const isSuccess = code === '000' || code === '001';
    const isPending = code === '089' || code === '099';
    const isFailure = !isSuccess && !isPending;
    
    let message = messages[code] || response_desc || 'Unknown error occurred';
    
    if (code === '018') {
        message = '⚠️ ' + message + ' Click Fund button to add money';
    }

    return {
        code: code,
        message: message,
        isSuccess: isSuccess,
        isPending: isPending,
        isFailure: isFailure
    };
}

// ============================================
// MAKE API CALL
// ============================================

async function vtpassApiCall(endpoint, payload) {
    try {
        const response = await fetch(`${VTPASS_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': VTPASS_CONFIG.PUBLIC_KEY,
                'secret-key': VTPASS_CONFIG.SECRET_KEY
            },
            body: JSON.stringify({
                request_id: generateRequestId(),
                ...payload
            })
        });

        const data = await response.json();
        const handled = handleResponseCode(data.code, data.response_description);
        
        return { ...data, handled };
        
    } catch (error) {
        console.error('VTPASS API Error:', error);
        return {
            code: '083',
            response_description: 'Network error. Please check your connection.',
            handled: handleResponseCode('083', 'Network error. Please check your connection.')
        };
    }
}

// ============================================
// VERIFY METER/SMARTCARD
// ============================================

async function verifyMeter(serviceID, billersCode, type) {
    try {
        const response = await fetch(`${VTPASS_CONFIG.BASE_URL}/merchant-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': VTPASS_CONFIG.PUBLIC_KEY,
                'secret-key': VTPASS_CONFIG.SECRET_KEY
            },
            body: JSON.stringify({ serviceID, billersCode, type })
        });

        const data = await response.json();
        
        if (data.code === '000') {
            return { success: true, data: data.content };
        } else {
            return { success: false, message: data.response_description };
        }
        
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.VTPASS_CONFIG = VTPASS_CONFIG;
window.calculateDataPrice = calculateDataPrice;
window.calculateAirtimePrice = calculateAirtimePrice;
window.calculateTVPrice = calculateTVPrice;
window.calculateElectricityPrice = calculateElectricityPrice;
window.recordProfit = recordProfit;
window.getTodayProfit = getTodayProfit;
window.getMonthProfit = getMonthProfit;
window.getProfitHistory = getProfitHistory;
window.vtpassApiCall = vtpassApiCall;
window.verifyMeter = verifyMeter;
window.handleResponseCode = handleResponseCode;