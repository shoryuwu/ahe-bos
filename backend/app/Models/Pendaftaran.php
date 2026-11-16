<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    use HasFactory;

    protected $table = 'pendaftaran';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'preferensi_jadwal' => 'array',
    ];

    protected $appends = [
        'program_nama',
        'no_wa_ortu',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class, 'program_diminati');
    }

    public function getProgramNamaAttribute(): string
    {
        return $this->program?->nama ?? (string) ($this->program_diminati ?? '-');
    }

    public function getNoWaOrtuAttribute(): string
    {
        return (string) ($this->no_wa ?? '');
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
