<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modul;
use App\Models\ModulSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ModulController extends Controller
{
    public function index(Request $request)
    {
        $query = Modul::with(['program', 'materiPendukung']);

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        $moduls = $query->orderBy('urutan')->get();
        return response()->json(['data' => $moduls]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'program_id' => 'required|string|exists:program,id',
            'kode' => 'required|string',
            'judul' => 'required|string',
        ]);

        $modul = Modul::create([
            'id' => 'mdl-' . Str::random(8),
            'program_id' => $request->program_id,
            'kode' => $request->kode,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'urutan' => $request->urutan ?? 1,
        ]);

        return response()->json([
            'message' => 'Modul berhasil ditambahkan',
            'data' => $modul
        ], 201);
    }

    public function show($id)
    {
        $modul = Modul::with(['program', 'materiPendukung'])->find($id);
        if (!$modul) {
            return response()->json(['error' => 'Modul tidak ditemukan'], 404);
        }

        return response()->json(['data' => $modul]);
    }

    public function update(Request $request, $id)
    {
        $modul = Modul::find($id);
        if (!$modul) {
            return response()->json(['error' => 'Modul tidak ditemukan'], 404);
        }

        $modul->update($request->only(['kode', 'judul', 'deskripsi', 'urutan']));

        return response()->json([
            'message' => 'Modul berhasil diperbarui',
            'data' => $modul
        ]);
    }

    public function destroy($id)
    {
        $modul = Modul::find($id);
        if (!$modul) {
            return response()->json(['error' => 'Modul tidak ditemukan'], 404);
        }

        $modul->delete();
        return response()->json(['message' => 'Modul berhasil dihapus']);
    }

    public function siswaProgress($siswaId)
    {
        $progress = ModulSiswa::with('modul')
            ->where('siswa_id', $siswaId)
            ->get();

        return response()->json(['data' => $progress]);
    }
}
