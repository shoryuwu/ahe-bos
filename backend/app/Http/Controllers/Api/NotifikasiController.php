<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()?->id;
        $notifs = Notifikasi::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(30)
            ->get();

        $unreadCount = Notifikasi::where('user_id', $userId)->where('is_read', false)->count();

        return response()->json([
            'data' => $notifs,
            'unread_count' => $unreadCount
        ]);
    }

    public function markAsRead($id)
    {
        $notif = Notifikasi::find($id);
        if ($notif) {
            $notif->update(['is_read' => true]);
        }
        return response()->json(['message' => 'Notifikasi ditandai sudah dibaca']);
    }

    public function markAllAsRead(Request $request)
    {
        $userId = $request->user()?->id;
        Notifikasi::where('user_id', $userId)->update(['is_read' => true]);
        return response()->json(['message' => 'Semua notifikasi ditandai sudah dibaca']);
    }
}
