<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Orangtua;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with(['orangtua', 'kelas.program', 'kelas.guru']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->filled('level')) {
            $query->where('level_saat_ini', $request->level);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'ilike', "%{$s}%")
                  ->orWhereHas('orangtua', function ($oq) use ($s) {
                      $oq->where('nama', 'ilike', "%{$s}%");
                  });
            });
        }

        $siswa = $query->orderBy('nama')->get();

        return response()->json(['data' => $siswa]);
    }

    public function show($id)
    {
        $siswa = Siswa::with([
            'orangtua',
            'kelas.program',
            'kelas.guru',
            'riwayatLevel',
            'pencapaian',
            'progressIndikator' => function ($q) {
                $q->orderBy('bulan', 'desc');
            },
            'catatan' => function ($q) {
                $q->with('guru')->orderBy('tanggal', 'desc');
            }
        ])->find($id);

        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        return response()->json(['data' => $siswa]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'orangtua_id' => 'required|string',
            'level_saat_ini' => 'required|string',
        ]);

        $id = 'sis-' . Str::random(8);

        $siswa = Siswa::create([
            'id' => $id,
            'orangtua_id' => $request->orangtua_id,
            'nama' => $request->nama,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'level_saat_ini' => $request->level_saat_ini,
            'kelas_id' => $request->kelas_id,
            'status' => 'aktif',
            'tanggal_masuk' => $request->tanggal_masuk ?? now()->toDateString(),
        ]);

        LogAktivitas::catat($request->user()?->id, 'tambah_siswa', "Menambahkan siswa {$siswa->nama}", $request->ip());

        return response()->json([
            'message' => 'Siswa berhasil ditambahkan',
            'data' => $siswa->load(['orangtua', 'kelas'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $siswa->update($request->only([
            'nama', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
            'level_saat_ini', 'kelas_id', 'status', 'tanggal_masuk', 'tanggal_keluar'
        ]));

        LogAktivitas::catat($request->user()?->id, 'update_siswa', "Mengubah data siswa {$siswa->nama}", $request->ip());

        return response()->json([
            'message' => 'Data siswa berhasil diperbarui',
            'data' => $siswa->load(['orangtua', 'kelas'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:aktif,nonaktif,lulus'
        ]);

        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $siswa->update([
            'status' => $request->status,
            'tanggal_keluar' => in_array($request->status, ['nonaktif', 'lulus']) ? now()->toDateString() : null
        ]);

        LogAktivitas::catat($request->user()?->id, 'ubah_status_siswa', "Mengubah status siswa {$siswa->nama} ke {$request->status}", $request->ip());

        return response()->json([
            'message' => "Status siswa berhasil diubah menjadi {$request->status}",
            'data' => $siswa
        ]);
    }

    public function getAbsensi($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $absensi = $siswa->absensi()->with('sesi.guru')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $absensi]);
    }

    public function getNilai($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $nilai = $siswa->nilaiSesi()->with('sesi.guru')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $nilai]);
    }

    public function getKosakata($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $kosakata = $siswa->kosakata()->orderBy('kata')->get();
        return response()->json(['data' => $kosakata]);
    }

    public function getProgress($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $progress = $siswa->progressIndikator()->orderBy('bulan', 'asc')->get();
        return response()->json(['data' => $progress]);
    }

    public function getCatatan($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $catatan = $siswa->catatan()->with('guru')->orderBy('tanggal', 'desc')->get();
        return response()->json(['data' => $catatan]);
    }

    public function getPencapaian($id)
    {
        $siswa = Siswa::find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $pencapaian = $siswa->pencapaian()->orderBy('tanggal_raih', 'desc')->get();
        return response()->json(['data' => $pencapaian]);
    }
}
