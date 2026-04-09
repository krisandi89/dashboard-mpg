import { proxyToGas } from './_gasProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Metode tidak diizinkan' });
  const PAYLOAD = { action: 'simpan', type: 'Surat', username: req.body.username, id: req.body.data.nomorSurat || req.body.data.nomor || req.body.data.id, data: req.body.data };
  return proxyToGas(PAYLOAD, res);
}
