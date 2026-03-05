// ============================================
// VTPASS MASTER CONFIGURATION - ALL SERVICES
// ============================================

const VTPASS_CONFIG = {
    // API Keys - PASTE YOUR KEYS HERE
    PUBLIC_KEY: 'YOUR_VTPASS_PUBLIC_KEY',
    SECRET_KEY: 'YOUR_VTPASS_SECRET_KEY',
    
    // Base URLs
    BASE_URL: 'https://api.vtpass.com',
    
    // Profit Configuration
    PROFIT: {
        DATA_SMALL: 50,
        DATA_MEDIUM: 100,
        DATA_LARGE: 200,
        AIRTIME: 10,
        TV: 500,
        ELECTRICITY: 100,
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

// ============================================
// HANDLE API RESPONSE CODES - COMPLETE FUNCTION
// ============================================

function handleResponseCode(code, response_desc, customMessages = {}) {
    // Complete list of VTpass response codes with user-friendly messages
    const messages = {
        // Success Codes
        '000': 'Transaction successful',
        '001': 'Transaction query successful',
        '020': 'Biller confirmed successfully',
        '044': 'Transaction resolved',
        
        // Error Codes - Data/Airtime
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
        
        // Error Codes - Account Related
        '021': 'Account temporarily locked',
        '022': 'Account suspended. Contact support',
        '023': 'API access not enabled for this account',
        '024': 'Account inactive',
        '027': 'IP address not whitelisted',
        '028': 'Service not activated for your account',
        
        // Error Codes - Service Related
        '030': 'Service temporarily unavailable. Try again later',
        '031': 'Below minimum quantity allowed',
        '032': 'Above maximum quantity allowed',
        '034': 'Service suspended',
        '035': 'Service inactive',
        
        // System Errors
        '040': 'Transaction reversal initiated',
        '083': 'System error. Please try again',
        '085': 'Invalid request format',
        '087': 'Invalid API credentials',
        '089': 'Processing your request. Please wait',
        '091': 'Transaction could not be processed',
        '099': 'Transaction is processing. Please check later',
        
        // Custom messages that can be overridden
        ...customMessages
    };

    // Determine transaction state based on code
    const isSuccess = code === '000' || code === '001' || code === '020' || code === '044';
    const isPending = code === '089' || code === '099';
    const isFailure = !isSuccess && !isPending;
    
    // Get appropriate message
    let message = messages[code] || response_desc || 'Unknown error occurred';
    
    // Add specific guidance for common errors
    if (code === '018') {
        message = '⚠️ ' + message + ' Click Fund button to add money';
    } else if (code === '010') {
        message = '⚠️ ' + message + ' Please select a different plan';
    } else if (code === '030') {
        message = '⏳ ' + message + ' We\'ll notify you when service is back';
    } else if (code === '016') {
        message = '❌ ' + message + ' No money was deducted from your wallet';
    }

    return {
        code: code,
        message: message,
        isSuccess: isSuccess,
        isPending: isPending,
        isFailure: isFailure,
        originalMessage: response_desc
    };
}

// ============================================
// MAKE API CALL WITH RESPONSE HANDLING
// ============================================

async function vtpassApiCall(endpoint, payload) {
    try {
        console.log('Making API call to:', `${VTPASS_CONFIG.BASE_URL}${endpoint}`);
        console.log('With payload:', payload);
        
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
        console.log('API Response:', data);
        
        // Handle the response using our handler
        const handled = handleResponseCode(data.code, data.response_description);
        
        return {
            ...data,
            handled: handled
        };
        
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
// VERIFY METER/SMARTCARD NUMBER
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
            body: JSON.stringify({
                serviceID,
                billersCode,
                type
            })
        });

        const data = await response.json();
        
        if (data.code === '000') {
            return {
                success: true,
                data: data.content,
                message: 'Verification successful'
            };
        } else {
            return {
                success: false,
                message: data.response_description || 'Verification failed',
                code: data.code
            };
        }
        
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// ============================================
// QUERY TRANSACTION STATUS
// ============================================

async function requeryTransaction(requestId) {
    try {
        const result = await vtpassApiCall('/requery', { request_id: requestId });
        return result;
    } catch (error) {
        return {
            code: '083',
            response_description: 'Requery failed',
            handled: handleResponseCode('083', 'Requery failed')
        };
    }
}

// ============================================
// EXPORT FUNCTIONS FOR USE IN OTHER FILES
// ============================================

// Make all functions available globally
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
window.requeryTransaction = requeryTransaction;
window.handleResponseCode = handleResponseCode;
window.generateRequestId = generateRequestId;