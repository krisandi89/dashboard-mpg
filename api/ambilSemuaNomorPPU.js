import { proxyToGas } from './_gasProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Metode tidak diizinkan' });
  const PAYLOAD = { action: 'ambilSemua', type: 'PPU', username: req.query.username };
  return proxyToGas(PAYLOAD, res);
}
