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

    protected $appends = ['tutor', 'kehadiran_persen', 'progress_persen'];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
    ];

    public function getKehadiranPersenAttribute(): int
    {
        $total = $this->absensi()->count();
        if ($total === 0) return 100;
        $hadir = $this->absensi()->where('status', 'hadir')->count();
        return (int) round(($hadir / $total) * 100);
    }

    public function getProgressPersenAttribute(): int
    {
        $latest = $this->progressIndikator()->orderBy('bulan', 'desc')->first();
        if (!$latest) return 0;
        return (int) round((
            ($latest->mengenal_huruf ?? 0) +
            ($latest->membaca_suku_kata ?? 0) +
            ($latest->membaca_kata ?? 0) +
            ($latest->membaca_kalimat ?? 0) +
            ($latest->membaca_cerita ?? 0)
        ) / 5);
    }

    public function getTutorAttribute()
    {
        $guru = $this->kelas?->guru;
        if (!$guru) return null;
        return [
            'id' => $guru->id,
            'nama' => $guru->nama,
            'no_wa' => $guru->no_wa,
            'email' => $guru->email,
        ];
    }

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
