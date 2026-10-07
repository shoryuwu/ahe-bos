<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress_indikator', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('bulan'); // format YYYY-MM
            $table->integer('mengenal_huruf')->default(0); // 0-100
            $table->integer('membaca_suku_kata')->default(0);
            $table->integer('membaca_kata')->default(0);
            $table->integer('membaca_kalimat')->default(0);
            $table->integer('membaca_cerita')->default(0);
            $table->string('updated_by')->nullable();
            $table->timestamps();
        });

        Schema::create('kosakata', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('kata');
            $table->string('kategori'); // huruf, suku-kata, kata, kalimat
            $table->boolean('dikuasai')->default(false);
            $table->timestamp('tanggal_dikuasai')->nullable();
            $table->timestamps();
        });

        Schema::create('riwayat_level', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('level');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->string('status')->default('sedang'); // selesai, sedang, belum
            $table->integer('progress_persen')->default(0);
            $table->timestamps();
        });

        Schema::create('asesmen', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('guru_id');
            $table->foreign('guru_id')->references('id')->on('guru')->onDelete('cascade');
            $table->string('dari_level');
            $table->string('ke_level');
            $table->date('tanggal_pengajuan');
            $table->integer('nilai_tertulis')->default(0);
            $table->integer('nilai_praktik')->default(0);
            $table->json('checklist_indikator')->nullable();
            $table->text('catatan_evaluasi')->nullable();
            $table->string('rekomendasi')->default('lulus'); // lulus, belum-siap
            $table->string('status')->default('menunggu'); // menunggu, disetujui, ditolak
            $table->string('disetujui_oleh')->nullable();
            $table->date('tanggal_persetujuan')->nullable();
            $table->timestamps();
        });

        Schema::create('pencapaian', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('siswa_id');
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->string('nama_badge');
            $table->string('ikon');
            $table->string('kategori'); // kehadiran, nilai, milestone, kosakata, semangat
            $table->text('deskripsi');
            $table->date('tanggal_raih');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pencapaian');
        Schema::dropIfExists('asesmen');
        Schema::dropIfExists('riwayat_level');
        Schema::dropIfExists('kosakata');
        Schema::dropIfExists('progress_indikator');
    }
};
