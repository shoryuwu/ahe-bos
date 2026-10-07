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
}
