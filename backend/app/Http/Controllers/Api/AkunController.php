<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AkunController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['roles', 'guru', 'orangtua']);

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'ilike', "%{$s}%")
                  ->orWhere('email', 'ilike', "%{$s}%");
            });
        }

        $users = $query->orderBy('nama')->get();
        return response()->json(['data' => $users]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,tutor,orangtua',
        ]);

        $id = 'usr-' . $request->role . '-' . Str::random(6);

        $user = User::create([
            'id' => $id,
            'name' => $request->nama,
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
            'password_reset_required' => true,
        ]);
        $user->assignRole($request->role);

        LogAktivitas::catat($request->user()?->id, 'buat_akun', "Membuat akun {$user->email} dengan role {$user->role}", $request->ip());

        return response()->json([
            'message' => 'Akun berhasil dibuat',
            'data' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User tidak ditemukan'], 404);

        $user->update($request->only(['nama', 'name', 'is_active', 'role']));
        if ($request->filled('role')) {
            $user->syncRoles([$request->role]);
        }

        LogAktivitas::catat($request->user()?->id, 'update_akun', "Mengubah akun {$user->email}", $request->ip());

        return response()->json(['message' => 'Akun berhasil diperbarui', 'data' => $user]);
    }

    public function resetPassword(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User tidak ditemukan'], 404);

        $newPassword = $request->new_password ?? 'ahe12345';

        $user->update([
            'password' => Hash::make($newPassword),
            'password_reset_required' => true,
            'failed_logins' => 0,
            'locked_until' => null,
        ]);

        LogAktivitas::catat($request->user()?->id, 'reset_password', "Reset password akun {$user->email}", $request->ip());

        return response()->json([
            'message' => "Password akun {$user->email} berhasil direset menjadi: {$newPassword}",
            'new_password' => $newPassword
        ]);
    }

    public function unlock($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'User tidak ditemukan'], 404);

        $user->update([
            'failed_logins' => 0,
            'locked_until' => null,
        ]);

        LogAktivitas::catat(request()->user()?->id, 'unlock_akun', "Membuka kunci akun {$user->email}", request()->ip());

        return response()->json(['message' => "Kunci akun {$user->email} berhasil dibuka"]);
    }
}
