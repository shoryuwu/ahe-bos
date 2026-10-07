<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Pendaftaran;
use App\Models\Asesmen;
use App\Models\Absensi;
use App\Models\SesiBelajar;
use App\Models\Orangtua;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function adminStats()
    {
        $totalSiswa = Siswa::where('status', 'aktif')->count();
        $totalGuru = Guru::where('is_active', true)->count();
        $totalKelas = Kelas::where('status', 'aktif')->count();
        $pendaftaranMenunggu = Pendaftaran::where('status', 'menunggu')->count();
        $asesmenMenunggu = Asesmen::where('status', 'menunggu')->count();

        // Kehadiran bulan ini
        $now = Carbon::now();
        $totalAbsensiBulanIni = Absensi::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();
        $hadirBulanIni = Absensi::whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->where('status', 'hadir')
            ->count();

        $persentaseKehadiran = $totalAbsensiBulanIni > 0
            ? round(($hadirBulanIni / $totalAbsensiBulanIni) * 100, 1)
            : 100;

        // Distribusi Level Siswa
        $levelDistribution = Siswa::where('status', 'aktif')
            ->select('level_saat_ini', DB::raw('count(*) as count'))
            ->groupBy('level_saat_ini')
            ->get();

        // Siswa perlu perhatian (alpha >= 3)
        $siswaAlpha = Siswa::whereHas('absensi', function ($q) use ($now) {
            $q->where('status', 'alpha')
              ->whereMonth('created_at', $now->month)
              ->whereYear('created_at', $now->year);
        }, '>=', 3)->with(['orangtua', 'kelas'])->get();

        // Pendaftaran terbaru
        $pendaftaranTerbaru = Pendaftaran::orderBy('created_at', 'desc')->take(5)->get();

        // Asesmen pending
        $asesmenPending = Asesmen::with(['siswa', 'guru'])->where('status', 'menunggu')->take(5)->get();

        return response()->json([
            'stats' => [
                'total_siswa' => $totalSiswa,
                'total_guru' => $totalGuru,
                'total_kelas' => $totalKelas,
                'pendaftaran_menunggu' => $pendaftaranMenunggu,
                'asesmen_menunggu' => $asesmenMenunggu,
                'persentase_kehadiran' => $persentaseKehadiran,
            ],
            'distribusi_level' => $levelDistribution,
            'siswa_perlu_perhatian' => $siswaAlpha,
            'pendaftaran_terbaru' => $pendaftaranTerbaru,
            'asesmen_pending' => $asesmenPending,
        ]);
    }

    public function parentMe(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $orangtua = Orangtua::where('user_id', $user->id)->first();
        if (!$orangtua) {
            // Cek orangtua berdasarkan email
            $orangtua = Orangtua::where('email', $user->email)->first();
        }

        if (!$orangtua) {
            return response()->json(['error' => 'Data profil orang tua belum terhubung'], 404);
        }

        $siswa = Siswa::with([
            'kelas.program',
            'kelas.guru',
            'riwayatLevel',
            'pencapaian',
            'progressIndikator' => function ($q) {
                $q->orderBy('bulan', 'desc')->take(6);
            },
            'catatan' => function ($q) {
                $q->with('guru')->orderBy('tanggal', 'desc')->take(10);
            },
            'nilaiSesi' => function ($q) {
                $q->with('sesi')->orderBy('created_at', 'desc')->take(15);
            },
            'absensi' => function ($q) {
                $q->with('sesi')->orderBy('created_at', 'desc')->take(20);
            }
        ])->where('orangtua_id', $orangtua->id)->get();

        return response()->json([
            'orangtua' => $orangtua,
            'siswa' => $siswa,
        ]);
    }

    public function tutorJadwal(Request $request)
    {
        $user = $request->user();
        $guru = Guru::where('user_id', $user->id)->first();
        if (!$guru) {
            $guru = Guru::where('email', $user->email)->first();
        }

        if (!$guru) {
            return response()->json(['error' => 'Data guru belum terhubung'], 404);
        }

        $kelas = Kelas::with(['program', 'siswa'])
            ->where('guru_id', $guru->id)
            ->where('status', 'aktif')
            ->get();

        $today = Carbon::today()->toDateString();
        $sesiHariIni = SesiBelajar::with(['kelas.program', 'absensi.siswa', 'nilai.siswa'])
            ->where(function ($q) use ($guru) {
                $q->where('guru_id', $guru->id)
                  ->orWhere('guru_pengganti_id', $guru->id);
            })
            ->where('tanggal', $today)
            ->get();

        $sesiTerakhir = SesiBelajar::with(['kelas.program'])
            ->where('guru_id', $guru->id)
            ->orderBy('tanggal', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'guru' => $guru,
            'kelas' => $kelas,
            'sesi_hari_ini' => $sesiHariIni,
            'sesi_terakhir' => $sesiTerakhir,
        ]);
    }
}
