// ============================================
// VTPASS MASTER CONFIGURATION - ALL SERVICES
// ============================================

const VTPASS_CONFIG = {
    // API Keys - PASTE YOUR KEYS HERE
    PUBLIC_KEY: 'YOUR_VTPASS_PUBLIC_KEY',
    SECRET_KEY: 'YOUR_VTPASS_SECRET_KEY',
    
    // Base URLs
    BASE_URL: 'https://vtpass.com/api',
    
    // Profit Configuration - YOU CAN CHANGE THESE!
    PROFIT: {
        // Fixed profit per transaction
        DATA_SMALL: 50,     // ₦50 profit for data under ₦1000
        DATA_MEDIUM: 100,   // ₦100 profit for data ₦1000-₦5000
        DATA_LARGE: 200,    // ₦200 profit for data over ₦5000
        AIRTIME: 20,        // ₦20 profit for airtime
        TV: 500,            // ₦500 profit for TV subscriptions
        ELECTRICITY: 100,   // ₦100 profit for electricity
    },
    
    // Service IDs
    services: {
        // Data Services
        MTN_DATA: 'mtn-data',
        GLO_DATA: 'glo-data',
        GLO_SME_DATA: 'glo-sme-data',
        AIRTEL_DATA: 'airtel-data',
        NINEMOBILE_DATA: 'etisalat-data',
        
        // Airtime Services
        MTN_AIRTIME: 'mtn',
        GLO_AIRTIME: 'glo',
        AIRTEL_AIRTIME: 'airtel',
        NINEMOBILE_AIRTIME: 'etisalat',
        
        // Cable TV Services
        DSTV: 'dstv',
        GOTV: 'gotv',
        STARTIMES: 'startimes',
        SHOWMAX: 'showmax',
        
        // Electricity Services (All Discos)
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

// Calculate selling price based on cost
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

// Record profit after successful transaction
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
    
    // Save to localStorage
    let profits = JSON.parse(localStorage.getItem('profitHistory')) || [];
    profits.unshift(profitRecord);
    localStorage.setItem('profitHistory', JSON.stringify(profits.slice(0, 100)));
    
    // Update daily profit
    updateDailyProfit(profit);
    
    return profitRecord;
}

// Update daily profit total
function updateDailyProfit(profit) {
    const today = new Date().toDateString();
    let dailyProfits = JSON.parse(localStorage.getItem('dailyProfits')) || {};
    
    if (!dailyProfits[today]) {
        dailyProfits[today] = 0;
    }
    dailyProfits[today] += profit;
    
    localStorage.setItem('dailyProfits', JSON.stringify(dailyProfits));
}

// Get today's total profit
function getTodayProfit() {
    const today = new Date().toDateString();
    const dailyProfits = JSON.parse(localStorage.getItem('dailyProfits')) || {};
    return dailyProfits[today] || 0;
}

// Get this month's total profit
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

// Get all profit history
function getProfitHistory() {
    return JSON.parse(localStorage.getItem('profitHistory')) || [];
}

// ============================================
// API HELPER FUNCTIONS
// ============================================

// Generate unique request ID (format: YYYYMMDDHHMMSS_random)
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

// Make API call to VTPASS
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
        
        return await response.json();
    } catch (error) {
        console.error('VTPASS API Error:', error);
        return {
            code: '083',
            response_description: 'System error. Please try again.'
        };
    }
}

// Verify meter/smartcard number
async function verifyMeter(serviceID, billersCode, type) {
    try {
        const response = await fetch(`${VTPASS_CONFIG.BASE_URL}/merchant-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': VTPASS_CONFIG.PUBLIC_KEY,
                'secret-key': VTPASS_CONFIG.SECRET_KEY
            },
            body: JSON.stringify({
                serviceID,
                billersCode,
                type
            })
        });
        
        return await response.json();
    } catch (error) {
        return {
            code: '083',
            response_description: 'Verification failed'
        };
    }
}

// Query transaction status
async function requeryTransaction(requestId) {
    return vtpassApiCall('/requery', { request_id: requestId });
}

// ============================================
// HANDLE API RESPONSE CODES
// ============================================

function handleResponseCode(code, response_desc, customMessages = {}) {
    const messages = {
        '000': 'Transaction successful',
        '001': 'Transaction query',
        '010': 'Invalid variation code',
        '011': 'Invalid arguments',
        '012': 'Product does not exist',
        '013': 'Below minimum amount allowed',
        '014': 'Request ID already exists',
        '015': 'Invalid request ID',
        '016': 'Transaction failed',
        '017': 'Above maximum amount allowed',
        '018': 'Insufficient wallet balance',
        '019': 'Duplicate transaction detected',
        '020': 'Biller confirmed',
        '021': 'Account locked',
        '022': 'Account suspended',
        '023': 'API access not enabled',
        '024': 'Account inactive',
        '027': 'IP not whitelisted',
        '028': 'Product not whitelisted',
        '030': 'Biller unreachable',
        '034': 'Service suspended',
        '035': 'Service inactive',
        '040': 'Transaction reversal',
        '083': 'System error',
        '087': 'Invalid credentials',
        '089': 'Request processing',
        '091': 'Transaction not processed',
        ...customMessages
    };
    
    return {
        code,
        message: messages[code] || response_desc || 'Unknown error',
        isSuccess: code === '000',
        isPending: code === '089' || code === '099',
        isFailure: code !== '000' && code !== '089' && code !== '099'
    };
}