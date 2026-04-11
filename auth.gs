const SPREADSHEET_ID = '1_TyrCd6gyXJ_qsakDPUsIfYWvb5V-tIaDzdGO1V8B4g';

function doPost(e) {
  const output = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  if (!e.postData || !e.postData.contents) {
    return output.setContent(JSON.stringify({ success: false, message: 'No payload provided' }));
  }

  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) {
    return output.setContent(JSON.stringify({ success: false, message: 'Invalid JSON' }));
  }

  const { action, username, password, type, id, data } = req;

  if (action === 'login') return processLogin(username, password, output);
  if (action === 'simpan') return processSimpan(type, username, id, data, output);
  if (action === 'ambil') return processAmbil(type, username, id, output);
  if (action === 'ambilSemua') return processAmbilSemua(type, username, output);
  if (action === 'hapus') return processHapus(type, username, id, output);
  if (action === 'upload') return processUpload(req.filename, req.mimeType, req.base64Data, output);

  return output.setContent(JSON.stringify({ success: false, message: 'Unknown action' }));
}

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

function processLogin(username, password, output) {
  if (!username || !password) return output.setContent(JSON.stringify({ success: false, message: 'Username and password required' }));
  try {
    const sheet = getSheet('Users');
    if (!sheet) return output.setContent(JSON.stringify({ success: false, message: 'Sheet Users tidak ditemukan' }));
    
    const data = sheet.getDataRange().getValues();
    let isMatch = false, actualName = username;

    for (let i = 1; i < data.length; i++) {
       const rowUser = String(data[i][0]).trim().toLowerCase();
       if (rowUser === username.toLowerCase() && String(data[i][1]) === String(password)) {
          isMatch = true;
          actualName = String(data[i][2] || rowUser);
          break;
       }
    }
    if (isMatch) return output.setContent(JSON.stringify({ success: true, username: actualName }));
    return output.setContent(JSON.stringify({ success: false, message: 'Username atau password salah' }));
  } catch(e) {
    return output.setContent(JSON.stringify({ success: false, message: e.toString() }));
  }
}

function processSimpan(type, username, id, payloadData, output) {
  if (!type || !username || !id) return output.setContent(JSON.stringify({ success: false, message: 'Data tidak lengkap' }));
  try {
    const sheet = getSheet(type);
    if (!sheet) return output.setContent(JSON.stringify({ success: false, message: 'Sheet ' + type + ' tidak ditemukan (Tipe salah)' }));
    
    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
       if (String(data[i][0]) === String(username) && String(data[i][1]) === String(id)) {
           foundRow = i + 1; break;
       }
    }
    
    const timestamp = new Date().toISOString();
    const jsonStr = JSON.stringify(payloadData);
    
    // Header jika kosong
    if (data.length === 0 || (data.length === 1 && !data[0][0])) {
      sheet.getRange(1, 1, 1, 4).setValues([['Username', 'ID', 'Timestamp', 'DataJSON']]);
    }
    
    if (foundRow > -1) {
      sheet.getRange(foundRow, 3).setValue(timestamp);
      sheet.getRange(foundRow, 4).setValue(jsonStr);
    } else {
      sheet.appendRow([username, id, timestamp, jsonStr]);
    }
    
    return output.setContent(JSON.stringify({ success: true, message: 'Data berhasil disimpan.' }));
  } catch(e) {
    return output.setContent(JSON.stringify({ success: false, message: e.toString() }));
  }
}

function processAmbil(type, username, id, output) {
  if (!type || !username || !id) return output.setContent(JSON.stringify({ success: false, message: 'Data tidak lengkap' }));
  try {
    const sheet = getSheet(type);
    if (!sheet) return output.setContent(JSON.stringify({ success: false, message: 'Sheet ' + type + ' tidak ditemukan' }));
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(username) && String(data[i][1]) === String(id)) {
            try { return output.setContent(JSON.stringify({ success: true, data: JSON.parse(data[i][3]) })); } catch(e) {}
        }
    }
    return output.setContent(JSON.stringify({ success: false, message: 'Data tidak ditemukan.' }));
  } catch(e) {
    return output.setContent(JSON.stringify({ success: false, message: e.toString() }));
  }
}

function processAmbilSemua(type, username, output) {
  if (!type || !username) return output.setContent(JSON.stringify({ success: false, message: 'Tipe dan Username diperlukan' }));
  try {
    const sheet = getSheet(type);
    if (!sheet) return output.setContent(JSON.stringify({ success: false, message: 'Sheet ' + type + ' tidak ditemukan' }));

    const data = sheet.getDataRange().getValues();
    let results = [];
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(username)) {
            try {
                results.push({ key: `${username}-${data[i][1]}`, value: JSON.parse(data[i][3]) });
            } catch(jsonErr) {}
        }
    }
    return output.setContent(JSON.stringify({ success: true, data: results }));
  } catch(e) {
    return output.setContent(JSON.stringify({ success: false, message: e.toString() }));
  }
}

function processHapus(type, username, id, output) {
  if (!type || !username || !id) return output.setContent(JSON.stringify({ success: false, message: 'Data tidak lengkap' }));
  try {
    const sheet = getSheet(type);
    if (!sheet) return output.setContent(JSON.stringify({ success: false, message: 'Sheet ' + type + ' tidak ditemukan' }));

    const data = sheet.getDataRange().getValues();
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(username) && String(data[i][1]) === String(id)) {
            foundRow = i + 1;
            break;
        }
    }
    if (foundRow > -1) {
        sheet.deleteRow(foundRow);
        return output.setContent(JSON.stringify({ success: true, message: 'Data berhasil dihapus.' }));
    } else {
        return output.setContent(JSON.stringify({ success: false, message: 'Data tidak ditemukan.' }));
    }
  } catch(e) {
    return output.setContent(JSON.stringify({ success: false, message: e.toString() }));
  }
}

function processUpload(filename, mimeType, base64Data, output) {
  if (!filename || !mimeType || !base64Data) {
    return output.setContent(JSON.stringify({ success: false, message: 'Data file tidak lengkap' }));
  }
  try {
    const dataBlob = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(dataBlob, mimeType, filename);
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return output.setContent(JSON.stringify({ success: true, url: file.getUrl() }));
  } catch(e) {
    return output.setContent(JSON.stringify({ success: false, message: e.toString() }));
  }
}
