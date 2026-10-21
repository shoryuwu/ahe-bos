<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LaporanController extends Controller
{
    /**
     * GET /api/laporan/rapor/{siswaId}
     * Compile rapor data for print page.
     */
    public function rapor(Request $request, string $siswaId)
    {
        $siswa = Siswa::with([
            'orangtua',
            'kelas.guru',
            'kelas.program',
            'pencapaian',
            'catatan' => fn($q) => $q->with('guru')->orderBy('tanggal', 'desc')->take(5),
            'absensi' => fn($q) => $q->orderBy('created_at', 'desc'),
            'progressIndikator' => fn($q) => $q->orderBy('bulan', 'desc')->take(1),
        ])->find($siswaId);

        if (!$siswa) {
            return response()->json(['success' => false, 'message' => 'Siswa tidak ditemukan'], 404);
        }

        // --- Kehadiran recap ---
        $absensiAll = $siswa->absensi;
        $hadir  = $absensiAll->where('status', 'hadir')->count();
        $izin   = $absensiAll->where('status', 'izin')->count();
        $sakit  = $absensiAll->where('status', 'sakit')->count();
        $alpha  = $absensiAll->where('status', 'alpha')->count();
        $total  = $absensiAll->count();
        $persen = $total > 0 ? round(($hadir / $total) * 100, 1) : 0;

        // --- Progress indikator (latest month) ---
        $latestIndikator = $siswa->progressIndikator->first();
        $indikator = [
            'bulan'            => $latestIndikator?->bulan ?? Carbon::now()->format('Y-m'),
            'mengenal_huruf'   => $latestIndikator?->mengenal_huruf ?? 0,
            'membaca_suku_kata'=> $latestIndikator?->membaca_suku_kata ?? 0,
            'membaca_kata'     => $latestIndikator?->membaca_kata ?? 0,
            'membaca_kalimat'  => $latestIndikator?->membaca_kalimat ?? 0,
            'membaca_cerita'   => $latestIndikator?->membaca_cerita ?? 0,
        ];

        // --- Catatan evaluasi (latest notes joined) ---
        $catatanEvaluasi = $siswa->catatan
            ->pluck('catatan')
            ->take(3)
            ->implode(' | ');

        if (!$catatanEvaluasi) {
            $catatanEvaluasi = 'Siswa menunjukkan perkembangan yang baik dan konsisten dalam mengikuti pembelajaran fonik AHE.';
        }

        return response()->json([
            'success' => true,
            'data' => [
                'siswa'           => array_merge($siswa->toArray(), ['level' => $siswa->level_saat_ini]),
                'orangtua'        => $siswa->orangtua,
                'kelas'           => $siswa->kelas,
                'guru'            => $siswa->kelas?->guru,
                'kehadiran'       => compact('hadir', 'izin', 'sakit', 'alpha', 'total', 'persen'),
                'indikator'       => $indikator,
                'catatan_evaluasi'=> $catatanEvaluasi,
            ],
        ]);
    }
}
