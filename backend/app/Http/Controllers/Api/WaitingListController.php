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
        }

        $list = $query->orderBy('urutan_antrian')->get();
        return response()->json(['data' => $list]);
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

        DB::beginTransaction();
        try {
            $pd = $waiting->pendaftaran;

            // Create parent account if not exists
            $user = User::where('email', $pd->email)->first();
            if (!$user) {
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

            // Create student
            $siswa = Siswa::create([
                'id' => 'sis-' . Str::random(8),
                'orangtua_id' => $orangtua->id,
                'nama' => $pd->nama_anak,
                'tempat_lahir' => $pd->tempat_lahir,
                'tanggal_lahir' => $pd->tanggal_lahir,
                'jenis_kelamin' => $pd->jenis_kelamin,
                'level_saat_ini' => 'Pra Membaca',
                'kelas_id' => $request->kelas_id,
                'status' => 'aktif',
                'tanggal_masuk' => now()->toDateString(),
            ]);

            $waiting->update(['status' => 'ditempatkan']);
            $pd->update(['status' => 'diterima', 'siswa_id' => $siswa->id]);

            LogAktivitas::catat($request->user()?->id, 'assign_waiting_list', "Menempatkan antrian {$waiting->id} ke kelas {$request->kelas_id}", $request->ip());

            DB::commit();
            return response()->json([
                'message' => 'Siswa dari waiting list berhasil ditempatkan di kelas',
                'data' => $siswa
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

        $waiting->update(['status' => 'dibatalkan']);
        return response()->json(['message' => 'Antrian waiting list dibatalkan']);
    }
}
