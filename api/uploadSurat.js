import { proxyToGas } from './_gasProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Metode tidak diizinkan' });
  const PAYLOAD = { action: 'upload', filename: req.body.filename, mimeType: req.body.mimeType, base64Data: req.body.base64Data };
  return proxyToGas(PAYLOAD, res);
}
