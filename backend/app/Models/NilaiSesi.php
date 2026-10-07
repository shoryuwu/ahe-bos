<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiSesi extends Model
{
    use HasFactory;

    protected $table = 'nilai_sesi';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'nilai' => 'integer',
        'mood' => 'integer',
        'langkah_selesai' => 'array',
    ];

    public function sesi()
    {
        return $this->belongsTo(SesiBelajar::class, 'sesi_id');
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
