<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatLevel extends Model
{
    use HasFactory;

    protected $table = 'riwayat_level';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'progress_persen' => 'integer',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
