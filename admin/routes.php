// api/monnify-webhook.js - Handle Monnify webhook notifications
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const body = req.body;
    
    // Verify webhook signature (add your secret verification here)
    
    if (body.eventType === 'SUCCESSFUL_TRANSACTION') {
        const amount = body.eventData.amount;
        const accountNumber = body.eventData.destinationAccountNumber;
        const reference = body.eventData.transactionReference;
        
        // Find user by account number
        // Add amount to user's wallet
        // Record transaction
        
        console.log(`Payment received: ₦${amount} to account ${accountNumber}`);
    }
    
    res.status(200).json({ status: 'success' });
}