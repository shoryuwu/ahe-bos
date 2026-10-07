<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('judul');
            $table->text('pesan');
            $table->string('tipe')->default('info'); // info, sukses, peringatan, asesmen
            $table->string('link')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('galeri', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('image_url');
            $table->string('caption');
            $table->string('kategori')->default('Aktivitas');
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });

        Schema::create('testimoni', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama_ortu');
            $table->string('nama_anak');
            $table->integer('usia_anak')->default(5);
            $table->text('ulasan');
            $table->integer('rating')->default(5);
            $table->string('program');
            $table->boolean('is_tampil')->default(true);
            $table->timestamps();
        });

        Schema::create('faq', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('pertanyaan');
            $table->text('jawaban');
            $table->integer('urutan')->default(0);
            $table->boolean('is_aktif')->default(true);
            $table->timestamps();
        });

        Schema::create('pengaturan', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('aksi');
            $table->text('detail')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
        Schema::dropIfExists('pengaturan');
        Schema::dropIfExists('faq');
        Schema::dropIfExists('testimoni');
        Schema::dropIfExists('galeri');
        Schema::dropIfExists('notifikasi');
    }
};
