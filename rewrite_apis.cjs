const fs = require('fs');

const PROXY_SERVER = `import { proxyToGas } from './_gasProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'METHOD') return res.status(405).json({ message: 'Metode tidak diizinkan' });
  const PAYLOAD = PAYLOAD_DEF;
  return proxyToGas(PAYLOAD, res);
}
`;

function writeAPI(path, method, payloadDef) {
    let content = PROXY_SERVER.replace('METHOD', method).replace('PAYLOAD_DEF', payloadDef);
    fs.writeFileSync(path, content, 'utf8');
}

// Write ambilSemua
writeAPI('api/ambilSemuaNomorPPU.js', 'GET', `{ action: 'ambilSemua', type: 'PPU', username: req.query.username }`);
writeAPI('api/ambilSemuaNomorRekap.js', 'GET', `{ action: 'ambilSemua', type: 'Rekap', username: req.query.username }`);
writeAPI('api/ambilSemuaNomorSurat.js', 'GET', `{ action: 'ambilSemua', type: 'Surat', username: req.query.username }`);

// Write ambil
writeAPI('api/ambilPPU.js', 'GET', `{ action: 'ambil', type: 'PPU', username: req.query.username, id: req.query.number }`);
writeAPI('api/ambilRekap.js', 'GET', `{ action: 'ambil', type: 'Rekap', username: req.query.username, id: req.query.number }`);
writeAPI('api/ambilSurat.js', 'GET', `{ action: 'ambil', type: 'Surat', username: req.query.username, id: req.query.number }`);

// Write simpan
writeAPI('api/simpanPPU.js', 'POST', `{ action: 'simpan', type: 'PPU', username: req.body.username, id: req.body.data?.projectInfo?.ppuNumber || req.body.data?.nomorPPU || req.body.data?.nomor || req.body.data?.id || req.body.data?.nomorSurat, data: req.body.data }`);
writeAPI('api/simpanRekap.js', 'POST', `{ action: 'simpan', type: 'Rekap', username: req.body.username, id: req.body.data?.projectInfo?.rekapNumber || req.body.data?.nomorRekap || req.body.data?.nomor || req.body.data?.id || req.body.data?.nomorSurat, data: req.body.data }`);
writeAPI('api/simpanSurat.js', 'POST', `{ action: 'simpan', type: 'Surat', username: req.body.username, id: req.body.data?.nomorSurat || req.body.data?.nomor || req.body.data?.id, data: req.body.data }`);

// Write hapus
writeAPI('api/hapus.js', 'DELETE', `{ action: 'hapus', type: req.body.type || req.query.type, username: req.body.username || req.query.username, id: req.body.number || req.query.number }`);

console.log('Fixed API extractions!');
