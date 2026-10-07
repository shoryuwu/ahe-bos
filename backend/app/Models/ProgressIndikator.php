<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressIndikator extends Model
{
    use HasFactory;

    protected $table = 'progress_indikator';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'mengenal_huruf' => 'integer',
        'membaca_suku_kata' => 'integer',
        'membaca_kata' => 'integer',
        'membaca_kalimat' => 'integer',
        'membaca_cerita' => 'integer',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
