import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ message: 'Metode tidak diizinkan' });

  try {
    const { data, username } = request.body;
    if (!data || !data.nomorSurat || !username) {
      return response.status(400).json({ success: false, message: 'Data tidak lengkap. Username dan Nomor Surat wajib diisi.' });
    }

    data.savedAt = new Date().toISOString();
    const key = `${username}-${data.nomorSurat}`;
    await kv.set(key, data);
    return response.status(200).json({ success: true, message: 'Data Surat berhasil disimpan.', key: key });
  } catch (error) {
    console.error('Error saat menyimpan Surat:', error);
    return response.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
}
