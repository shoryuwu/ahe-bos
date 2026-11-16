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
    private function deniesParentAccess(Request $request, Siswa $siswa): bool
    {
        $user = $request->user();
        if ($user && $user->role === 'orangtua') {
            $siswa->loadMissing('orangtua');
            return !$siswa->orangtua || $siswa->orangtua->user_id !== $user->id;
        }
        return false;
    }

    public function index(Request $request)
    {
        $query = Siswa::with(['orangtua', 'kelas.program', 'kelas.guru']);

        $user = $request->user();
        if ($user && $user->role === 'orangtua') {
            $query->whereHas('orangtua', function ($oq) use ($user) {
                $oq->where('user_id', $user->id);
            });
        }

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

    public function show(Request $request, $id)
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

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        return response()->json(['data' => $siswa]);
    }

    public function store(Request $request)
    {
        // Apabila form Admin mengirim data wali baru/lama tanpa orangtua_id, cari atau buat Orangtua terlebih dahulu
        if (!$request->filled('orangtua_id') && $request->filled('nama_ortu')) {
            $emailOrtu = $request->input('email_ortu') ?: ('wali.' . (preg_replace('/[^0-9]/', '', (string) $request->input('no_wa_ortu')) ?: Str::random(6)) . '@ahe.id');
            $noWaOrtu = $request->input('no_wa_ortu') ?: '-';

            $orangtua = Orangtua::where('email', $emailOrtu)->orWhere('no_wa', $noWaOrtu)->first();
            if (!$orangtua) {
                $user = User::where('email', $emailOrtu)->first();
                if (!$user) {
                    $user = User::create([
                        'id' => 'usr-ortu-' . Str::random(8),
                        'name' => $request->nama_ortu,
                        'nama' => $request->nama_ortu,
                        'email' => $emailOrtu,
                        'password' => Hash::make('ortu123'),
                        'role' => 'orangtua',
                        'is_active' => true,
                        'password_reset_required' => true,
                    ]);
                    $user->assignRole('orangtua');
                }
                $orangtua = Orangtua::create([
                    'id' => 'ort-' . Str::random(8),
                    'user_id' => $user->id,
                    'nama' => $request->nama_ortu,
                    'no_wa' => $noWaOrtu,
                    'email' => $emailOrtu,
                    'alamat' => $request->input('alamat_ortu') ?: '-',
                    'hubungan' => $request->input('hubungan_ortu') ?: 'ibu',
                ]);
            }
            $request->merge(['orangtua_id' => $orangtua->id]);
        }

        if (!$request->filled('level_saat_ini')) {
            $request->merge(['level_saat_ini' => 'Pra Membaca']);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'orangtua_id' => 'required|string|exists:orangtua,id',
            'kelas_id' => 'nullable|string|exists:kelas,id',
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

    public function getAbsensi(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        $absensi = $siswa->absensi()->with('sesi.guru')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $absensi]);
    }

    public function getNilai(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        $nilai = $siswa->nilaiSesi()->with('sesi.guru')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $nilai]);
    }

    public function getKosakata(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        $kosakata = $siswa->kosakata()->orderBy('kata')->get();
        return response()->json(['data' => $kosakata]);
    }

    public function getProgress(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        $progress = $siswa->progressIndikator()->orderBy('bulan', 'asc')->get();
        return response()->json(['data' => $progress]);
    }

    public function getCatatan(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        $catatan = $siswa->catatan()->with('guru')->orderBy('tanggal', 'desc')->get();
        return response()->json(['data' => $catatan]);
    }

    public function getPencapaian(Request $request, $id)
    {
        $siswa = Siswa::with('orangtua')->find($id);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        if ($this->deniesParentAccess($request, $siswa)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap data anak ini'], 403);
        }

        $pencapaian = $siswa->pencapaian()->orderBy('tanggal_raih', 'desc')->get();
        return response()->json(['data' => $pencapaian]);
    }
}
