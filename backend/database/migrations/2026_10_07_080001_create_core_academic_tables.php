<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guru', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('nama');
            $table->string('no_wa');
            $table->string('email');
            $table->json('spesialisasi')->nullable();
            $table->date('tanggal_gabung');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('orangtua', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('nama');
            $table->string('no_wa');
            $table->string('email');
            $table->text('alamat')->nullable();
            $table->string('hubungan')->default('ibu'); // ayah, ibu, wali
            $table->timestamps();
        });

        Schema::create('program', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kode')->unique();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->json('target_capaian')->nullable();
            $table->string('durasi_estimasi')->nullable();
            $table->string('rentang_usia')->nullable();
            $table->integer('urutan')->default(1);
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        Schema::create('kelas', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama');
            $table->string('program_id');
            $table->foreign('program_id')->references('id')->on('program')->onDelete('cascade');
            $table->string('guru_id');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->json('jadwal_hari')->nullable();
            $table->string('jam_mulai')->nullable();
            $table->string('jam_selesai')->nullable();
            $table->integer('kapasitas')->default(6);
            $table->string('status')->default('aktif'); // aktif, penuh, nonaktif
            $table->timestamps();
        });

        Schema::create('siswa', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('orangtua_id');
            $table->foreign('orangtua_id')->references('id')->on('orangtua')->onDelete('cascade');
            $table->string('nama');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir');
            $table->string('jenis_kelamin', 2); // L, P
            $table->string('level_saat_ini')->default('Pra Membaca');
            $table->string('kelas_id')->nullable();
            $table->foreign('kelas_id')->references('id')->on('kelas')->onDelete('set null');
            $table->string('status')->default('aktif'); // aktif, nonaktif, lulus
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa');
        Schema::dropIfExists('kelas');
        Schema::dropIfExists('program');
        Schema::dropIfExists('orangtua');
        Schema::dropIfExists('guru');
    }
};
