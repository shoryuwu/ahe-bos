<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $query = Guru::with(['user', 'kelas']);

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'ilike', "%{$s}%")
                  ->orWhere('email', 'ilike', "%{$s}%")
                  ->orWhere('no_wa', 'like', "%{$s}%");
            });
        }

        $guru = $query->orderBy('nama')->get();
        return response()->json(['data' => $guru]);
    }

    public function show($id)
    {
        $guru = Guru::with(['user', 'kelas.program', 'sesiBelajar' => function ($q) {
            $q->orderBy('tanggal', 'desc')->take(10);
        }])->find($id);

        if (!$guru) {
            return response()->json(['error' => 'Guru tidak ditemukan'], 404);
        }

        return response()->json(['data' => $guru]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'no_wa' => 'required|string',
            'spesialisasi' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $userId = 'usr-tutor-' . Str::random(6);
            $guruId = 'gru-' . Str::random(8);
            $defaultPassword = $request->password ?? 'tutor123';

            $user = User::create([
                'id' => $userId,
                'name' => $request->nama,
                'nama' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($defaultPassword),
                'role' => 'tutor',
                'is_active' => true,
                'password_reset_required' => true,
            ]);
            $user->assignRole('tutor');

            $guru = Guru::create([
                'id' => $guruId,
                'user_id' => $userId,
                'nama' => $request->nama,
                'no_wa' => $request->no_wa,
                'email' => $request->email,
                'spesialisasi' => $request->spesialisasi ?? ['Membaca Fonik'],
                'tanggal_gabung' => $request->tanggal_gabung ?? now()->toDateString(),
                'is_active' => true,
            ]);

            LogAktivitas::catat($request->user()?->id, 'tambah_guru', "Menambahkan guru {$guru->nama}", $request->ip());

            DB::commit();
            return response()->json([
                'message' => 'Guru berhasil ditambahkan',
                'data' => $guru->load('user')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menambahkan guru: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $guru = Guru::find($id);
        if (!$guru) {
            return response()->json(['error' => 'Guru tidak ditemukan'], 404);
        }

        $guru->update($request->only(['nama', 'no_wa', 'spesialisasi', 'is_active']));

        if ($request->filled('nama') && $guru->user) {
            $guru->user->update(['nama' => $request->nama, 'name' => $request->nama]);
        }

        LogAktivitas::catat($request->user()?->id, 'update_guru', "Mengubah data guru {$guru->nama}", $request->ip());

        return response()->json([
            'message' => 'Data guru berhasil diperbarui',
            'data' => $guru->load('user')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $guru = Guru::find($id);
        if (!$guru) {
            return response()->json(['error' => 'Guru tidak ditemukan'], 404);
        }

        // Soft delete / set active false
        $guru->update(['is_active' => false]);
        if ($guru->user) {
            $guru->user->update(['is_active' => false]);
        }

        LogAktivitas::catat($request->user()?->id, 'nonaktifkan_guru', "Menonaktifkan guru {$guru->nama}", $request->ip());

        return response()->json(['message' => 'Guru berhasil dinonaktifkan']);
    }

    public function getTersedia()
    {
        $guru = Guru::where('is_active', true)->orderBy('nama')->get();
        return response()->json(['data' => $guru]);
    }
}
