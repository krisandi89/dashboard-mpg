export const GAS_WEBAPP_URL = process.env.GAS_AUTH_URL || 'https://script.google.com/macros/s/AKfycbwIG76-aZFRuE_9wbtAWKSQjGW7NelW35APqWr-SotTkJxdx_Fro-tlAt19WRZEq1wcsg/exec';

export async function proxyToGas(payload, response) {
    try {
        const gasRes = await fetch(GAS_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const text = await gasRes.text();
        let result;
        try { result = JSON.parse(text); } catch (e) { return response.status(500).json({ success: false, message: 'GAS Error: ' + text }); }

        if (result && result.success) {
            // Translate data into keys for ambilSemua so frontend doesn't break.
            if (payload.action === 'ambilSemua' && result.data) {
                result.keys = result.data.map(item => item.key || item);
                delete result.data;
            }
            return response.status(200).json(result);
        }
        return response.status(result && result.message === 'Data tidak ditemukan.' ? 404 : 400).json(result);
    } catch (e) {
        return response.status(500).json({ success: false, message: 'Terjadi kesalahan pada proxy: ' + e.toString() });
    }
}
