<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Siswa;
use App\Models\Orangtua;
use App\Models\User;
use App\Models\Kelas;
use App\Models\WaitingList;
use App\Models\LogAktivitas;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PendaftaranController extends Controller
{
    public function index(Request $request)
    {
        $query = Pendaftaran::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tipe')) {
            $query->where('tipe_pendaftaran', $request->tipe);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('no_registrasi', 'ilike', "%{$s}%")
                  ->orWhere('nama_anak', 'ilike', "%{$s}%")
                  ->orWhere('nama_ortu', 'ilike', "%{$s}%")
                  ->orWhere('no_wa', 'like', "%{$s}%");
            });
        }

        $pendaftaran = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $pendaftaran]);
    }

    public function show($id)
    {
        $pendaftaran = Pendaftaran::with('siswa')->find($id);
        if (!$pendaftaran) {
            return response()->json(['error' => 'Pendaftaran tidak ditemukan'], 404);
        }

        return response()->json(['data' => $pendaftaran]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipe_pendaftaran' => 'nullable|in:reguler,trial',
            'nama_anak' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'nama_ortu' => 'required|string|max:255',
            'hubungan_ortu' => 'nullable|string',
            'no_wa' => 'required|string',
            'email' => 'required|email',
            'alamat' => 'required|string',
            'program_diminati' => 'required|string',
        ]);

        $year = date('Y');
        $prefix = ($request->tipe_pendaftaran === 'trial') ? "TRL-{$year}-" : "REG-{$year}-";

        $count = Pendaftaran::where('no_registrasi', 'like', "{$prefix}%")->count() + 1;
        $noRegistrasi = $prefix . str_pad($count, 3, '0', STR_PAD_LEFT);

        $id = 'reg-' . Str::random(8);

        $pendaftaran = Pendaftaran::create([
            'id' => $id,
            'no_registrasi' => $noRegistrasi,
            'tipe_pendaftaran' => $request->tipe_pendaftaran ?? 'reguler',
            'nama_anak' => $request->nama_anak,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'nama_ortu' => $request->nama_ortu,
            'hubungan_ortu' => $request->hubungan_ortu ?? 'ibu',
            'no_wa' => $request->no_wa,
            'email' => $request->email,
            'alamat' => $request->alamat,
            'program_diminati' => $request->program_diminati,
            'preferensi_jadwal' => $request->preferensi_jadwal,
            'catatan_khusus' => $request->catatan_khusus,
            'status' => 'menunggu',
        ]);

        // Notifikasi ke admin
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notifikasi::kirim(
                $admin->id,
                'Pendaftaran Baru',
                "Pendaftaran baru atas nama {$pendaftaran->nama_anak} ({$pendaftaran->no_registrasi})",
                'info',
                "/admin?tab=pendaftaran"
            );
        }

        return response()->json([
            'message' => 'Pendaftaran berhasil dikirim',
            'data' => $pendaftaran
        ], 201);
    }

    public function terima(Request $request, $id)
    {
        $request->validate([
            'kelas_id' => 'required|string',
            'level' => 'nullable|string',
        ]);

        $pendaftaran = Pendaftaran::find($id);
        if (!$pendaftaran) {
            return response()->json(['error' => 'Pendaftaran tidak ditemukan'], 404);
        }

        DB::beginTransaction();
        try {
            // Find or create Orangtua & User account
            $user = User::where('email', $pendaftaran->email)->first();
            if (!$user) {
                $userId = 'usr-ortu-' . Str::random(8);
                $user = User::create([
                    'id' => $userId,
                    'name' => $pendaftaran->nama_ortu,
                    'nama' => $pendaftaran->nama_ortu,
                    'email' => $pendaftaran->email,
                    'password' => Hash::make('ortu123'),
                    'role' => 'orangtua',
                    'is_active' => true,
                    'password_reset_required' => true,
                ]);
                $user->assignRole('orangtua');
            }

            $orangtua = Orangtua::where('user_id', $user->id)->first();
            if (!$orangtua) {
                $orangtuaId = 'ort-' . Str::random(8);
                $orangtua = Orangtua::create([
                    'id' => $orangtuaId,
                    'user_id' => $user->id,
                    'nama' => $pendaftaran->nama_ortu,
                    'no_wa' => $pendaftaran->no_wa,
                    'email' => $pendaftaran->email,
                    'alamat' => $pendaftaran->alamat,
                    'hubungan' => $pendaftaran->hubungan_ortu ?? 'ibu',
                ]);
            }

            // Create Siswa
            $siswaId = 'sis-' . Str::random(8);
            $siswa = Siswa::create([
                'id' => $siswaId,
                'orangtua_id' => $orangtua->id,
                'nama' => $pendaftaran->nama_anak,
                'tempat_lahir' => $pendaftaran->tempat_lahir,
                'tanggal_lahir' => $pendaftaran->tanggal_lahir,
                'jenis_kelamin' => $pendaftaran->jenis_kelamin,
                'level_saat_ini' => $request->level ?? 'Pra Membaca',
                'kelas_id' => $request->kelas_id,
                'status' => 'aktif',
                'tanggal_masuk' => now()->toDateString(),
            ]);

            // Update Pendaftaran
            $pendaftaran->update([
                'status' => 'diterima',
                'siswa_id' => $siswa->id,
            ]);

            LogAktivitas::catat($request->user()?->id, 'terima_pendaftaran', "Menerima pendaftaran {$pendaftaran->no_registrasi} dan membuat siswa {$siswa->nama}", $request->ip());

            DB::commit();
            return response()->json([
                'message' => 'Pendaftaran berhasil diterima dan siswa baru telah dibuat',
                'data' => [
                    'pendaftaran' => $pendaftaran,
                    'siswa' => $siswa,
                    'orangtua' => $orangtua,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menerima pendaftaran: ' . $e->getMessage()], 500);
        }
    }

    public function tolak(Request $request, $id)
    {
        $request->validate([
            'alasan_penolakan' => 'required|string',
        ]);

        $pendaftaran = Pendaftaran::find($id);
        if (!$pendaftaran) {
            return response()->json(['error' => 'Pendaftaran tidak ditemukan'], 404);
        }

        $pendaftaran->update([
            'status' => 'ditolak',
            'alasan_penolakan' => $request->alasan_penolakan,
        ]);

        LogAktivitas::catat($request->user()?->id, 'tolak_pendaftaran', "Menolak pendaftaran {$pendaftaran->no_registrasi}: {$request->alasan_penolakan}", $request->ip());

        return response()->json([
            'message' => 'Pendaftaran berhasil ditolak',
            'data' => $pendaftaran
        ]);
    }

    public function tunda(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::find($id);
        if (!$pendaftaran) {
            return response()->json(['error' => 'Pendaftaran tidak ditemukan'], 404);
        }

        $pendaftaran->update(['status' => 'ditunda']);

        // Masukkan ke waiting list jika ada program
        $urutan = WaitingList::where('program_id', $pendaftaran->program_diminati)->count() + 1;
        WaitingList::create([
            'id' => 'wtl-' . Str::random(8),
            'pendaftaran_id' => $pendaftaran->id,
            'program_id' => $pendaftaran->program_diminati,
            'preferensi_jadwal' => $pendaftaran->preferensi_jadwal,
            'urutan_antrian' => $urutan,
            'status' => 'menunggu',
        ]);

        LogAktivitas::catat($request->user()?->id, 'tunda_pendaftaran', "Menunda pendaftaran {$pendaftaran->no_registrasi} ke waiting list", $request->ip());

        return response()->json([
            'message' => 'Pendaftaran ditunda dan dimasukkan ke waiting list',
            'data' => $pendaftaran
        ]);
    }

    public function cekStatus($noRegistrasi)
    {
        $pendaftaran = Pendaftaran::where('no_registrasi', $noRegistrasi)->first();
        if (!$pendaftaran) {
            return response()->json(['error' => 'Nomor registrasi tidak ditemukan'], 404);
        }

        return response()->json([
            'data' => [
                'no_registrasi' => $pendaftaran->no_registrasi,
                'nama_anak' => $pendaftaran->nama_anak,
                'status' => $pendaftaran->status,
                'alasan_penolakan' => $pendaftaran->alasan_penolakan,
                'created_at' => $pendaftaran->created_at,
            ]
        ]);
    }
}
