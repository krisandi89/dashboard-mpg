import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  if (request.method !== 'DELETE') return response.status(405).json({ message: 'Metode tidak diizinkan' });

  try {
    const { number, username } = request.body;
    if (!number || !username) return response.status(400).json({ success: false, message: 'Nomor Surat dan Username diperlukan.' });

    const key = `${username}-${number}`;
    const deleted = await kv.del(key);
    if (deleted === 0) return response.status(404).json({ success: false, message: 'Data Surat tidak ditemukan atau sudah dihapus.' });

    return response.status(200).json({ success: true, message: 'Data Surat berhasil dihapus.' });
  } catch (error) {
    console.error('Error saat menghapus Surat:', error);
    return response.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
}
