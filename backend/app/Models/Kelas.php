<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'jadwal_hari' => 'array',
        'kapasitas' => 'integer',
    ];

    protected $appends = [
        'siswa_count',
        'guru_nama',
        'program_nama',
    ];

    public function getSiswaCountAttribute(): int
    {
        if (array_key_exists('siswa_count', $this->attributes)) {
            return (int) $this->attributes['siswa_count'];
        }
        if ($this->relationLoaded('siswa')) {
            return $this->siswa->where('status', 'aktif')->count();
        }
        return $this->siswa()->where('status', 'aktif')->count();
    }

    public function getGuruNamaAttribute(): string
    {
        return $this->guru?->nama ?? '-';
    }

    public function getProgramNamaAttribute(): string
    {
        return $this->program?->nama ?? '-';
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }

    public function sesiBelajar()
    {
        return $this->hasMany(SesiBelajar::class);
    }
}
