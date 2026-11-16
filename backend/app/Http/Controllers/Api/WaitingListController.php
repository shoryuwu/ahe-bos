<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaitingList;
use App\Models\Pendaftaran;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Orangtua;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class WaitingListController extends Controller
{
    public function index(Request $request)
    {
        $query = WaitingList::with(['pendaftaran', 'program']);

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', '!=', 'dibatalkan');
        }

        $list = $query->orderBy('urutan_antrian')->get();
        return response()->json(['data' => $list]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pendaftaran_id' => 'required|string|exists:pendaftaran,id',
        ]);

        $pendaftaran = Pendaftaran::find($request->pendaftaran_id);
        if (!$pendaftaran) {
            return response()->json(['error' => 'Data pendaftaran tidak ditemukan'], 404);
        }

        if ($pendaftaran->status === 'diterima') {
            return response()->json(['error' => 'Pendaftaran ini sudah diterima sebelumnya'], 422);
        }

        $existing = WaitingList::where('pendaftaran_id', $pendaftaran->id)
            ->where('status', 'menunggu')
            ->first();

        if ($existing) {
            $pendaftaran->update(['status' => 'ditunda']);
            return response()->json([
                'success' => true,
                'message' => 'Calon siswa sudah berada di dalam antrean waiting list',
                'data' => $existing->load(['pendaftaran', 'program']),
            ]);
        }

        $pendaftaran->update(['status' => 'ditunda']);

        $programId = $request->program_id ?? $pendaftaran->program_diminati ?? 'prg-001';
        $prefJadwal = $request->preferensi_jadwal ?? $pendaftaran->preferensi_jadwal ?? ['fleksibel'];
        if (is_string($prefJadwal)) {
            $prefJadwal = [$prefJadwal];
        }

        $urutan = WaitingList::where('program_id', $programId)
            ->where('status', 'menunggu')
            ->count() + 1;

        $waiting = WaitingList::create([
            'id' => 'wtl-' . Str::random(8),
            'pendaftaran_id' => $pendaftaran->id,
            'program_id' => $programId,
            'preferensi_jadwal' => $prefJadwal,
            'urutan_antrian' => $urutan,
            'status' => 'menunggu',
        ]);

        LogAktivitas::catat(
            $request->user()?->id,
            'tunda_pendaftaran',
            "Memasukkan pendaftaran {$pendaftaran->no_registrasi} ({$pendaftaran->nama_anak}) ke waiting list",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil dimasukkan ke waiting list',
            'data' => $waiting->load(['pendaftaran', 'program']),
        ], 201);
    }

    public function assign(Request $request, $id)
    {
        $request->validate([
            'kelas_id' => 'required|string|exists:kelas,id',
        ]);

        $waiting = WaitingList::with('pendaftaran')->find($id);
        if (!$waiting) {
            return response()->json(['error' => 'Data waiting list tidak ditemukan'], 404);
        }

        $kelas = Kelas::withCount('siswa')->find($request->kelas_id);
        $maxKapasitas = $kelas->kapasitas ?? 2;
        if ($kelas && $kelas->siswa_count >= $maxKapasitas) {
            return response()->json([
                'error' => "Kelas {$kelas->nama} sudah penuh (maksimal {$maxKapasitas} anak per guru)"
            ], 422);
        }

        DB::beginTransaction();
        try {
            $pd = $waiting->pendaftaran;

            // Create parent account if not exists
            $user = User::where('email', $pd->email)->first();
            $isNewUser = false;
            if (!$user) {
                $isNewUser = true;
                $user = User::create([
                    'id' => 'usr-ortu-' . Str::random(8),
                    'name' => $pd->nama_ortu,
                    'nama' => $pd->nama_ortu,
                    'email' => $pd->email,
                    'password' => Hash::make('ortu123'),
                    'role' => 'orangtua',
                    'is_active' => true,
                    'password_reset_required' => true,
                ]);
                $user->assignRole('orangtua');
            }

            $orangtua = Orangtua::where('user_id', $user->id)->first();
            if (!$orangtua) {
                $orangtua = Orangtua::create([
                    'id' => 'ort-' . Str::random(8),
                    'user_id' => $user->id,
                    'nama' => $pd->nama_ortu,
                    'no_wa' => $pd->no_wa,
                    'email' => $pd->email,
                    'alamat' => $pd->alamat,
                    'hubungan' => $pd->hubungan_ortu ?? 'ibu',
                ]);
            }

            $programMap = [
                'prg-001' => 'pra-membaca',
                'prg-002' => 'level-1',
                'prg-003' => 'level-2',
                'prg-004' => 'level-3',
                'prg-005' => 'lanjutan',
            ];
            $resolvedLevel = $programMap[$waiting->program_id]
                ?? $programMap[$pd->program_diminati]
                ?? $programMap[$kelas->program_id]
                ?? 'pra-membaca';

            // Create student
            $siswa = Siswa::create([
                'id' => 'sis-' . Str::random(8),
                'orangtua_id' => $orangtua->id,
                'nama' => $pd->nama_anak,
                'tempat_lahir' => $pd->tempat_lahir,
                'tanggal_lahir' => $pd->tanggal_lahir,
                'jenis_kelamin' => $pd->jenis_kelamin,
                'level_saat_ini' => $resolvedLevel,
                'kelas_id' => $request->kelas_id,
                'status' => 'aktif',
                'tanggal_masuk' => now()->toDateString(),
            ]);

            $waiting->update(['status' => 'ditempatkan']);
            $pd->update(['status' => 'diterima', 'siswa_id' => $siswa->id]);

            LogAktivitas::catat($request->user()?->id, 'assign_waiting_list', "Menempatkan antrian {$waiting->id} ke kelas {$request->kelas_id}", $request->ip());

            DB::commit();
            $siswaData = $siswa->load(['kelas', 'orangtua'])->toArray();
            $siswaData['akun_orangtua'] = $isNewUser ? [
                'email' => $user->email,
                'password' => 'ortu123',
            ] : null;

            return response()->json([
                'success' => true,
                'message' => 'Siswa dari waiting list berhasil ditempatkan di kelas',
                'data' => $siswaData
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menempatkan siswa: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $waiting = WaitingList::find($id);
        if (!$waiting) {
            return response()->json(['error' => 'Data tidak ditemukan'], 404);
        }

        $waiting->delete();
        return response()->json(['success' => true, 'message' => 'Antrian waiting list berhasil dihapus']);
    }
}
