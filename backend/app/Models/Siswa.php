<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswa';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
    ];

    public function orangtua()
    {
        return $this->belongsTo(Orangtua::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }

    public function nilaiSesi()
    {
        return $this->hasMany(NilaiSesi::class);
    }

    public function catatan()
    {
        return $this->hasMany(CatatanGuru::class);
    }

    public function progressIndikator()
    {
        return $this->hasMany(ProgressIndikator::class);
    }

    public function kosakata()
    {
        return $this->hasMany(Kosakata::class);
    }

    public function riwayatLevel()
    {
        return $this->hasMany(RiwayatLevel::class);
    }

    public function asesmen()
    {
        return $this->hasMany(Asesmen::class);
    }

    public function pencapaian()
    {
        return $this->hasMany(Pencapaian::class);
    }

    public function modulSiswa()
    {
        return $this->hasMany(ModulSiswa::class);
    }
}
