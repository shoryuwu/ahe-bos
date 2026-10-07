<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $table = 'guru';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'spesialisasi' => 'array',
        'is_active' => 'boolean',
        'tanggal_gabung' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class);
    }

    public function sesiBelajar()
    {
        return $this->hasMany(SesiBelajar::class);
    }

    public function catatan()
    {
        return $this->hasMany(CatatanGuru::class);
    }
}
