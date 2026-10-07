<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('no_registrasi')->unique();
            $table->string('tipe_pendaftaran')->default('reguler'); // reguler, trial
            $table->string('nama_anak');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir');
            $table->string('jenis_kelamin', 2); // L, P
            $table->string('nama_ortu');
            $table->string('hubungan_ortu')->default('ibu'); // ayah, ibu, wali
            $table->string('no_wa');
            $table->string('email');
            $table->text('alamat');
            $table->string('program_diminati');
            $table->json('preferensi_jadwal')->nullable();
            $table->text('catatan_khusus')->nullable();
            $table->string('status')->default('menunggu'); // menunggu, diproses, diterima, ditolak, ditunda
            $table->text('alasan_penolakan')->nullable();
            $table->string('siswa_id')->nullable();
            $table->timestamps();
        });

        Schema::create('waiting_list', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('pendaftaran_id');
            $table->foreign('pendaftaran_id')->references('id')->on('pendaftaran')->onDelete('cascade');
            $table->string('program_id');
            $table->foreign('program_id')->references('id')->on('program')->onDelete('cascade');
            $table->json('preferensi_jadwal')->nullable();
            $table->integer('urutan_antrian')->default(1);
            $table->string('status')->default('menunggu'); // menunggu, ditempatkan, dibatalkan
            $table->timestamps();
        });

        Schema::create('riwayat_pindah_kelas', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('dari_kelas_id')->nullable();
            $table->foreign('dari_kelas_id')->references('id')->on('kelas')->onDelete('set null');
            $table->string('ke_kelas_id');
            $table->foreign('ke_kelas_id')->references('id')->on('kelas')->onDelete('cascade');
            $table->text('alasan');
            $table->text('catatan')->nullable();
            $table->string('dipindah_oleh');
            $table->date('tanggal_pindah');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_pindah_kelas');
        Schema::dropIfExists('waiting_list');
        Schema::dropIfExists('pendaftaran');
    }
};
