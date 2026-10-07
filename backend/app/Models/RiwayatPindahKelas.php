<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatPindahKelas extends Model
{
    use HasFactory;

    protected $table = 'riwayat_pindah_kelas';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'tanggal_pindah' => 'date',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function dariKelas()
    {
        return $this->belongsTo(Kelas::class, 'dari_kelas_id');
    }

    public function keKelas()
    {
        return $this->belongsTo(Kelas::class, 'ke_kelas_id');
    }
}
