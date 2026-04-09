import { proxyToGas } from './_gasProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ message: 'Metode tidak diizinkan' });
  const PAYLOAD = { action: 'hapus', type: req.body.type || req.query.type, username: req.body.username || req.query.username, id: req.body.number || req.query.number };
  return proxyToGas(PAYLOAD, res);
}
