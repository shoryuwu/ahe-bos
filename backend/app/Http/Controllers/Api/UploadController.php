<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,webp,pdf|max:10240', // 10MB max
            'folder' => 'nullable|string',
        ]);

        $folder = $request->folder ?? 'uploads';
        $file = $request->file('file');
        $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs("public/{$folder}", $fileName);

        // Generate public URL
        $url = asset("storage/{$folder}/{$fileName}");

        return response()->json([
            'message' => 'File berhasil diupload',
            'url' => $url,
            'path' => $path,
        ], 201);
    }
}
