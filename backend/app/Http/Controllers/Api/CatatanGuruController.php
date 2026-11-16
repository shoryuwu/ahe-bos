<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatatanGuru;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CatatanGuruController extends Controller
{
    public function indexSiswa(Request $request, $siswaId)
    {
        $siswa = Siswa::with('orangtua')->find($siswaId);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $user = $request->user();
        if ($user && $user->role === 'orangtua' && (!$siswa->orangtua || $siswa->orangtua->user_id !== $user->id)) {
            return response()->json(['error' => 'Anda tidak memiliki akses terhadap catatan anak ini'], 403);
        }

        $catatan = CatatanGuru::with('guru')
            ->where('siswa_id', $siswaId)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json(['data' => $catatan]);
    }

    public function store(Request $request)
    {
        $siswa = Siswa::with(['kelas', 'orangtua'])->find($request->siswa_id);
        $guruId = $request->input('guru_id')
            ?? $request->user()?->guru?->id
            ?? ($request->user() ? \App\Models\Guru::where('email', $request->user()->email)->value('id') : null)
            ?? $siswa?->kelas?->guru_id;

        if ($guruId) {
            $request->merge(['guru_id' => $guruId]);
        }

        $request->validate([
            'siswa_id' => 'required|string|exists:siswa,id',
            'guru_id' => 'required|string|exists:guru,id',
            'catatan' => 'required|string',
            'tipe' => 'nullable|in:progress,saran,pencapaian',
        ]);

        $catatan = CatatanGuru::create([
            'id' => 'cg-' . Str::random(8),
            'siswa_id' => $request->siswa_id,
            'guru_id' => $guruId,
            'tanggal' => $request->tanggal ?? now()->toDateString(),
            'catatan' => $request->catatan,
            'tipe' => $request->tipe ?? 'progress',
        ]);

        if ($siswa && $siswa->orangtua && $siswa->orangtua->user_id) {
            \App\Models\Notifikasi::kirim(
                $siswa->orangtua->user_id,
                'Catatan Baru dari Tutor',
                "Tutor mengirimkan catatan evaluasi untuk ananda {$siswa->nama}: \"{$request->catatan}\"",
                'info',
                '/orangtua'
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Catatan guru berhasil dikirim ke dashboard orang tua',
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
