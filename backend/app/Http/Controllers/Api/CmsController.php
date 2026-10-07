<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use App\Models\Testimoni;
use App\Models\Faq;
use App\Models\Pengaturan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsController extends Controller
{
    // === GALERI ===
    public function getGaleri()
    {
        $galeri = Galeri::orderBy('urutan')->get();
        return response()->json(['data' => $galeri]);
    }

    public function storeGaleri(Request $request)
    {
        $request->validate([
            'image_url' => 'required|string',
            'caption' => 'required|string',
            'kategori' => 'nullable|string',
        ]);

        $item = Galeri::create([
            'id' => 'glr-' . Str::random(8),
            'image_url' => $request->image_url,
            'caption' => $request->caption,
            'kategori' => $request->kategori ?? 'Aktivitas',
            'urutan' => $request->urutan ?? 0,
        ]);

        return response()->json(['message' => 'Foto galeri berhasil ditambahkan', 'data' => $item], 201);
    }

    public function destroyGaleri($id)
    {
        $item = Galeri::find($id);
        if (!$item) return response()->json(['error' => 'Foto tidak ditemukan'], 404);
        $item->delete();
        return response()->json(['message' => 'Foto galeri berhasil dihapus']);
    }

    // === TESTIMONI ===
    public function getTestimoni(Request $request)
    {
        $query = Testimoni::query();
        if ($request->has('tampil_only')) {
            $query->where('is_tampil', true);
        }
        $testimoni = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $testimoni]);
    }

    public function storeTestimoni(Request $request)
    {
        $request->validate([
            'nama_ortu' => 'required|string',
            'nama_anak' => 'required|string',
            'ulasan' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'program' => 'required|string',
        ]);

        $item = Testimoni::create([
            'id' => 'tst-' . Str::random(8),
            'nama_ortu' => $request->nama_ortu,
            'nama_anak' => $request->nama_anak,
            'usia_anak' => $request->usia_anak ?? 5,
            'ulasan' => $request->ulasan,
            'rating' => $request->rating,
            'program' => $request->program,
            'is_tampil' => true,
        ]);

        return response()->json(['message' => 'Testimoni berhasil ditambahkan', 'data' => $item], 201);
    }

    public function updateTestimoni(Request $request, $id)
    {
        $item = Testimoni::find($id);
        if (!$item) return response()->json(['error' => 'Testimoni tidak ditemukan'], 404);

        $item->update($request->only(['nama_ortu', 'nama_anak', 'usia_anak', 'ulasan', 'rating', 'program', 'is_tampil']));
        return response()->json(['message' => 'Testimoni berhasil diperbarui', 'data' => $item]);
    }

    public function destroyTestimoni($id)
    {
        $item = Testimoni::find($id);
        if (!$item) return response()->json(['error' => 'Testimoni tidak ditemukan'], 404);
        $item->delete();
        return response()->json(['message' => 'Testimoni berhasil dihapus']);
    }

    // === FAQ ===
    public function getFaq(Request $request)
    {
        $query = Faq::query();
        if ($request->has('aktif_only')) {
            $query->where('is_aktif', true);
        }
        $faq = $query->orderBy('urutan')->get();
        return response()->json(['data' => $faq]);
    }

    public function storeFaq(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban' => 'required|string',
        ]);

        $item = Faq::create([
            'id' => 'faq-' . Str::random(8),
            'pertanyaan' => $request->pertanyaan,
            'jawaban' => $request->jawaban,
            'urutan' => $request->urutan ?? 0,
            'is_aktif' => true,
        ]);

        return response()->json(['message' => 'FAQ berhasil ditambahkan', 'data' => $item], 201);
    }

    public function updateFaq(Request $request, $id)
    {
        $item = Faq::find($id);
        if (!$item) return response()->json(['error' => 'FAQ tidak ditemukan'], 404);

        $item->update($request->only(['pertanyaan', 'jawaban', 'urutan', 'is_aktif']));
        return response()->json(['message' => 'FAQ berhasil diperbarui', 'data' => $item]);
    }

    public function destroyFaq($id)
    {
        $item = Faq::find($id);
        if (!$item) return response()->json(['error' => 'FAQ tidak ditemukan'], 404);
        $item->delete();
        return response()->json(['message' => 'FAQ berhasil dihapus']);
    }

    // === PENGATURAN ===
    public function getPengaturan()
    {
        $settings = Pengaturan::all()->pluck('value', 'key');
        return response()->json(['data' => $settings]);
    }

    public function updatePengaturan(Request $request)
    {
        $data = $request->all();
        foreach ($data as $key => $value) {
            Pengaturan::set($key, is_array($value) ? json_encode($value) : (string)$value);
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan']);
    }
}
