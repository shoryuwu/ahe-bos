import http from 'http';

function request(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (cookie) options.headers['Cookie'] = cookie;
    if (body) {
      const dataStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(dataStr);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json || data
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function extractCookie(headers) {
  const setCookies = headers['set-cookie'];
  if (!setCookies) return null;
  return setCookies.map(c => c.split(';')[0]).join('; ');
}

async function runE2ETest() {
  console.log('====================================================');
  console.log('   PENGUJIAN INTEGRASI END-TO-END WEBSITE BIMBEL AHE');
  console.log('====================================================\n');
  let testCount = 0;
  let passCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      passCount++;
      console.log('  [PASS] ' + message);
    } else {
      console.error('  [FAIL] ' + message);
    }
  }

  // 1. PUBLIC FLOW
  console.log('[1. Menguji Endpoint Publik]');
  const resFaq = await request('GET', '/api/faq');
  assert(resFaq.statusCode === 200 && resFaq.data.success, 'GET /api/faq menampilkan daftar FAQ aktif');

  const resTesti = await request('GET', '/api/testimoni');
  assert(resTesti.statusCode === 200 && resTesti.data.success, 'GET /api/testimoni menampilkan testimoni orang tua');

  // 2. PPDB FLOW
  console.log('\n[2. Menguji Alur Formulir PPDB Publik]');
  const uid = Date.now().toString().slice(-5);
  const regPayload = {
    nama_anak: 'Bintang Tes ' + uid,
    tempat_lahir: 'Balikpapan',
    tanggal_lahir: '2020-05-10',
    jenis_kelamin: 'L',
    nama_ortu: 'Bunda Bintang ' + uid,
    no_wa_ortu: '0812' + uid + '78',
    email_ortu: `bunda.${uid}@gmail.com`,
    alamat: 'Jl. Soekarno Hatta Km 11 No 45, Balikpapan',
    hubungan: 'ibu',
    program_diminati: 'Pra Membaca',
    preferensi_jadwal: 'pagi',
    pengalaman: 'Belum pernah bimbel',
    sumber_info: 'Instagram'
  };
  const resReg = await request('POST', '/api/pendaftaran', regPayload);
  assert(resReg.statusCode === 201 && resReg.data.success, 'POST /api/pendaftaran berhasil submit berkas calon siswa');
  const regId = resReg.data?.data?.id;
  const noReg = resReg.data?.data?.no_registrasi;
  console.log('   -> Nomor Registrasi Resmi Terbit:', noReg);

  const resCek = await request('GET', '/api/pendaftaran/cek/' + encodeURIComponent(noReg));
  assert(resCek.statusCode === 200 && resCek.data?.data?.status === 'menunggu', 'Orang tua dapat melacak status registrasi via nomor registrasi');

  // 3. ADMIN LOGIN
  console.log('\n[3. Menguji Login & Dashboard Administrator]');
  const resAdminLogin = await request('POST', '/api/auth/login', {
    email: 'admin@ahe.id',
    password: 'admin123'
  });
  assert(resAdminLogin.statusCode === 200 && resAdminLogin.data.success, 'POST /api/auth/login sukses untuk Admin');
  const adminCookie = extractCookie(resAdminLogin.headers);
  assert(adminCookie && adminCookie.includes('ahe_session'), 'Cookie session HTTP-only ahe_session terbit');

  const resAdminMe = await request('GET', '/api/auth/me', null, adminCookie);
  assert(resAdminMe.data?.data?.role === 'admin', 'GET /api/auth/me memvalidasi role admin');

  const resAdminStats = await request('GET', '/api/dashboard/admin/stats', null, adminCookie);
  assert(resAdminStats.statusCode === 200 && resAdminStats.data.success, 'GET /api/dashboard/admin/stats mengembalikan KPI real-time');

  // 4. APPROVE PENDAFTARAN
  console.log('\n[4. Menguji Approval PPDB & Auto-generate Akun Wali Murid]');
  const resKelas = await request('GET', '/api/kelas', null, adminCookie);
  const availableKelas = resKelas.data?.data?.find(k => !k.is_penuh && k.jumlah_siswa < k.kapasitas) || { id: 'kls-002' };
  console.log('   -> Menempatkan siswa ke kelas kuota tersedia:', availableKelas.id, `(${availableKelas.nama})`);

  const resApprove = await request('PUT', `/api/pendaftaran/${regId}/terima`, { kelas_id: availableKelas.id }, adminCookie);
  assert(resApprove.statusCode === 200 && resApprove.data.success, 'Admin menyetujui pendaftaran dan menempatkan ke kelas ' + availableKelas.id);
  const newStudentId = resApprove.data?.data?.siswa?.id;
  const parentEmail = resApprove.data?.data?.akun_dibuat?.email;
  const parentPass = resApprove.data?.data?.akun_dibuat?.password_default;
  console.log('   -> ID Siswa Baru Diterima:', newStudentId);
  console.log('   -> Akun Wali Murid Terbentuk:', parentEmail, '/', parentPass);

  const resSiswaList = await request('GET', '/api/siswa', null, adminCookie);
  const foundStudent = resSiswaList.data?.data?.items?.find(s => s.id === newStudentId);
  assert(foundStudent && foundStudent.status === 'aktif', 'Siswa baru otomatis berstatus aktif di direktori siswa');

  const resOrtuList = await request('GET', '/api/orangtua', null, adminCookie);
  const foundParent = resOrtuList.data?.data?.find(o => o.email === parentEmail || o.nama.includes(uid));
  assert(foundParent && foundParent.anak.length > 0, 'Data orang tua terhubung ke siswa di direktori orang tua');

  // 5. TUTOR LOGIN & INPUT KBM
  console.log('\n[5. Menguji Tutor Workstation & Pencatatan KBM]');
  const resTutorLogin = await request('POST', '/api/auth/login', {
    email: 'sari@ahe.id',
    password: 'tutor123'
  });
  assert(resTutorLogin.statusCode === 200 && resTutorLogin.data.success, 'POST /api/auth/login sukses untuk Tutor');
  const tutorCookie = extractCookie(resTutorLogin.headers);

  const resTutorMe = await request('GET', '/api/auth/me', null, tutorCookie);
  assert(resTutorMe.data?.data?.role === 'tutor', 'GET /api/auth/me memvalidasi role tutor');

  const todayStr = new Date().toISOString().split('T')[0];
  const sessionPayload = {
    kelas_id: availableKelas.id,
    tanggal: todayStr,
    jam_mulai: '08:30',
    jam_selesai: '09:30',
    materi: 'Langkah 2: Tunjuk Bunyi Suku Kata Ba-Bi-Bu',
    catatan_umum: 'Siswa sangat aktif dan kooperatif.',
    siswa_data: [
      {
        siswa_id: newStudentId,
        absensi: 'hadir',
        nilai: 92,
        mood: 5,
        langkah_selesai: [1, 2, 3, 4, 5, 6],
        catatan: 'Ananda Bintang lancar membaca huruf dan suku kata awal ba-bi-bu.'
      }
    ]
  };
  const resSesiPost = await request('POST', '/api/sesi', sessionPayload, tutorCookie);
  assert(resSesiPost.statusCode === 201 && resSesiPost.data.success, 'POST /api/sesi mencatat sesi, absensi, skor, dan catatan secara atomic');

  // Update 5 Kompetensi Radar
  const resIndikator = await request('PUT', `/api/progress-indikator/siswa/${newStudentId}`, {
    mengenal_huruf: 90,
    membaca_suku_kata: 85,
    membaca_kata: 75,
    membaca_kalimat: 60,
    membaca_cerita: 50,
    catatan: 'Perkembangan fonik membaca meningkat pesat.'
  }, tutorCookie);
  assert(resIndikator.statusCode === 200 && resIndikator.data.success, 'Tutor berhasil mengupdate nilai 5 dimensi kompetensi membaca fonik');

  // Tutor mengajukan asesmen kenaikan level
  const resAsmPost = await request('POST', '/api/asesmen', {
    siswa_id: newStudentId,
    dari_level: 'pra-membaca',
    ke_level: 'level-1',
    nilai_tertulis: 92,
    nilai_praktik: 95,
    checklist_indikator: ['huruf_vokal', 'huruf_konsonan', 'suku_kata_terbuka'],
    catatan: 'Ananda telah menyelesaikan target pra-membaca dan siap naik ke Level 1.',
    rekomendasi: 'lulus'
  }, tutorCookie);
  assert(resAsmPost.statusCode === 201 && resAsmPost.data.success, 'Tutor berhasil mengajukan asesmen kelulusan level');
  const asmId = resAsmPost.data?.data?.id;

  // 6. ADMIN APPROVAL ASESMEN
  console.log('\n[6. Menguji Verifikasi Kenaikan Level oleh Administrator]');
  const resAsmApprove = await request('PUT', `/api/asesmen/${asmId}/approve`, null, adminCookie);
  assert(resAsmApprove.statusCode === 200 && resAsmApprove.data.success, 'Admin menyetujui rekomendasi kenaikan jenjang membaca');

  const resCheckStudent = await request('GET', `/api/siswa/${newStudentId}`, null, adminCookie);
  assert(resCheckStudent.data?.data?.level_saat_ini === 'level-1', 'Level siswa otomatis naik menjadi level-1');

  // 7. MONITORING ORANG TUA
  console.log('\n[7. Menguji Dashboard Wali Murid & Sinkronisasi Real-Time]');
  const resParentLogin = await request('POST', '/api/auth/login', {
    email: parentEmail,
    password: parentPass
  });
  assert(resParentLogin.statusCode === 200 && resParentLogin.data.success, 'Wali murid berhasil login dengan kredensial yang diterbitkan');
  const parentCookie = extractCookie(resParentLogin.headers);

  const resParentDashboard = await request('GET', '/api/dashboard/parent/me', null, parentCookie);
  assert(resParentDashboard.statusCode === 200 && resParentDashboard.data.success, 'Dashboard orang tua memuat data realtime dari session');
  const pChild = resParentDashboard.data?.data?.childDetail || resParentDashboard.data?.data?.child;
  assert(pChild && pChild.id === newStudentId, 'Orang tua melihat anandanya (' + pChild?.nama + ')');
  assert(pChild?.level_saat_ini === 'level-1', 'Orang tua melihat level terkini: level-1');
  assert(pChild?.kehadiran?.hadir >= 1, 'Orang tua melihat rekap presensi hadir tercatat (1 Sesi Hadir)');
  assert(pChild?.catatan?.length > 0, 'Orang tua melihat evaluasi & catatan dari tutor');

  // 8. CETAK DOKUMEN
  console.log('\n[8. Menguji Cetak Rapor & Sertifikat]');
  const resRapor = await request('GET', `/api/laporan/rapor/${newStudentId}`);
  assert(resRapor.statusCode === 200 && resRapor.data.success, 'GET /api/laporan/rapor/:id menghasilkan lembar rapor 5 kompetensi');
  assert(resRapor.data?.data?.indikator?.mengenal_huruf === 90, 'Nilai indikator pada rapor sinkron dengan inputan tutor');

  console.log('\n====================================================');
  console.log(`   HASIL PENGUJIAN: ${passCount} / ${testCount} TEST LULUS`);
  console.log('====================================================\n');
}

runE2ETest().catch(console.error);
