<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Http\Request;

class AbsensiController extends Controller
{
    public function rekapSiswa(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $user = $request->user();
        if ($user && $user->role === 'orangtua' && (!$siswa->orangtua || $siswa->orangtua->user_id !== $user->id)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data absensi anak ini'], 403);
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
