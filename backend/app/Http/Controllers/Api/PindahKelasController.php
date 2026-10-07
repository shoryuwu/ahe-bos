<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\RiwayatPindahKelas;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PindahKelasController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|string|exists:siswa,id',
            'ke_kelas_id' => 'required|string|exists:kelas,id',
            'alasan' => 'required|string',
        ]);

        $siswa = Siswa::find($request->siswa_id);
        $kelasTujuan = Kelas::find($request->ke_kelas_id);

        // Check kapasitas
        if ($kelasTujuan->siswa()->count() >= $kelasTujuan->kapasitas) {
            return response()->json(['error' => 'Kelas tujuan sudah penuh'], 422);
        }

        DB::beginTransaction();
        try {
            $dariKelasId = $siswa->kelas_id;

            RiwayatPindahKelas::create([
                'id' => 'rpk-' . Str::random(8),
                'siswa_id' => $siswa->id,
                'dari_kelas_id' => $dariKelasId,
                'ke_kelas_id' => $kelasTujuan->id,
                'alasan' => $request->alasan,
                'catatan' => $request->catatan,
                'dipindah_oleh' => $request->user()?->nama ?? $request->user()?->name ?? 'Admin',
                'tanggal_pindah' => now()->toDateString(),
            ]);

            $siswa->update(['kelas_id' => $kelasTujuan->id]);

            LogAktivitas::catat($request->user()?->id, 'pindah_kelas', "Memindahkan siswa {$siswa->nama} ke kelas {$kelasTujuan->nama}", $request->ip());

            DB::commit();
            return response()->json([
                'message' => 'Siswa berhasil dipindahkan ke kelas baru',
                'data' => $siswa->load('kelas')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal memindahkan siswa: ' . $e->getMessage()], 500);
        }
    }
}
