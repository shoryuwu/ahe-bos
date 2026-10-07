<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Setup Spatie Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $tutorRole = Role::firstOrCreate(['name' => 'tutor', 'guard_name' => 'web']);
        $ortuRole = Role::firstOrCreate(['name' => 'orangtua', 'guard_name' => 'web']);

        $jsonPath = base_path('../db_store.json');
        if (!File::exists($jsonPath)) {
            $jsonPath = base_path('db_store.json');
        }

        if (!File::exists($jsonPath)) {
            $this->command->warn("db_store.json not found at $jsonPath, skipping import.");
            return;
        }

        $data = json_decode(File::get($jsonPath), true);
        if (!$data) {
            $this->command->error("Failed to parse db_store.json");
            return;
        }

        DB::beginTransaction();
        try {
            // Seed Users
            if (!empty($data['users'])) {
                foreach ($data['users'] as $u) {
                    $plainPassword = 'ortu123';
                    if ($u['email'] === 'admin@ahe.id') {
                        $plainPassword = 'admin123';
                    } elseif ($u['email'] === 'sari@ahe.id' || $u['role'] === 'tutor') {
                        $plainPassword = 'tutor123';
                    } elseif ($u['email'] === 'sari.dewi@ahe.id') {
                        $plainPassword = 'ortu123';
                    }

                    $user = User::updateOrCreate(
                        ['id' => $u['id']],
                        [
                            'name' => $u['nama'] ?? 'User',
                            'nama' => $u['nama'] ?? 'User',
                            'email' => $u['email'],
                            'password' => Hash::make($plainPassword),
                            'role' => $u['role'],
                            'is_active' => $u['is_active'] ?? true,
                            'foto_url' => $u['foto_url'] ?? null,
                            'failed_logins' => 0,
                            'locked_until' => null,
                            'last_login_at' => $u['last_login_at'] ?? null,
                            'password_reset_required' => $u['password_reset_required'] ?? false,
                        ]
                    );

                    // Assign Spatie Role
                    if ($u['role'] === 'admin') {
                        $user->syncRoles(['admin']);
                    } elseif ($u['role'] === 'tutor') {
                        $user->syncRoles(['tutor']);
                    } elseif ($u['role'] === 'orangtua') {
                        $user->syncRoles(['orangtua']);
                    }
                }
            }

            // Seed Guru
            if (!empty($data['guru'])) {
                foreach ($data['guru'] as $g) {
                    DB::table('guru')->updateOrInsert(
                        ['id' => $g['id']],
                        [
                            'user_id' => $g['user_id'],
                            'nama' => $g['nama'],
                            'no_wa' => $g['no_wa'],
                            'email' => $g['email'],
                            'spesialisasi' => isset($g['spesialisasi']) ? json_encode($g['spesialisasi']) : null,
                            'tanggal_gabung' => $g['tanggal_gabung'] ?? now(),
                            'is_active' => $g['is_active'] ?? true,
                            'created_at' => $g['created_at'] ?? now(),
                            'updated_at' => $g['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // Seed Orang Tua
            if (!empty($data['orangtua'])) {
                foreach ($data['orangtua'] as $o) {
                    DB::table('orangtua')->updateOrInsert(
                        ['id' => $o['id']],
                        [
                            'user_id' => $o['user_id'],
                            'nama' => $o['nama'],
                            'no_wa' => $o['no_wa'],
                            'email' => $o['email'],
                            'alamat' => $o['alamat'] ?? '',
                            'hubungan' => $o['hubungan'] ?? 'ibu',
                            'created_at' => $o['created_at'] ?? now(),
                            'updated_at' => $o['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // Seed Program
            if (!empty($data['program'])) {
                foreach ($data['program'] as $p) {
                    DB::table('program')->updateOrInsert(
                        ['id' => $p['id']],
                        [
                            'kode' => $p['kode'],
                            'nama' => $p['nama'],
                            'deskripsi' => $p['deskripsi'] ?? null,
                            'target_capaian' => isset($p['target_capaian']) ? json_encode($p['target_capaian']) : null,
                            'durasi_estimasi' => $p['durasi_estimasi'] ?? null,
                            'rentang_usia' => $p['rentang_usia'] ?? null,
                            'urutan' => $p['urutan'] ?? 1,
                            'icon' => $p['icon'] ?? null,
                            'created_at' => $p['created_at'] ?? now(),
                            'updated_at' => $p['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // Seed Kelas
            if (!empty($data['kelas'])) {
                foreach ($data['kelas'] as $k) {
                    DB::table('kelas')->updateOrInsert(
                        ['id' => $k['id']],
                        [
                            'nama' => $k['nama'],
                            'program_id' => $k['program_id'],
                            'guru_id' => $k['guru_id'],
                            'jadwal_hari' => isset($k['jadwal_hari']) ? json_encode($k['jadwal_hari']) : null,
                            'jam_mulai' => $k['jam_mulai'] ?? null,
                            'jam_selesai' => $k['jam_selesai'] ?? null,
                            'kapasitas' => $k['kapasitas'] ?? 6,
                            'status' => $k['status'] ?? 'aktif',
                            'created_at' => $k['created_at'] ?? now(),
                            'updated_at' => $k['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // Seed Siswa
            if (!empty($data['siswa'])) {
                foreach ($data['siswa'] as $s) {
                    DB::table('siswa')->updateOrInsert(
                        ['id' => $s['id']],
                        [
                            'orangtua_id' => $s['orangtua_id'],
                            'nama' => $s['nama'],
                            'tempat_lahir' => $s['tempat_lahir'] ?? null,
                            'tanggal_lahir' => $s['tanggal_lahir'],
                            'jenis_kelamin' => $s['jenis_kelamin'] ?? 'L',
                            'level_saat_ini' => $s['level_saat_ini'] ?? 'Pra Membaca',
                            'kelas_id' => $s['kelas_id'] ?? null,
                            'status' => $s['status'] ?? 'aktif',
                            'tanggal_masuk' => $s['tanggal_masuk'] ?? now(),
                            'tanggal_keluar' => $s['tanggal_keluar'] ?? null,
                            'created_at' => $s['created_at'] ?? now(),
                            'updated_at' => $s['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // Seed Modul
            if (!empty($data['modul'])) {
                foreach ($data['modul'] as $m) {
                    DB::table('modul')->updateOrInsert(
                        ['id' => $m['id']],
                        [
                            'program_id' => $m['program_id'],
                            'kode' => $m['kode'],
                            'judul' => $m['judul'],
                            'deskripsi' => $m['deskripsi'] ?? null,
                            'urutan' => $m['urutan'] ?? 1,
                            'created_at' => $m['created_at'] ?? now(),
                            'updated_at' => $m['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // Seed Sesi Belajar
            if (!empty($data['sesi_belajar'])) {
                foreach ($data['sesi_belajar'] as $sb) {
                    if (!empty($sb['kelas_id']) && !empty($sb['guru_id']) &&
                        DB::table('kelas')->where('id', $sb['kelas_id'])->exists() &&
                        DB::table('guru')->where('id', $sb['guru_id'])->exists()) {
                        DB::table('sesi_belajar')->updateOrInsert(
                            ['id' => $sb['id']],
                            [
                                'kelas_id' => $sb['kelas_id'],
                                'guru_id' => $sb['guru_id'],
                                'guru_pengganti_id' => $sb['guru_pengganti_id'] ?? null,
                                'modul_id' => $sb['modul_id'] ?? null,
                                'periode_id' => $sb['periode_id'] ?? null,
                                'tanggal' => $sb['tanggal'],
                                'materi' => $sb['materi'] ?? null,
                                'catatan_umum' => $sb['catatan_umum'] ?? null,
                                'status_sesi' => $sb['status_sesi'] ?? 'terjadwal',
                                'created_at' => $sb['created_at'] ?? now(),
                                'updated_at' => $sb['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Absensi
            if (!empty($data['absensi'])) {
                foreach ($data['absensi'] as $ab) {
                    if (!empty($ab['sesi_id']) && !empty($ab['siswa_id']) &&
                        DB::table('sesi_belajar')->where('id', $ab['sesi_id'])->exists() &&
                        DB::table('siswa')->where('id', $ab['siswa_id'])->exists()) {
                        DB::table('absensi')->updateOrInsert(
                            ['id' => $ab['id']],
                            [
                                'sesi_id' => $ab['sesi_id'],
                                'siswa_id' => $ab['siswa_id'],
                                'status' => $ab['status'] ?? 'hadir',
                                'keterangan' => $ab['keterangan'] ?? null,
                                'created_at' => $ab['created_at'] ?? now(),
                                'updated_at' => $ab['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Nilai Sesi
            if (!empty($data['nilai_sesi'])) {
                foreach ($data['nilai_sesi'] as $ns) {
                    if (!empty($ns['sesi_id']) && !empty($ns['siswa_id']) &&
                        DB::table('sesi_belajar')->where('id', $ns['sesi_id'])->exists() &&
                        DB::table('siswa')->where('id', $ns['siswa_id'])->exists()) {
                        DB::table('nilai_sesi')->updateOrInsert(
                            ['id' => $ns['id']],
                            [
                                'sesi_id' => $ns['sesi_id'],
                                'siswa_id' => $ns['siswa_id'],
                                'nilai' => $ns['nilai'] ?? 0,
                                'mood' => $ns['mood'] ?? 3,
                                'langkah_selesai' => isset($ns['langkah_selesai']) ? json_encode($ns['langkah_selesai']) : null,
                                'catatan' => $ns['catatan'] ?? null,
                                'created_at' => $ns['created_at'] ?? now(),
                                'updated_at' => $ns['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Catatan Guru
            if (!empty($data['catatan_guru'])) {
                foreach ($data['catatan_guru'] as $cg) {
                    if (!empty($cg['siswa_id']) && !empty($cg['guru_id']) &&
                        DB::table('siswa')->where('id', $cg['siswa_id'])->exists() &&
                        DB::table('guru')->where('id', $cg['guru_id'])->exists()) {
                        DB::table('catatan_guru')->updateOrInsert(
                            ['id' => $cg['id']],
                            [
                                'siswa_id' => $cg['siswa_id'],
                                'guru_id' => $cg['guru_id'],
                                'tanggal' => $cg['tanggal'],
                                'catatan' => $cg['catatan'],
                                'tipe' => $cg['tipe'] ?? 'progress',
                                'created_at' => $cg['created_at'] ?? now(),
                                'updated_at' => $cg['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Progress Indikator
            if (!empty($data['progress_indikator'])) {
                foreach ($data['progress_indikator'] as $pi) {
                    if (!empty($pi['siswa_id']) && DB::table('siswa')->where('id', $pi['siswa_id'])->exists()) {
                        DB::table('progress_indikator')->updateOrInsert(
                            ['id' => $pi['id']],
                            [
                                'siswa_id' => $pi['siswa_id'],
                                'bulan' => $pi['bulan'],
                                'mengenal_huruf' => $pi['mengenal_huruf'] ?? 0,
                                'membaca_suku_kata' => $pi['membaca_suku_kata'] ?? 0,
                                'membaca_kata' => $pi['membaca_kata'] ?? 0,
                                'membaca_kalimat' => $pi['membaca_kalimat'] ?? 0,
                                'membaca_cerita' => $pi['membaca_cerita'] ?? 0,
                                'updated_by' => $pi['updated_by'] ?? null,
                                'created_at' => $pi['created_at'] ?? now(),
                                'updated_at' => $pi['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Kosakata
            if (!empty($data['kosakata'])) {
                foreach ($data['kosakata'] as $ks) {
                    if (!empty($ks['siswa_id']) && DB::table('siswa')->where('id', $ks['siswa_id'])->exists()) {
                        DB::table('kosakata')->updateOrInsert(
                            ['id' => $ks['id']],
                            [
                                'siswa_id' => $ks['siswa_id'],
                                'kata' => $ks['kata'],
                                'kategori' => $ks['kategori'],
                                'dikuasai' => $ks['dikuasai'] ?? false,
                                'tanggal_dikuasai' => $ks['tanggal_dikuasai'] ?? null,
                                'created_at' => $ks['created_at'] ?? now(),
                                'updated_at' => $ks['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Riwayat Level
            if (!empty($data['riwayat_level'])) {
                foreach ($data['riwayat_level'] as $rl) {
                    if (!empty($rl['siswa_id']) && DB::table('siswa')->where('id', $rl['siswa_id'])->exists()) {
                        DB::table('riwayat_level')->updateOrInsert(
                            ['id' => $rl['id']],
                            [
                                'siswa_id' => $rl['siswa_id'],
                                'level' => $rl['level'],
                                'tanggal_mulai' => $rl['tanggal_mulai'],
                                'tanggal_selesai' => $rl['tanggal_selesai'] ?? null,
                                'status' => $rl['status'] ?? 'sedang',
                                'progress_persen' => $rl['progress_persen'] ?? 0,
                                'created_at' => $rl['created_at'] ?? now(),
                                'updated_at' => $rl['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Asesmen
            if (!empty($data['asesmen'])) {
                foreach ($data['asesmen'] as $as) {
                    if (!empty($as['siswa_id']) && !empty($as['guru_id']) &&
                        DB::table('siswa')->where('id', $as['siswa_id'])->exists() &&
                        DB::table('guru')->where('id', $as['guru_id'])->exists()) {
                        DB::table('asesmen')->updateOrInsert(
                            ['id' => $as['id']],
                            [
                                'siswa_id' => $as['siswa_id'],
                                'guru_id' => $as['guru_id'],
                                'dari_level' => $as['dari_level'],
                                'ke_level' => $as['ke_level'],
                                'tanggal_pengajuan' => $as['tanggal_pengajuan'] ?? (isset($as['created_at']) ? substr($as['created_at'], 0, 10) : date('Y-m-d')),
                                'nilai_tertulis' => $as['nilai_tertulis'] ?? 0,
                                'nilai_praktik' => $as['nilai_praktik'] ?? 0,
                                'checklist_indikator' => isset($as['checklist_indikator']) ? json_encode($as['checklist_indikator']) : null,
                                'catatan_evaluasi' => $as['catatan_evaluasi'] ?? ($as['catatan'] ?? null),
                                'rekomendasi' => $as['rekomendasi'] ?? 'lulus',
                                'status' => $as['status'] ?? 'menunggu',
                                'disetujui_oleh' => $as['disetujui_oleh'] ?? null,
                                'tanggal_persetujuan' => $as['tanggal_persetujuan'] ?? (isset($as['tanggal_disetujui']) ? substr($as['tanggal_disetujui'], 0, 10) : null),
                                'created_at' => $as['created_at'] ?? now(),
                                'updated_at' => $as['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Pencapaian
            if (!empty($data['pencapaian'])) {
                foreach ($data['pencapaian'] as $pc) {
                    if (!empty($pc['siswa_id']) && DB::table('siswa')->where('id', $pc['siswa_id'])->exists()) {
                        DB::table('pencapaian')->updateOrInsert(
                            ['id' => $pc['id']],
                            [
                                'siswa_id' => $pc['siswa_id'],
                                'nama_badge' => $pc['nama_badge'],
                                'ikon' => $pc['ikon'],
                                'kategori' => $pc['kategori'],
                                'deskripsi' => $pc['deskripsi'],
                                'tanggal_raih' => $pc['tanggal_raih'],
                                'created_at' => $pc['created_at'] ?? now(),
                                'updated_at' => $pc['updated_at'] ?? now(),
                            ]
                        );
                    }
                }
            }

            // Seed Pendaftaran
            if (!empty($data['pendaftaran'])) {
                foreach ($data['pendaftaran'] as $pd) {
                    DB::table('pendaftaran')->updateOrInsert(
                        ['id' => $pd['id']],
                        [
                            'no_registrasi' => $pd['no_registrasi'],
                            'tipe_pendaftaran' => $pd['tipe_pendaftaran'] ?? 'reguler',
                            'nama_anak' => $pd['nama_anak'],
                            'tempat_lahir' => $pd['tempat_lahir'] ?? null,
                            'tanggal_lahir' => $pd['tanggal_lahir'],
                            'jenis_kelamin' => $pd['jenis_kelamin'] ?? 'L',
                            'nama_ortu' => $pd['nama_ortu'],
                            'hubungan_ortu' => $pd['hubungan_ortu'] ?? ($pd['hubungan'] ?? 'ibu'),
                            'no_wa' => $pd['no_wa'] ?? ($pd['no_wa_ortu'] ?? ''),
                            'email' => $pd['email'] ?? ($pd['email_ortu'] ?? ''),
                            'alamat' => $pd['alamat'] ?? '',
                            'program_diminati' => $pd['program_diminati'] ?? 'prg-001',
                            'preferensi_jadwal' => isset($pd['preferensi_jadwal']) ? (is_array($pd['preferensi_jadwal']) ? json_encode($pd['preferensi_jadwal']) : json_encode([$pd['preferensi_jadwal']])) : null,
                            'catatan_khusus' => $pd['catatan_khusus'] ?? ($pd['pengalaman'] ?? null),
                            'status' => $pd['status'] ?? 'menunggu',
                            'alasan_penolakan' => $pd['alasan_penolakan'] ?? ($pd['alasan_tolak'] ?? null),
                            'siswa_id' => $pd['siswa_id'] ?? null,
                            'created_at' => $pd['created_at'] ?? now(),
                            'updated_at' => $pd['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            // CMS & Misc (Galeri, Testimoni, FAQ, Pengaturan)
            if (!empty($data['galeri'])) {
                foreach ($data['galeri'] as $gl) {
                    DB::table('galeri')->updateOrInsert(
                        ['id' => $gl['id']],
                        [
                            'image_url' => $gl['image_url'],
                            'caption' => $gl['caption'],
                            'kategori' => $gl['kategori'] ?? 'Aktivitas',
                            'urutan' => $gl['urutan'] ?? 0,
                            'created_at' => $gl['created_at'] ?? now(),
                            'updated_at' => $gl['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            if (!empty($data['testimoni'])) {
                foreach ($data['testimoni'] as $ts) {
                    $usia = 5;
                    if (isset($ts['usia_anak'])) {
                        $parsed = intval(preg_replace('/[^0-9]/', '', (string)$ts['usia_anak']));
                        if ($parsed > 0) $usia = $parsed;
                    }
                    DB::table('testimoni')->updateOrInsert(
                        ['id' => $ts['id']],
                        [
                            'nama_ortu' => $ts['nama_ortu'],
                            'nama_anak' => $ts['nama_anak'],
                            'usia_anak' => $usia,
                            'ulasan' => $ts['ulasan'],
                            'rating' => $ts['rating'] ?? 5,
                            'program' => $ts['program'],
                            'is_tampil' => !empty($ts['is_tampil']),
                            'created_at' => $ts['created_at'] ?? now(),
                            'updated_at' => $ts['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            if (!empty($data['faq'])) {
                foreach ($data['faq'] as $fq) {
                    DB::table('faq')->updateOrInsert(
                        ['id' => $fq['id']],
                        [
                            'pertanyaan' => $fq['pertanyaan'],
                            'jawaban' => $fq['jawaban'],
                            'urutan' => $fq['urutan'] ?? 0,
                            'is_aktif' => $fq['is_aktif'] ?? true,
                            'created_at' => $fq['created_at'] ?? now(),
                            'updated_at' => $fq['updated_at'] ?? now(),
                        ]
                    );
                }
            }

            if (!empty($data['pengaturan'])) {
                foreach ($data['pengaturan'] as $pg) {
                    DB::table('pengaturan')->updateOrInsert(
                        ['key' => $pg['key']],
                        [
                            'value' => is_string($pg['value']) ? $pg['value'] : json_encode($pg['value']),
                            'updated_at' => $pg['updated_at'] ?? now(),
                            'created_at' => now(),
                        ]
                    );
                }
            }

            DB::commit();
            $this->command->info("Data from db_store.json successfully imported into PostgreSQL!");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Error seeding database: " . $e->getMessage());
            throw $e;
        }
    }
}
