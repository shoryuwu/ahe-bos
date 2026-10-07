<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kosakata;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KosakataController extends Controller
{
    public function indexSiswa($siswaId)
    {
        $siswa = Siswa::find($siswaId);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $kosakata = Kosakata::where('siswa_id', $siswaId)->orderBy('kata')->get();
        return response()->json(['data' => $kosakata]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|string|exists:siswa,id',
            'kata' => 'required|string',
            'kategori' => 'required|in:huruf,suku-kata,kata,kalimat',
        ]);

        $kosakata = Kosakata::create([
            'id' => 'ks-' . Str::random(8),
            'siswa_id' => $request->siswa_id,
            'kata' => $request->kata,
            'kategori' => $request->kategori,
            'dikuasai' => $request->dikuasai ?? false,
            'tanggal_dikuasai' => $request->dikuasai ? now() : null,
        ]);

        return response()->json([
            'message' => 'Kosakata berhasil ditambahkan',
            'data' => $kosakata
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $kosakata = Kosakata::find($id);
        if (!$kosakata) {
            return response()->json(['error' => 'Kosakata tidak ditemukan'], 404);
        }

        $dikuasai = $request->has('dikuasai') ? filter_var($request->dikuasai, FILTER_VALIDATE_BOOLEAN) : $kosakata->dikuasai;

        $kosakata->update([
            'dikuasai' => $dikuasai,
            'tanggal_dikuasai' => $dikuasai ? now() : null,
        ]);

        return response()->json([
            'message' => 'Status kosakata berhasil diperbarui',
            'data' => $kosakata
        ]);
    }
}
