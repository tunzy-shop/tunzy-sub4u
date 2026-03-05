// ============================================
// VTPASS MASTER CONFIGURATION - ALL SERVICES
// ============================================

const VTPASS_CONFIG = {
    // API Keys - PASTE YOUR KEYS HERE
    PUBLIC_KEY: 'YOUR_VTPASS_PUBLIC_KEY',
    SECRET_KEY: 'YOUR_VTPASS_SECRET_KEY',
    
    // Base URLs
    BASE_URL: 'https://api.vtpass.com',
    
    // Profit Configuration - REDUCED AIRTIME PROFIT!
    PROFIT: {
        DATA_SMALL: 50,
        DATA_MEDIUM: 100,
        DATA_LARGE: 200,
        AIRTIME: 10,        // ← REDUCED from 20 to 10 (smaller profit)
        TV: 500,
        ELECTRICITY: 100,
    },
    
    // Service IDs
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