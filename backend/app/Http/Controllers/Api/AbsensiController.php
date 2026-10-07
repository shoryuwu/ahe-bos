<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Http\Request;

class AbsensiController extends Controller
{
    public function rekapSiswa($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $records = Absensi::with('sesi.guru')
            ->where('siswa_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $records->count(),
            'hadir' => $records->where('status', 'hadir')->count(),
            'izin' => $records->where('status', 'izin')->count(),
            'sakit' => $records->where('status', 'sakit')->count(),
            'alpha' => $records->where('status', 'alpha')->count(),
        ];
        $stats['persentase_kehadiran'] = $stats['total'] > 0
            ? round(($stats['hadir'] / $stats['total']) * 100, 1)
            : 0;

        return response()->json([
            'siswa' => $siswa,
            'stats' => $stats,
            'data' => $records
        ]);
    }

    public function rekapKelas($id)
    {
        $kelas = Kelas::with('siswa')->find($id);
        if (!$kelas) {
            return response()->json(['error' => 'Kelas tidak ditemukan'], 404);
        }

        $absensi = Absensi::with(['siswa', 'sesi'])
            ->whereHas('sesi', function ($q) use ($id) {
                $q->where('kelas_id', $id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'kelas' => $kelas,
            'data' => $absensi
        ]);
    }
}
