<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $query = Kelas::with(['program', 'guru', 'siswa']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        if ($request->filled('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }

        $kelas = $query->orderBy('nama')->get();

        return response()->json(['data' => $kelas]);
    }

    public function show($id)
    {
        $kelas = Kelas::with(['program', 'guru', 'siswa.orangtua'])->find($id);
        if (!$kelas) {
            return response()->json(['error' => 'Kelas tidak ditemukan'], 404);
        }

        return response()->json(['data' => $kelas]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'program_id' => 'required|string',
            'guru_id' => 'required|string',
            'jadwal_hari' => 'required|array',
            'jam_mulai' => 'required|string',
            'jam_selesai' => 'required|string',
            'kapasitas' => 'nullable|integer|min:1',
        ]);

        $id = 'kls-' . Str::random(8);

        $kelas = Kelas::create([
            'id' => $id,
            'nama' => $request->nama,
            'program_id' => $request->program_id,
            'guru_id' => $request->guru_id,
            'jadwal_hari' => $request->jadwal_hari,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'kapasitas' => $request->kapasitas ?? 6,
            'status' => 'aktif',
        ]);

        LogAktivitas::catat($request->user()?->id, 'tambah_kelas', "Menambahkan kelas {$kelas->nama}", $request->ip());

        return response()->json([
            'message' => 'Kelas berhasil dibuat',
            'data' => $kelas->load(['program', 'guru'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::find($id);
        if (!$kelas) {
            return response()->json(['error' => 'Kelas tidak ditemukan'], 404);
        }

        $kelas->update($request->only([
            'nama', 'program_id', 'guru_id', 'jadwal_hari',
            'jam_mulai', 'jam_selesai', 'kapasitas', 'status'
        ]));

        LogAktivitas::catat($request->user()?->id, 'update_kelas', "Mengubah data kelas {$kelas->nama}", $request->ip());

        return response()->json([
            'message' => 'Kelas berhasil diperbarui',
            'data' => $kelas->load(['program', 'guru'])
        ]);
    }

    public function getSiswa($id)
    {
        $kelas = Kelas::find($id);
        if (!$kelas) {
            return response()->json(['error' => 'Kelas tidak ditemukan'], 404);
        }

        $siswa = $kelas->siswa()->with('orangtua')->get();
        return response()->json(['data' => $siswa]);
    }
}
