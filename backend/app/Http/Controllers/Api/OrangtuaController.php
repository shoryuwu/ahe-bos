<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orangtua;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class OrangtuaController extends Controller
{
    public function index(Request $request)
    {
        $query = Orangtua::with(['user', 'siswa.kelas.program']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'ilike', "%{$s}%")
                  ->orWhere('email', 'ilike', "%{$s}%")
                  ->orWhere('no_wa', 'like', "%{$s}%");
            });
        }

        $orangtua = $query->orderBy('nama')->get();
        return response()->json(['data' => $orangtua]);
    }

    public function show($id)
    {
        $orangtua = Orangtua::with(['user', 'siswa.kelas.program', 'siswa.riwayatLevel'])->find($id);
        if (!$orangtua) {
            return response()->json(['error' => 'Data orang tua tidak ditemukan'], 404);
        }

        return response()->json(['data' => $orangtua]);
    }

    public function update(Request $request, $id)
    {
        $orangtua = Orangtua::find($id);
        if (!$orangtua) {
            return response()->json(['error' => 'Data orang tua tidak ditemukan'], 404);
        }

        $orangtua->update($request->only(['nama', 'no_wa', 'alamat', 'hubungan']));

        if ($request->filled('nama') && $orangtua->user) {
            $orangtua->user->update(['nama' => $request->nama, 'name' => $request->nama]);
        }

        LogAktivitas::catat($request->user()?->id, 'update_orangtua', "Mengubah data orang tua {$orangtua->nama}", $request->ip());

        return response()->json([
            'message' => 'Data orang tua berhasil diperbarui',
            'data' => $orangtua->load('siswa')
        ]);
    }

    public function resetPassword(Request $request, $id)
    {
        $orangtua = Orangtua::with('user')->find($id);
        if (!$orangtua || !$orangtua->user) {
            return response()->json(['error' => 'Data orang tua / user tidak ditemukan'], 404);
        }

        $newPassword = $request->new_password ?? 'ortu123';
        $orangtua->user->update([
            'password' => Hash::make($newPassword),
            'password_reset_required' => true,
            'failed_logins' => 0,
            'locked_until' => null,
        ]);

        LogAktivitas::catat($request->user()?->id, 'reset_password_ortu', "Reset password untuk orang tua {$orangtua->nama}", $request->ip());

        return response()->json([
            'message' => "Password berhasil di-reset menjadi: {$newPassword}",
            'new_password' => $newPassword
        ]);
    }
}
