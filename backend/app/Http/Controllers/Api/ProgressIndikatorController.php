<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgressIndikator;
use App\Models\Siswa;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgressIndikatorController extends Controller
{
    public function show($siswaId)
    {
        $siswa = Siswa::find($siswaId);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $progress = ProgressIndikator::where('siswa_id', $siswaId)
            ->orderBy('bulan', 'asc')
            ->get();

        return response()->json(['data' => $progress]);
    }

    public function update(Request $request, $siswaId)
    {
        $request->validate([
            'bulan' => 'required|string',
            'mengenal_huruf' => 'required|integer|min:0|max:100',
            'membaca_suku_kata' => 'required|integer|min:0|max:100',
            'membaca_kata' => 'required|integer|min:0|max:100',
            'membaca_kalimat' => 'required|integer|min:0|max:100',
            'membaca_cerita' => 'required|integer|min:0|max:100',
        ]);

        $siswa = Siswa::find($siswaId);
        if (!$siswa) {
            return response()->json(['error' => 'Siswa tidak ditemukan'], 404);
        }

        $progress = ProgressIndikator::updateOrCreate(
            ['siswa_id' => $siswaId, 'bulan' => $request->bulan],
            [
                'id' => ProgressIndikator::where(['siswa_id' => $siswaId, 'bulan' => $request->bulan])->value('id') ?? ('pi-' . Str::random(8)),
                'mengenal_huruf' => $request->mengenal_huruf,
                'membaca_suku_kata' => $request->membaca_suku_kata,
                'membaca_kata' => $request->membaca_kata,
                'membaca_kalimat' => $request->membaca_kalimat,
                'membaca_cerita' => $request->membaca_cerita,
                'updated_by' => $request->user()?->nama ?? $request->user()?->name,
            ]
        );

        LogAktivitas::catat($request->user()?->id, 'update_progress', "Update progress indikator bulan {$request->bulan} untuk siswa {$siswa->nama}", $request->ip());

        return response()->json([
            'message' => 'Progress indikator berhasil disimpan',
            'data' => $progress
        ]);
    }
}
