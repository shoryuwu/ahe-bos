<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periode_akademik', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('status')->default('aktif'); // aktif, selesai
            $table->text('catatan')->nullable();
            $table->timestamps();
        });

        Schema::create('modul_siswa', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('modul_id');
            $table->foreign('modul_id')->references('id')->on('modul')->onDelete('cascade');
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('sesi_id')->nullable();
            $table->foreign('sesi_id')->references('id')->on('sesi_belajar')->onDelete('set null');
            $table->string('status')->default('belum'); // belum, sedang, selesai
            $table->integer('nilai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->timestamps();
        });

        Schema::create('materi_pendukung', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('modul_id');
            $table->foreign('modul_id')->references('id')->on('modul')->onDelete('cascade');
            $table->string('tipe'); // pdf, video, gambar
            $table->string('judul');
            $table->string('url');
            $table->boolean('share_ke_ortu')->default(true);
            $table->timestamps();
        });

        Schema::create('video_pembelajaran', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('guru_id');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('youtube_url');
            $table->string('level');
            $table->string('target_tipe')->default('kelas'); // kelas, siswa
            $table->string('target_id');
            $table->timestamps();
        });

        Schema::create('video_siswa', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('video_id');
            $table->foreign('video_id')->references('id')->on('video_pembelajaran')->onDelete('cascade');
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_siswa');
        Schema::dropIfExists('video_pembelajaran');
        Schema::dropIfExists('materi_pendukung');
        Schema::dropIfExists('modul_siswa');
        Schema::dropIfExists('periode_akademik');
    }
};
