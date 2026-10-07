<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoPembelajaran extends Model
{
    use HasFactory;

    protected $table = 'video_pembelajaran';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    public function siswa()
    {
        return $this->belongsToMany(Siswa::class, 'video_siswa', 'video_id', 'siswa_id');
    }
}
