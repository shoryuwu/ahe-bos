<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asesmen;
use App\Models\Siswa;
use App\Models\RiwayatLevel;
use App\Models\Pencapaian;
use App\Models\Notifikasi;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AsesmenController extends Controller
{
    public function index(Request $request)
    {
        $query = Asesmen::with(['siswa.orangtua', 'guru']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }

        $asesmen = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $asesmen]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|string|exists:siswa,id',
            'guru_id' => 'required|string|exists:guru,id',
            'dari_level' => 'required|string',
            'ke_level' => 'required|string',
            'nilai_tertulis' => 'required|integer|min:0|max:100',
            'nilai_praktik' => 'required|integer|min:0|max:100',
            'rekomendasi' => 'required|in:lulus,belum-siap',
        ]);

        $id = 'asm-' . Str::random(8);

        $asesmen = Asesmen::create([
            'id' => $id,
            'siswa_id' => $request->siswa_id,
            'guru_id' => $request->guru_id,
            'dari_level' => $request->dari_level,
            'ke_level' => $request->ke_level,
            'tanggal_pengajuan' => now()->toDateString(),
            'nilai_tertulis' => $request->nilai_tertulis,
            'nilai_praktik' => $request->nilai_praktik,
            'checklist_indikator' => $request->checklist_indikator,
            'catatan_evaluasi' => $request->catatan_evaluasi,
            'rekomendasi' => $request->rekomendasi,
            'status' => 'menunggu',
        ]);

        $siswa = Siswa::find($request->siswa_id);
        LogAktivitas::catat($request->user()?->id, 'ajukan_asesmen', "Mengajukan asesmen kenaikan level untuk {$siswa?->nama}", $request->ip());

        return response()->json([
            'message' => 'Pengajuan asesmen berhasil disimpan',
            'data' => $asesmen->load(['siswa', 'guru'])
        ], 201);
    }

    public function approve(Request $request, $id)
    {
        $asesmen = Asesmen::with('siswa.orangtua')->find($id);
        if (!$asesmen) {
            return response()->json(['error' => 'Asesmen tidak ditemukan'], 404);
        }

        DB::beginTransaction();
        try {
            $user = $request->user();

            $asesmen->update([
                'status' => 'disetujui',
                'disetujui_oleh' => $user?->nama ?? $user?->name ?? 'Admin',
                'tanggal_persetujuan' => now()->toDateString(),
                'catatan_evaluasi' => $request->catatan ?? $asesmen->catatan_evaluasi,
            ]);

            $siswa = $asesmen->siswa;
            if ($siswa) {
                // Update level siswa
                $siswa->update([
                    'level_saat_ini' => $asesmen->ke_level,
                ]);

                // Update riwayat level sebelumnya
                RiwayatLevel::where('siswa_id', $siswa->id)
                    ->where('status', 'sedang')
                    ->update([
                        'status' => 'selesai',
                        'tanggal_selesai' => now()->toDateString(),
                        'progress_persen' => 100,
                    ]);

                // Buat riwayat level baru
                RiwayatLevel::create([
                    'id' => 'rl-' . Str::random(8),
                    'siswa_id' => $siswa->id,
                    'level' => $asesmen->ke_level,
                    'tanggal_mulai' => now()->toDateString(),
                    'status' => 'sedang',
                    'progress_persen' => 0,
                ]);

                // Buat badge pencapaian
                Pencapaian::create([
                    'id' => 'ach-' . Str::random(8),
                    'siswa_id' => $siswa->id,
                    'nama_badge' => "Lulus {$asesmen->dari_level}",
                    'ikon' => '🎓',
                    'kategori' => 'milestone',
                    'deskripsi' => "Berhasil menyelesaikan dan naik level ke {$asesmen->ke_level}",
                    'tanggal_raih' => now()->toDateString(),
                ]);

                // Kirim notifikasi ke orang tua jika ada user akun
                if ($siswa->orangtua && $siswa->orangtua->user_id) {
                    Notifikasi::kirim(
                        $siswa->orangtua->user_id,
                        'Selamat! Kenaikan Level',
                        "Ananda {$siswa->nama} telah resmi naik level ke {$asesmen->ke_level}!",
                        'sukses',
                        '/dashboard'
                    );
                }
            }

            LogAktivitas::catat($user?->id, 'approve_asesmen', "Menyetujui kenaikan level siswa {$siswa?->nama} ke {$asesmen->ke_level}", $request->ip());

            DB::commit();
            return response()->json([
                'message' => 'Asesmen berhasil disetujui dan level siswa telah diperbarui',
                'data' => $asesmen->load(['siswa', 'guru'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menyetujui asesmen: ' . $e->getMessage()], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        $asesmen = Asesmen::with('siswa')->find($id);
        if (!$asesmen) {
            return response()->json(['error' => 'Asesmen tidak ditemukan'], 404);
        }

        $asesmen->update([
            'status' => 'ditolak',
            'catatan_evaluasi' => $request->alasan ?? 'Belum memenuhi kriteria kelulusan',
            'disetujui_oleh' => $request->user()?->nama ?? $request->user()?->name,
            'tanggal_persetujuan' => now()->toDateString(),
        ]);

        LogAktivitas::catat($request->user()?->id, 'reject_asesmen', "Menolak asesmen kenaikan level siswa {$asesmen->siswa?->nama}", $request->ip());

        return response()->json([
            'message' => 'Asesmen ditolak',
            'data' => $asesmen
        ]);
    }
}
