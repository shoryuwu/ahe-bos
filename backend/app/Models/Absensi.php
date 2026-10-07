<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function sesi()
    {
        return $this->belongsTo(SesiBelajar::class, 'sesi_id');
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
