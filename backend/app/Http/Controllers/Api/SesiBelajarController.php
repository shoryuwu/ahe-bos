<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SesiBelajar;
use App\Models\Absensi;
use App\Models\NilaiSesi;
use App\Models\CatatanGuru;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SesiBelajarController extends Controller
{
    public function index(Request $request)
    {
        $query = SesiBelajar::with(['kelas.program', 'guru', 'guruPengganti', 'modul', 'absensi.siswa', 'nilai.siswa']);

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->filled('guru_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('guru_id', $request->guru_id)
                  ->orWhere('guru_pengganti_id', $request->guru_id);
            });
        }

        if ($request->filled('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        if ($request->filled('status')) {
            $query->where('status_sesi', $request->status);
        }

        $sesi = $query->orderBy('tanggal', 'desc')->get();
        return response()->json(['data' => $sesi]);
    }

    public function show($id)
    {
        $sesi = SesiBelajar::with([
            'kelas.program',
            'guru',
            'guruPengganti',
            'modul',
            'absensi.siswa',
            'nilai.siswa'
        ])->find($id);

        if (!$sesi) {
            return response()->json(['error' => 'Sesi belajar tidak ditemukan'], 404);
        }

        return response()->json(['data' => $sesi]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|string|exists:kelas,id',
            'tanggal' => 'required|date',
            'materi' => 'required|string',
            'modul_id' => 'nullable|string',
            'siswa_data' => 'nullable|array',
            'siswa_data.*.siswa_id' => 'required|string|exists:siswa,id',
            'siswa_data.*.status_absensi' => 'nullable|in:hadir,izin,sakit,alpha',
            'siswa_data.*.absensi' => 'nullable|in:hadir,izin,sakit,alpha',
            'siswa_data.*.nilai' => 'nullable|integer|min:0|max:100',
            'siswa_data.*.mood' => 'nullable|integer|min:1|max:5',
            'video_url' => 'nullable|string|max:500',
        ]);

        $kelas = \App\Models\Kelas::find($request->kelas_id);
        $user = $request->user();

        if ($user && $user->role === 'tutor') {
            $tutorGuruId = $user->guru?->id;
            if (!$tutorGuruId || $kelas->guru_id !== $tutorGuruId) {
                return response()->json([
                    'error' => 'Anda tidak ditugaskan mengajar pada kelas ini'
                ], 403);
            }
        }

        $sesiGanda = SesiBelajar::where('kelas_id', $request->kelas_id)
            ->whereDate('tanggal', $request->tanggal)
            ->where('status_sesi', '!=', 'dibatalkan')
            ->exists();

        if ($sesiGanda) {
            return response()->json([
                'error' => 'Sesi belajar untuk kelas dan tanggal tersebut sudah tercatat'
            ], 422);
        }

        if ($request->filled('siswa_data') && is_array($request->siswa_data)) {
            foreach ($request->siswa_data as $item) {
                $siswaId = $item['siswa_id'] ?? null;
                if (!$siswaId) continue;
                $siswa = \App\Models\Siswa::find($siswaId);
                if (!$siswa || $siswa->kelas_id !== $request->kelas_id) {
                    return response()->json([
                        'error' => "Siswa {$siswaId} tidak terdaftar pada kelas {$kelas->nama}"
                    ], 422);
                }
            }
        }

        DB::beginTransaction();
        try {
            $guruId = $request->guru_id;
            if (!$guruId && $user && $user->role === 'tutor' && $user->guru) {
                $guruId = $user->guru->id;
            }
            if (!$guruId) {
                $guruId = $kelas->guru_id;
            }

            $sesiId = 'ses-' . Str::random(8);

            $sesi = SesiBelajar::create([
                'id' => $sesiId,
                'kelas_id' => $request->kelas_id,
                'guru_id' => $guruId,
                'modul_id' => $request->modul_id,
                'tanggal' => $request->tanggal,
                'materi' => $request->materi,
                'catatan_umum' => $request->catatan_umum,
                'video_url' => $request->video_url,
                'status_sesi' => 'selesai',
            ]);

            if ($request->filled('siswa_data') && is_array($request->siswa_data)) {
                foreach ($request->siswa_data as $item) {
                    $siswaId = $item['siswa_id'] ?? null;
                    if (!$siswaId) continue;

                    // Absensi
                    Absensi::create([
                        'id' => 'abs-' . Str::random(8),
                        'sesi_id' => $sesi->id,
                        'siswa_id' => $siswaId,
                        'status' => $item['status_absensi'] ?? $item['absensi'] ?? 'hadir',
                        'keterangan' => $item['keterangan_absensi'] ?? null,
                    ]);

                    // Nilai Sesi
                    NilaiSesi::create([
                        'id' => 'nli-' . Str::random(8),
                        'sesi_id' => $sesi->id,
                        'siswa_id' => $siswaId,
                        'nilai' => $item['nilai'] ?? 0,
                        'mood' => $item['mood'] ?? 3,
                        'langkah_selesai' => $item['langkah_selesai'] ?? [1, 2, 3, 4, 5, 6],
                        'catatan' => $item['catatan'] ?? null,
                        'video_url' => $item['video_url'] ?? $request->video_url ?? null,
                    ]);

                    // Catatan Guru jika ada
                    if (!empty($item['catatan'])) {
                        CatatanGuru::create([
                            'id' => 'cg-' . Str::random(8),
                            'siswa_id' => $siswaId,
                            'guru_id' => $guruId,
                            'tanggal' => $request->tanggal,
                            'catatan' => $item['catatan'],
                            'tipe' => 'progress',
                        ]);
                    }

                    $siswaObj = \App\Models\Siswa::with('orangtua')->find($siswaId);
                    if ($siswaObj && $siswaObj->orangtua && $siswaObj->orangtua->user_id) {
                        \App\Models\Notifikasi::kirim(
                            $siswaObj->orangtua->user_id,
                            'Laporan Sesi Belajar Baru',
                            "Sesi belajar ananda {$siswaObj->nama} ({$request->materi}) telah dicatat oleh Tutor.",
                            'sukses',
                            '/orangtua'
                        );
                    }
                }
            }

            LogAktivitas::catat($user?->id, 'input_sesi_belajar', "Input sesi belajar tanggal {$request->tanggal} untuk kelas {$request->kelas_id}", $request->ip());

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Sesi belajar berhasil disimpan',
                'data' => $sesi->load(['absensi.siswa', 'nilai.siswa'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menyimpan sesi: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $sesi = SesiBelajar::find($id);
        if (!$sesi) {
            return response()->json(['error' => 'Sesi belajar tidak ditemukan'], 404);
        }

        $sesi->update($request->only(['materi', 'catatan_umum', 'status_sesi', 'modul_id', 'tanggal', 'video_url']));

        LogAktivitas::catat($request->user()?->id, 'update_sesi', "Mengubah sesi belajar {$sesi->id}", $request->ip());

        return response()->json([
            'message' => 'Sesi belajar berhasil diperbarui',
            'data' => $sesi
        ]);
    }

    public function batalkan(Request $request, $id)
    {
        $sesi = SesiBelajar::find($id);
        if (!$sesi) {
            return response()->json(['error' => 'Sesi belajar tidak ditemukan'], 404);
        }

        $sesi->update([
            'status_sesi' => 'dibatalkan',
            'catatan_umum' => $request->alasan ?? 'Dibatalkan',
        ]);

        LogAktivitas::catat($request->user()?->id, 'batalkan_sesi', "Membatalkan sesi belajar {$sesi->id}", $request->ip());

        return response()->json([
            'message' => 'Sesi belajar berhasil dibatalkan',
            'data' => $sesi
        ]);
    }

    public function setPengganti(Request $request, $id)
    {
        $request->validate([
            'guru_pengganti_id' => 'required|string|exists:guru,id',
        ]);

        $sesi = SesiBelajar::find($id);
        if (!$sesi) {
            return response()->json(['error' => 'Sesi belajar tidak ditemukan'], 404);
        }

        $sesi->update(['guru_pengganti_id' => $request->guru_pengganti_id]);

        LogAktivitas::catat($request->user()?->id, 'assign_guru_pengganti', "Assign guru pengganti untuk sesi {$sesi->id}", $request->ip());

        return response()->json([
            'message' => 'Guru pengganti berhasil ditentukan',
            'data' => $sesi->load('guruPengganti')
        ]);
    }
}
