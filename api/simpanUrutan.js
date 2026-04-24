import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { username, type, number, expenses } = req.body;
        if (!username || !type || !number || !expenses) {
            return res.status(400).json({ success: false, message: 'Invalid data provided' });
        }

        const key = `${username}-${type}-${number}`;
        let existingData = await kv.get(key);

        if (!existingData) {
            return res.status(404).json({ success: false, message: 'Data not found' });
        }

        existingData.expenses = expenses;

        await kv.set(key, existingData);

        return res.status(200).json({ success: true, message: 'Urutan berhasil disimpan' });
    } catch (error) {
        console.error('Error saving order:', error);
        return res.status(500).json({ success: false, message: 'Failed to save order' });
    }
}
