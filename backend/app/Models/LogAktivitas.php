<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    protected $table = 'log_aktivitas';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function catat($userId, $aksi, $detail = null, $ipAddress = null)
    {
        return static::create([
            'id' => 'log-' . \Illuminate\Support\Str::random(12),
            'user_id' => $userId,
            'aksi' => $aksi,
            'detail' => $detail,
            'ip_address' => $ipAddress,
        ]);
    }
}
