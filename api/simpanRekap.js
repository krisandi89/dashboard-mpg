import { proxyToGas } from './_gasProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Metode tidak diizinkan' });
  const PAYLOAD = { action: 'simpan', type: 'Rekap', username: req.body.username, id: req.body.data?.projectInfo?.rekapNumber || req.body.data?.nomorRekap || req.body.data?.nomor || req.body.data?.id || req.body.data?.nomorSurat, data: req.body.data };
  return proxyToGas(PAYLOAD, res);
}
