<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $table = 'program';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'target_capaian' => 'array',
        'urutan' => 'integer',
    ];

    public function kelas()
    {
        return $this->hasMany(Kelas::class);
    }

    public function modul()
    {
        return $this->hasMany(Modul::class)->orderBy('urutan');
    }
}
