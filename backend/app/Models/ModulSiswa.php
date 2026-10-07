<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModulSiswa extends Model
{
    use HasFactory;

    protected $table = 'modul_siswa';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'nilai' => 'integer',
        'tanggal_selesai' => 'date',
    ];

    public function modul()
    {
        return $this->belongsTo(Modul::class);
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
