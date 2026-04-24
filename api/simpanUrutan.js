import { proxyToGas, GAS_WEBAPP_URL } from './_gasProxy.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { username, type, number, expenses } = req.body;
        if (!username || !type || !number || !expenses) {
            return res.status(400).json({ success: false, message: 'Invalid data provided' });
        }

        // 1. Fetch current data from GAS
        const getPayload = { action: 'ambil', type: type, username: username, id: number };
        const getRes = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify(getPayload)
        });
        const text = await getRes.text();
        let getResult;
        try { 
            getResult = JSON.parse(text); 
        } catch (e) { 
            return res.status(500).json({ success: false, message: 'GAS Error: ' + text }); 
        }
        
        if (!getResult.success || !getResult.data) {
            return res.status(404).json({ success: false, message: 'Data not found' });
        }

        // 2. Update expenses with new order
        getResult.data.expenses = expenses;

        // 3. Save back to GAS
        const savePayload = { action: 'simpan', type: type, username: username, id: number, data: getResult.data };
        return proxyToGas(savePayload, res);

    } catch (error) {
        console.error('Error saving order:', error);
        return res.status(500).json({ success: false, message: 'Failed to save order' });
    }
}
