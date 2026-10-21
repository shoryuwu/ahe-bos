<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::with(['modul'])->withCount(['kelas'])->orderBy('urutan')->get();
        return response()->json(['data' => $programs]);
    }

    public function show($id)
    {
        $program = Program::with(['modul.materiPendukung', 'kelas.guru'])->find($id);
        if (!$program) {
            return response()->json(['error' => 'Program tidak ditemukan'], 404);
        }

        return response()->json(['data' => $program]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'nullable|string|max:50',
            'deskripsi' => 'nullable|string',
            'urutan' => 'nullable|integer',
            'durasi_estimasi' => 'nullable|string',
            'rentang_usia' => 'nullable|string',
        ]);

        $id = 'prg-' . \Illuminate\Support\Str::random(6);
        $kode = $request->kode ?: 'PRG-' . strtoupper(\Illuminate\Support\Str::random(4));

        $program = Program::create([
            'id' => $id,
            'kode' => $kode,
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'urutan' => $request->urutan ?? ((Program::max('urutan') ?? 0) + 1),
            'durasi_estimasi' => $request->durasi_estimasi,
            'rentang_usia' => $request->rentang_usia,
            'target_capaian' => $request->target_capaian,
            'icon' => $request->icon,
        ]);

        \App\Models\LogAktivitas::catat($request->user()?->id, 'tambah_program', "Menambahkan program {$program->nama}", $request->ip());

        return response()->json([
            'message' => 'Program berhasil dibuat',
            'data' => $program
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $program = Program::find($id);
        if (!$program) {
            return response()->json(['error' => 'Program tidak ditemukan'], 404);
        }

        $data = array_filter($request->only([
            'nama', 'kode', 'deskripsi', 'urutan', 'durasi_estimasi', 'rentang_usia', 'target_capaian', 'icon'
        ]), function ($val) {
            return !is_null($val) && $val !== '';
        });

        $program->update($data);

        \App\Models\LogAktivitas::catat($request->user()?->id, 'update_program', "Mengubah program {$program->nama}", $request->ip());

        return response()->json([
            'message' => 'Program berhasil diperbarui',
            'data' => $program
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $program = Program::find($id);
        if (!$program) {
            return response()->json(['error' => 'Program tidak ditemukan'], 404);
        }

        $nama = $program->nama;
        $program->delete();

        \App\Models\LogAktivitas::catat($request->user()?->id, 'hapus_program', "Menghapus program {$nama}", $request->ip());

        return response()->json(['success' => true, 'message' => "Program {$nama} berhasil dihapus"]);
    }
}
