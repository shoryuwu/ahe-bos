<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pencapaian;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PencapaianController extends Controller
{
    public function indexSiswa($siswaId)
    {
        $siswa = Siswa::find($siswaId);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $pencapaian = Pencapaian::where('siswa_id', $siswaId)->orderBy('tanggal_raih', 'desc')->get();
        return response()->json(['data' => $pencapaian]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|string|exists:siswa,id',
            'nama_badge' => 'required|string',
            'ikon' => 'required|string',
            'kategori' => 'required|string',
            'deskripsi' => 'required|string',
        ]);

        $badge = Pencapaian::create([
            'id' => 'ach-' . Str::random(8),
            'siswa_id' => $request->siswa_id,
            'nama_badge' => $request->nama_badge,
            'ikon' => $request->ikon,
            'kategori' => $request->kategori,
            'deskripsi' => $request->deskripsi,
            'tanggal_raih' => $request->tanggal_raih ?? now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Badge berhasil diberikan',
            'data' => $badge
        ], 201);
    }
}
