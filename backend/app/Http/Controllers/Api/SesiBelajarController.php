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
            'kelas_id' => 'required|string',
            'tanggal' => 'required|date',
            'materi' => 'required|string',
            'modul_id' => 'nullable|string',
            'siswa_data' => 'nullable|array', // array of {siswa_id, status_absensi, nilai, mood, langkah_selesai, catatan}
        ]);

        DB::beginTransaction();
        try {
            $user = $request->user();
            $guruId = $request->guru_id;
            if (!$guruId && $user && $user->role === 'tutor' && $user->guru) {
                $guruId = $user->guru->id;
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
                        'status' => $item['status_absensi'] ?? 'hadir',
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
                }
            }

            LogAktivitas::catat($user?->id, 'input_sesi_belajar', "Input sesi belajar tanggal {$request->tanggal} untuk kelas {$request->kelas_id}", $request->ip());

            DB::commit();
            return response()->json([
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

        $sesi->update($request->only(['materi', 'catatan_umum', 'status_sesi', 'modul_id', 'tanggal']));

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
