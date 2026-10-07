<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modul', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('program_id');
            $table->foreign('program_id')->references('id')->on('program')->onDelete('cascade');
            $table->string('kode');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->integer('urutan')->default(1);
            $table->timestamps();
        });

        Schema::create('sesi_belajar', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kelas_id');
            $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('cascade');
            $table->string('guru_id');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->string('guru_pengganti_id')->nullable();
            $table->foreign('guru_pengganti_id')->references('id')->on('guru')->onDelete('set null');
            $table->string('modul_id')->nullable();
            $table->foreign('modul_id')->references('id')->on('modul')->onDelete('set null');
            $table->string('periode_id')->nullable();
            $table->date('tanggal');
            $table->string('materi')->nullable();
            $table->text('catatan_umum')->nullable();
            $table->string('status_sesi')->default('terjadwal'); // terjadwal, selesai, dibatalkan
            $table->timestamps();
        });

        Schema::create('absensi', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('sesi_id');
            $table->foreign('sesi_id')->references('id')->on('sesi_belajar')->onDelete('cascade');
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('status')->default('hadir'); // hadir, izin, sakit, alpha
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('nilai_sesi', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('sesi_id');
            $table->foreign('sesi_id')->references('id')->on('sesi_belajar')->onDelete('cascade');
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->integer('nilai')->default(0);
            $table->integer('mood')->default(3); // 1-5
            $table->json('langkah_selesai')->nullable(); // array of step numbers 1-6
            $table->text('catatan')->nullable();
            $table->timestamps();
        });

        Schema::create('catatan_guru', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('guru_id');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->date('tanggal');
            $table->text('catatan');
            $table->string('tipe')->default('progress'); // progress, saran, pencapaian
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catatan_guru');
        Schema::dropIfExists('nilai_sesi');
        Schema::dropIfExists('absensi');
        Schema::dropIfExists('sesi_belajar');
        Schema::dropIfExists('modul');
    }
};
