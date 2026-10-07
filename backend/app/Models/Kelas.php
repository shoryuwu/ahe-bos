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
