// In your main app.js file

async function sendDataViaAPI(phone, network, planCode, amount) {
    // 🔴 USE YOUR REAL API KEYS FROM ENVIRONMENT VARIABLES
    const API_PUBLIC_KEY = 'your_vtpass_public_key';
    const API_SECRET_KEY = 'your_vtpass_secret_key';
    const API_URL = 'https://api.vtpass.com/api/pay';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_PUBLIC_KEY,
                'secret-key': API_SECRET_KEY
            },
            body: JSON.stringify({
                serviceID: network,      // e.g., 'mtn'
                phone: phone,
                variation_code: planCode, // e.g., 'mtn-monthly-1gb'
                amount: amount
            })
        });

        const data = await response.json();
        
        if (data.code === '000' || data.status === 'success') {
            return { success: true, message: 'Data sent', ref: data.requestId };
        } else {
            return { success: false, message: data.response_description || 'API Error' };
        }
    } catch (error) {
        console.error('API Call Failed:', error);
        return { success: false, message: 'Network error' };
    }
}