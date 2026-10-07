<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'Email atau password salah'
            ], 401);
        }

        // Check if locked
        if ($user->locked_until && Carbon::now()->lt(Carbon::parse($user->locked_until))) {
            $diff = Carbon::now()->diffInMinutes(Carbon::parse($user->locked_until));
            return response()->json([
                'error' => "Akun terkunci sementara karena 5x gagal login. Coba lagi dalam {$diff} menit atau hubungi admin."
            ], 423);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            $failed = ($user->failed_logins ?? 0) + 1;
            $lockedUntil = null;
            if ($failed >= 5) {
                $lockedUntil = Carbon::now()->addMinutes(15);
            }
            $user->update([
                'failed_logins' => $failed,
                'locked_until' => $lockedUntil,
            ]);

            LogAktivitas::catat($user->id, 'login_gagal', "Percobaan login gagal ($failed/5)", $request->ip());

            if ($failed >= 5) {
                return response()->json([
                    'error' => 'Akun terkunci selama 15 menit karena 5x percobaan login gagal.'
                ], 423);
            }

            return response()->json([
                'error' => "Email atau password salah (Percobaan {$failed}/5)"
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'error' => 'Akun dinonaktifkan. Hubungi admin untuk informasi lebih lanjut.'
            ], 403);
        }

        // Reset failed logins & update last login
        $user->update([
            'failed_logins' => 0,
            'locked_until' => null,
            'last_login_at' => Carbon::now(),
        ]);

        // Create Sanctum Token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Log login success
        LogAktivitas::catat($user->id, 'login_sukses', 'Login berhasil', $request->ip());

        // Load profile if tutor or orangtua
        $profile = null;
        if ($user->role === 'tutor') {
            $profile = $user->guru;
        } elseif ($user->role === 'orangtua') {
            $profile = $user->orangtua;
        }

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama ?? $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'password_reset_required' => $user->password_reset_required,
                'profile' => $profile,
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $profile = null;
        if ($user->role === 'tutor') {
            $profile = $user->guru;
        } elseif ($user->role === 'orangtua') {
            $profile = $user->orangtua;
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama ?? $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'password_reset_required' => $user->password_reset_required,
                'profile' => $profile,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            LogAktivitas::catat($user->id, 'logout', 'Logout berhasil', $request->ip());
        }

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password_lama' => 'required|string',
            'password_baru' => 'required|string|min:6',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password_lama, $user->password)) {
            return response()->json([
                'error' => 'Password lama tidak sesuai'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password_baru),
            'password_reset_required' => false,
        ]);

        LogAktivitas::catat($user->id, 'ganti_password', 'Pengguna mengganti password', $request->ip());

        return response()->json(['message' => 'Password berhasil diperbarui']);
    }
}
