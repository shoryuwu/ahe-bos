<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modul extends Model
{
    use HasFactory;

    protected $table = 'modul';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'urutan' => 'integer',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function materiPendukung()
    {
        return $this->hasMany(MateriPendukung::class);
    }
}
