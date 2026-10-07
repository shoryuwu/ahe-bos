<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatatanGuru;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CatatanGuruController extends Controller
{
    public function indexSiswa($siswaId)
    {
        $siswa = Siswa::find($siswaId);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $catatan = CatatanGuru::with('guru')
            ->where('siswa_id', $siswaId)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json(['data' => $catatan]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|string|exists:siswa,id',
            'guru_id' => 'required|string|exists:guru,id',
            'catatan' => 'required|string',
            'tipe' => 'nullable|in:progress,saran,pencapaian',
        ]);

        $catatan = CatatanGuru::create([
            'id' => 'cg-' . Str::random(8),
            'siswa_id' => $request->siswa_id,
            'guru_id' => $request->guru_id,
            'tanggal' => $request->tanggal ?? now()->toDateString(),
            'catatan' => $request->catatan,
            'tipe' => $request->tipe ?? 'progress',
        ]);

        return response()->json([
            'message' => 'Catatan guru berhasil ditambahkan',
            'data' => $catatan->load('guru')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $catatan = CatatanGuru::find($id);
        if (!$catatan) {
            return response()->json(['error' => 'Catatan tidak ditemukan'], 404);
        }

        $catatan->update($request->only(['catatan', 'tipe', 'tanggal']));

        return response()->json([
            'message' => 'Catatan guru berhasil diperbarui',
            'data' => $catatan
        ]);
    }

    public function destroy($id)
    {
        $catatan = CatatanGuru::find($id);
        if (!$catatan) {
            return response()->json(['error' => 'Catatan tidak ditemukan'], 404);
        }

        $catatan->delete();
        return response()->json(['message' => 'Catatan guru berhasil dihapus']);
    }
}
