<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MateriPendukung extends Model
{
    use HasFactory;

    protected $table = 'materi_pendukung';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'share_ke_ortu' => 'boolean',
    ];

    public function modul()
    {
        return $this->belongsTo(Modul::class);
    }
}
